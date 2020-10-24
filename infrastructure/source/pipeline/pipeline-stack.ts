import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction, CodeBuildAction, CodeCommitSourceAction, S3DeployAction } from '@aws-cdk/aws-codepipeline-actions';
import { CfnParametersCode } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ApplicationBuilder } from './application-builder';
import { ClientBuilder } from './client-builder';
import { PipelineBuilder } from './pipeline-builder';

export interface PipelineStackProps extends StackProps {
    readonly code: CfnParametersCode;
    readonly repository: string
}

export class PipelineStack extends Stack {
    
    constructor(app: App, id: string, props: PipelineStackProps) {
        super(app, id, props);
        
        const code = Repository.fromRepositoryName(this, `${id}Repository`, props.repository);
        
        const applicationBuilder = new ApplicationBuilder(this, `${id}ApplicationBuilder`);
        
        const pipelineBuilder = new PipelineBuilder(this, `${id}PipelineBuilder`);
        
        const clientBuilder = new ClientBuilder(this, `${id}ClientBuilder`);
        
        const sourceOutput = new Artifact();
        
        const pipelineBuildOutput = new Artifact('PipelineBuildOutput');
        
        const applicationBuildOutput = new Artifact('ApplicationBuildOutput');
        
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
                        })
                    ]
                },
                {
                    stageName: 'Build',
                    actions: [
                        new CodeBuildAction({
                            actionName: 'Server_Build',
                            project: applicationBuilder,
                            input: sourceOutput,
                            outputs: [applicationBuildOutput],
                        }),
                        new CodeBuildAction({
                            actionName: 'Infrastructure_Build',
                            project: pipelineBuilder,
                            input: sourceOutput,
                            outputs: [pipelineBuildOutput],
                        }),
                        new CodeBuildAction({
                            actionName: 'Client_Build',
                            project: clientBuilder,
                            input: sourceOutput,
                            outputs: [clientBuildOutput],
                        })
                    ]
                },
                {
                    stageName: 'Deploy_Infrastructure',
                    actions: [
                        new CloudFormationCreateUpdateStackAction({
                            actionName: 'Server_Deploy',
                            templatePath: pipelineBuildOutput.atPath('ApplicationStack.template.json'),
                            stackName: 'ApplicationStack',
                            adminPermissions: true,
                            parameterOverrides: {
                                ...props.code.assign(applicationBuildOutput.s3Location),
                            },
                            extraInputs: [applicationBuildOutput]
                        }),
                        new CloudFormationCreateUpdateStackAction({
                            actionName: 'Client_Deploy',
                            templatePath: pipelineBuildOutput.atPath('FrontEndStack.template.json'),
                            stackName: 'FrontEndStack',
                            adminPermissions: true
                        })
                    ]
                },
                {
                    stageName: 'Deploy_Content',
                    actions: [
                        new S3DeployAction({
                            actionName: 'Client_Deploy',
                            input: clientBuildOutput,
                            bucket: Bucket.fromBucketName(this, `${id}ContentBucketImport`, `application-content-bucket-${this.account}`)
                        })
                    ]
                },
            ]
        });
    }
}
