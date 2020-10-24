import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction, CodeBuildAction, CodeCommitSourceAction, S3DeployAction } from '@aws-cdk/aws-codepipeline-actions';
import { CfnParametersCode } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ServerBuilder } from './server-builder';
import { ClientBuilder } from './client-builder';
import { InfrastructureBuilder } from './infrastructure-builder';

export interface PipelineStackProps extends StackProps {
    readonly code: CfnParametersCode;
    readonly repository: string
}

export class PipelineStack extends Stack {

    constructor(app: App, id: string, props: PipelineStackProps) {
        super(app, id, props);

        const code = Repository.fromRepositoryName(this, `${id}Repository`, props.repository);

        const contentBucket = Bucket.fromBucketName(this, `${id}ClientBucketImport`, `client-bucket-${this.account}`);

        const infrastructureBuilder = new InfrastructureBuilder(this, `${id}InfrastructureBuilder`);

        const serverBuilder = new ServerBuilder(this, `${id}ServerBuilder`);

        const clientBuilder = new ClientBuilder(this, `${id}ClientBuilder`);

        const sourceOutput = new Artifact();

        const infrastructureBuildOutput = new Artifact('InfrastructureBuildOutput');

        const serverBuildOutput = new Artifact('ServerBuildOutput');

        const serverDeployOutput = new Artifact();

        const clientBuildOutput = new Artifact('ClientBuildOutput');

        new Pipeline(this, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        new CodeCommitSourceAction({
                            actionName: 'CodeCommit_Source',
                            repository: code,
                            output: sourceOutput,
                        }),
                    ],
                },
                {
                    stageName: 'Build',
                    actions: [
                        new CodeBuildAction({
                            actionName: 'Infrastructure_Build',
                            project: infrastructureBuilder,
                            input: sourceOutput,
                            outputs: [infrastructureBuildOutput],
                        }),
                        new CodeBuildAction({
                            actionName: 'Server_Build',
                            project: serverBuilder,
                            input: sourceOutput,
                            outputs: [serverBuildOutput],
                        }),
                        new CodeBuildAction({
                            actionName: 'Client_Build',
                            project: clientBuilder,
                            input: sourceOutput,
                            outputs: [clientBuildOutput],
                        }),
                    ],
                },
                {
                    stageName: 'Deploy_Infrastructure',
                    actions: [
                        new CloudFormationCreateUpdateStackAction({
                            actionName: 'Server_Deploy',
                            templatePath: infrastructureBuildOutput.atPath('ServerStack.template.json'),
                            stackName: 'ServerStack',
                            adminPermissions: true,
                            parameterOverrides: {
                                ...props.code.assign(serverBuildOutput.s3Location),
                            },
                            extraInputs: [serverBuildOutput],
                            outputFileName: "cdk.out",
                            output: serverDeployOutput,
                        }),
                        new CloudFormationCreateUpdateStackAction({
                            actionName: 'Client_Deploy',
                            templatePath: infrastructureBuildOutput.atPath('ClientStack.template.json'),
                            stackName: 'ClientStack',
                            adminPermissions: true,
                        }),
                    ],
                },
                {
                    stageName: 'Deploy_Content',
                    actions: [
                        new S3DeployAction({
                            actionName: 'Client_Deploy',
                            input: clientBuildOutput,
                            bucket: contentBucket,
                        }),
                        new S3DeployAction({
                            actionName: 'Server_Deploy',
                            input: serverDeployOutput,
                            bucket: contentBucket,
                        }),
                    ],
                },
            ],
        });
    }
}
