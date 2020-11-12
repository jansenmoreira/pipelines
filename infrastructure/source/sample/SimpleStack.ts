import { Code, Runtime, Function } from "@aws-cdk/aws-lambda";
import { Stack, Construct } from "@aws-cdk/core";

export class SimpleStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new Function(this, "Hello Function", {
            code: Code.fromInline(`exports.handler =  async function(event, context) { return 'Hello!' }`),
            handler: "index.handler",
            runtime: Runtime.NODEJS_12_X,
        });
    }
}
