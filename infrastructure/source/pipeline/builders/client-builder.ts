import { BuildSpec, LinuxBuildImage, PipelineProject, PipelineProjectProps } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class ClientBuilder extends PipelineProject {
    constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
        super(scope, id, {
            buildSpec: BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd client',
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
                    'base-directory': 'client/public',
                    files: [
                        './**/*',
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
