import { BuildSpec, LinuxBuildImage, PipelineProject, PipelineProjectProps } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class ServerBuilder extends PipelineProject {
    constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
        super(scope, id, {
            buildSpec: BuildSpec.fromObject({
                version: "0.2",
                phases: {
                    install: {
                        commands: ["cd server", "npm install"],
                    },
                    build: {
                        commands: ["npm run build", "npm prune --production"],
                    },
                },
                artifacts: {
                    "base-directory": "server",
                    files: ["build/**/*", "node_modules/**/*"],
                },
            }),
            environment: {
                buildImage: LinuxBuildImage.STANDARD_2_0,
            },
            ...props,
        });
    }
}
