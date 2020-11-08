import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Module } from "../ioc/module";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const module = new Module();

    const posts = await module.postApplicationService.listPosts({});

    return {
        statusCode: 200,
        body: JSON.stringify(posts)
    }
}
