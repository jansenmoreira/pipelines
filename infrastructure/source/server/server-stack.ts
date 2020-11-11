import { HttpApi, HttpMethod, LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { CloudFrontWebDistribution, ViewerCertificate } from "@aws-cdk/aws-cloudfront";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { HostedZone } from "@aws-cdk/aws-route53";
import { Bucket } from "@aws-cdk/aws-s3";
import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import { CustomDomainConfig, DefaultConfig } from "./config/config";

export class ServerStack extends Stack {
    public readonly code: any;
    public readonly apiUrl: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.code = Code.fromCfnParameters();

        const contentBucket = new Bucket(this, "ContentBucket", {
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,
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
                allowMethods: [HttpMethod.OPTIONS, HttpMethod.GET, HttpMethod.POST],
                allowHeaders: ["*"],
                allowOrigins: ["*"],
            },
        });

        gateway.addRoutes({
            path: "/api/post",
            methods: [HttpMethod.POST],
            integration: new LambdaProxyIntegration({
                handler: createPostFunction,
            }),
        });

        gateway.addRoutes({
            path: "/api/post",
            methods: [HttpMethod.GET],
            integration: new LambdaProxyIntegration({
                handler: listPostsFunction,
            }),
        });

        gateway.addRoutes({
            path: "/api/post/{id}",
            methods: [HttpMethod.GET],
            integration: new LambdaProxyIntegration({
                handler: getPostFunction,
            }),
        });

        const apiDomain = `${gateway.httpApiId}.execute-api.${this.region}.amazonaws.com`;

        const cloudFront = new CloudFrontWebDistribution(this, "CloudFront", {
            viewerCertificate: this.createViewerCertificate(DefaultConfig.customDomain),
            originConfigs: [
                {
                    s3OriginSource: { s3BucketSource: contentBucket },
                    behaviors: [{ isDefaultBehavior: true }],
                },
                {
                    customOriginSource: { domainName: apiDomain },
                    behaviors: [{ pathPattern: "/api/*" }],
                },
            ],
        });

        new CfnOutput(this, "api", {
            value: `https://${apiDomain}/api/`,
        });
    }

    createViewerCertificate(config?: CustomDomainConfig): ViewerCertificate | undefined {
        if (config === undefined) {
            return undefined;
        }

        const hostedZone = HostedZone.fromHostedZoneId(this, "HostedZone", config.hostedZoneId);

        const certificate = new DnsValidatedCertificate(this, "CrossRegionCertificate", {
            domainName: config.name,
            hostedZone: hostedZone,
            region: "us-east-1",
        });

        return ViewerCertificate.fromAcmCertificate(certificate);
    }
}
