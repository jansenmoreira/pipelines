import { PipelineProject, PipelineProjectProps, BuildSpec, LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class ApplicationBuilder extends PipelineProject {

    constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
        super(scope, `${id}ApplicationProject`, {
            
            buildSpec: BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd application',
                            'npm install'
                        ]
                    },
                    build: {
                        commands: [
                            'npm run build'
                        ]
                    }
                },
                artifacts: {
                    'base-directory': 'application',
                    files: [
                        'build/**/*',
                        'node_modules/**/*'
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
