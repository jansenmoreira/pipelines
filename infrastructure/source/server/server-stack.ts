import { HttpApi, HttpMethod, LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { CfnParametersCode, Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Bucket } from "@aws-cdk/aws-s3";
import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

export class ServerStack extends Stack {
    public static readonly DOMAIN: string = "jansenmoreira.com.br";

    public readonly code: CfnParametersCode;
    public readonly apiUrl: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.code = Code.fromCfnParameters();

        const contentBucket = new Bucket(this, "ContentBucket", {
            bucketName: ServerStack.DOMAIN,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const createPostFunction = new Function(this, "CreatePostFunction", {
            code: this.code,
            handler: "build/infrastructure/handlers/create-post-handler.handler",
            runtime: Runtime.NODEJS_12_X,
        });

        const listPostsFunction = new Function(this, "ListPostsFunction", {
            code: this.code,
            handler: "build/infrastructure/handlers/list-posts-handler.handler",
            runtime: Runtime.NODEJS_12_X,
        });

        const getPostFunction = new Function(this, "GetPostFunction", {
            code: this.code,
            handler: "build/infrastructure/handlers/get-post-handler.handler",
            runtime: Runtime.NODEJS_12_X,
        });

        const postsTable = new Table(this, "PostsTable", {
            tableName: "Posts",
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
        });

        postsTable.grantWriteData(createPostFunction);
        postsTable.grantReadData(listPostsFunction);
        postsTable.grantReadData(getPostFunction);

        const gateway = new HttpApi(this, "Gateway", {
            apiName: "Posts",
            corsPreflight: {
                allowMethods: [HttpMethod.OPTIONS, HttpMethod.HEAD, HttpMethod.GET, HttpMethod.POST],
                allowHeaders: ["*"],
                allowOrigins: [`${ServerStack.DOMAIN}.s3-website-us-west-2.amazonaws.com`, ServerStack.DOMAIN],
            },
        });

        gateway.addRoutes({
            path: "/post",
            methods: [HttpMethod.POST],
            integration: new LambdaProxyIntegration({ handler: createPostFunction }),
        });

        gateway.addRoutes({
            path: "/post",
            methods: [HttpMethod.GET],
            integration: new LambdaProxyIntegration({ handler: listPostsFunction }),
        });

        gateway.addRoutes({
            path: "/post/{id}",
            methods: [HttpMethod.GET],
            integration: new LambdaProxyIntegration({ handler: getPostFunction }),
        });

        new CfnOutput(this, "api", {
            value: `https://${gateway.httpApiId}.execute-api.${this.region}.amazonaws.com/`,
        });
    }
}
