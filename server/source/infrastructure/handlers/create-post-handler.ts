import { APIGatewayProxyEvent } from "aws-lambda";
import { Module } from "../ioc/module";
import { HandlerFactory } from "./handler-factory";

interface CreatePostHandlerResponse {
    id: string;
}

export const handler = HandlerFactory(
    async (event: APIGatewayProxyEvent, module: Module): Promise<CreatePostHandlerResponse> => {
        const id = await module.postApplicationService.createPost(JSON.parse(event.body));

        return { id: id };
    }
);
