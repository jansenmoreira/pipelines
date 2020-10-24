import { HttpApi, HttpMethod, LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime }  from '@aws-cdk/aws-lambda';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
      
export class ServerStack extends Stack {
  public readonly code: any;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
      
    this.code = Code.fromCfnParameters();
      
    const hello = new Function(this, `${id}Function`, {
      code: this.code,
      handler: 'build/Hello.main',
      runtime: Runtime.NODEJS_12_X,
    });

    const helloIntegration = new LambdaProxyIntegration({
        handler: hello,
    });
      

    const helloGateway = new HttpApi(this, `${id}HttpApiGateway`, {
        apiName: 'Hello',
        description: 'Api Gateway for Hello Lambda'
    });

    helloGateway.addRoutes({
        path: '/',
        methods: [ HttpMethod.GET ],
        integration: helloIntegration
    });
  }
}
