import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Module } from "../ioc/module";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const module = new Module();
    console.log(event);

    const post = await module.postApplicationService.getPost({
        id: event.pathParameters.id,
    });

    return {
        statusCode: 200,
        body: JSON.stringify(post),
    };
}
