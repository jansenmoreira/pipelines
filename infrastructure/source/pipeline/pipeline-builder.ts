import { PipelineProject, PipelineProjectProps, BuildSpec, LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class PipelineBuilder extends PipelineProject {

    constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
        super(scope, `${id}PipelineProject`, {

            buildSpec: BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd infrastructure',
                            'npm install'
                        ]
                    },
                    build: {
                        commands: [
                            'npm run build',
                            'npm run cdk synth'
                        ]
                    }
                },
                artifacts: {
                    'base-directory': 'infrastructure/cdk.out',
                    files: [
                        'ApplicationStack.template.json'
                    ]
                }
            }),

            environment: {
                buildImage: LinuxBuildImage.STANDARD_2_0,
            },

            ...props

        });
    }
}
