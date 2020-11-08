import { Repository } from "@aws-cdk/aws-codecommit";
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import {
    CloudFormationCreateUpdateStackAction,
    CodeBuildAction,
    CodeCommitSourceAction,
    S3DeployAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { CfnParametersCode } from "@aws-cdk/aws-lambda";
import { Bucket } from "@aws-cdk/aws-s3";
import { App, Stack, StackProps } from "@aws-cdk/core";
import { CONTENT_BUCKET_NAME } from "../config/constants";
import { ClientBuilder } from "./builders/client-builder";
import { InfrastructureBuilder } from "./builders/infrastructure-builder";
import { ServerBuilder } from "./builders/server-builder";

export interface PipelineStackProps extends StackProps {
    readonly code: CfnParametersCode;
    readonly repository: string;
}

export class PipelineStack extends Stack {
    constructor(app: App, id: string, props: PipelineStackProps) {
        super(app, id, props);

        const code = Repository.fromRepositoryName(this, "Repository", props.repository);

        const staticContentBucket = Bucket.fromBucketName(this, "ContentBucket", CONTENT_BUCKET_NAME);

        const infrastructureBuilder = new InfrastructureBuilder(this, "InfrastructureBuilder");
        const serverBuilder = new ServerBuilder(this, "ServerBuilder");
        const clientBuilder = new ClientBuilder(this, "ClientBuilder");

        const codeCommitOutput = new Artifact("CodeCommitOutput");
        const infrastructureBuilderOutput = new Artifact("InfrastructureBuilderOutput");
        const serverBuilderOutput = new Artifact("ServerBuilderOutput");
        const clientBuilderOutput = new Artifact("ClientBuilderOutput");

        const serverDeployOutput = new Artifact();

        new Pipeline(this, "Pipeline", {
            stages: [
                {
                    stageName: "Source",
                    actions: [
                        new CodeCommitSourceAction({
                            actionName: "CodeCommit_Source",
                            repository: code,
                            output: codeCommitOutput,
                        }),
                    ],
                },
                {
                    stageName: "Build",
                    actions: [
                        new CodeBuildAction({
                            actionName: "Infrastructure_Build",
                            project: infrastructureBuilder,
                            input: codeCommitOutput,
                            outputs: [infrastructureBuilderOutput],
                        }),
                        new CodeBuildAction({
                            actionName: "Server_Build",
                            project: serverBuilder,
                            input: codeCommitOutput,
                            outputs: [serverBuilderOutput],
                        }),
                        new CodeBuildAction({
                            actionName: "Client_Build",
                            project: clientBuilder,
                            input: codeCommitOutput,
                            outputs: [clientBuilderOutput],
                        }),
                    ],
                },
                {
                    stageName: "Deploy_Infrastructure",
                    actions: [
                        new CloudFormationCreateUpdateStackAction({
                            actionName: "Server_Deploy",
                            templatePath: infrastructureBuilderOutput.atPath("ServerStack.template.json"),
                            stackName: "ServerStack",
                            adminPermissions: true,
                            parameterOverrides: {
                                ...props.code.assign(serverBuilderOutput.s3Location),
                            },
                            extraInputs: [serverBuilderOutput],
                            outputFileName: "config.json",
                            output: serverDeployOutput,
                        }),
                    ],
                },
                {
                    stageName: "Deploy_Content",
                    actions: [
                        new S3DeployAction({
                            actionName: "Client_Deploy",
                            input: clientBuilderOutput,
                            bucket: staticContentBucket,
                        }),
                        new S3DeployAction({
                            actionName: "Config_Deploy",
                            input: serverDeployOutput,
                            bucket: staticContentBucket,
                        }),
                    ],
                },
            ],
        });
    }
}
