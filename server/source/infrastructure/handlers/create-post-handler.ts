import { Module } from "../ioc/module"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const module = new Module();

    if (event.body === null) {
        return { statusCode: 400, body: "Bad Request" }
    }

    const posts = await module.postApplicationService.createPost(JSON.parse(event.body));

    return {
        statusCode: 200,
        body: JSON.stringify(posts)
    }
}
