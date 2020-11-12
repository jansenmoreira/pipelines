export interface Environment {
    readonly bucketName: string;
    readonly region: string;
    readonly account?: string;
}

export const REPOSITORY_NAME: string = "pipeline";

export const PRODUCTION_ENVIRONMENT: Environment = {
    bucketName: "jansenmoreira.com.br",
    region: "us-west-2",
};

export const DEVELOPMENT_ENVIRONMENT: Environment = {
    bucketName: "dev.jansenmoreira.com.br",
    region: "us-west-1",
};
