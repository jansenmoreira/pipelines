import { LambdaDeploymentGroup, LambdaDeploymentConfig } from '@aws-cdk/aws-codedeploy';
import { Code, Function, Runtime, Alias }  from '@aws-cdk/aws-lambda';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
      
export class ApplicationStack extends Stack {
  public readonly code: any;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
      
    this.code = Code.fromCfnParameters();
      
    new Function(this, `${id}Function`, {
      code: this.code,
      handler: 'Hello.main',
      runtime: Runtime.NODEJS_12_X,
    });
  }
}
