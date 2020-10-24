import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction, CodeBuildAction, CodeCommitSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { CfnParametersCode } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ApplicationBuilder } from './application-builder';
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
        
        const sourceOutput = new Artifact();
        
        const pipelineBuildOutput = new Artifact('PipelineBuildOutput');
        
        const applicationBuildOutput = new Artifact('ApplicationBuildOutput');
        
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
                            actionName: 'Application_Build',
                            project: applicationBuilder,
                            input: sourceOutput,
                            outputs: [applicationBuildOutput],
                        }),
                        new CodeBuildAction({
                            actionName: 'Pipeline_Build',
                            project: pipelineBuilder,
                            input: sourceOutput,
                            outputs: [pipelineBuildOutput],
                        }),
                    ],
                },
                {
                    stageName: 'Deploy',
                    actions: [
                        new CloudFormationCreateUpdateStackAction({
                            actionName: 'Application_Deploy',
                            templatePath: applicationBuildOutput.atPath('ApplicationStack.template.json'),
                            stackName: 'ApplicationStack',
                            adminPermissions: true,
                            parameterOverrides: {
                                ...props.code.assign(applicationBuildOutput.s3Location),
                            },
                            extraInputs: [applicationBuildOutput],
                        }),
                    ],
                },
            ],
        });
    }
}
