import { APIGatewayProxyEvent } from "aws-lambda";
import { Post } from "../../domain/entities/post";
import { Module } from "../ioc/module";
import { HandlerFactory } from "./handler-factory";

export const handler = HandlerFactory(
    async (event: APIGatewayProxyEvent, module: Module): Promise<Post[]> => {
        const posts = await module.postApplicationService.listPosts({});

        return posts;
    }
);
