import { PipelineProject, PipelineProjectProps, BuildSpec, LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class ClientBuilder extends PipelineProject {

    constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
        super(scope, `${id}ClientProject`, {
            
            buildSpec: BuildSpec.fromObject({
                version: '0.2',
                phases: {
                },
                artifacts: {
                    'base-directory': 'client',
                    files: [
                        '**/*',
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
