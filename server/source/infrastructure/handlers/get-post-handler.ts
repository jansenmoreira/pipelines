import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Module } from "../ioc/module";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const module = new Module();
    console.log(event);

    if (event.body === null) {
        return { statusCode: 400, body: "Bad Request" }
    }

    const post = await module.postApplicationService.getPost(JSON.parse(event.body));

    return {
        statusCode: 200,
        body: JSON.stringify(post)
    }
}
