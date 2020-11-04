import { Module } from "../ioc/module"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const module = new Module();

    const posts = await module.postApplicationService.listPosts({});

    return {
        statusCode: 200,
        body: JSON.stringify(posts)
    }
}
