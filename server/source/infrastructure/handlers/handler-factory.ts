import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Module } from "../ioc/module";

type Handler = (event: APIGatewayProxyEvent, module: Module) => any;
type Proxy = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export const HandlerFactory = (handler: Handler): Proxy => {
    const module = new Module();

    return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const result = handler(event, module);

            return {
                statusCode: 200,
                body: JSON.stringify(result),
            };
        } catch (exception) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: exception.message }),
            };
        }
    };
};
