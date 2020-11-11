export interface CustomDomainConfig {
    readonly name: string;
    readonly certificateArn: string;
}

export interface Config {
    readonly customDomain?: CustomDomainConfig;
}

export const DefaultConfig: Config = {
    customDomain: {
        name: "jansenmoreira.com.br",
        certificateArn: "arn:aws:acm:us-east-1:825703764719:certificate/9d7426ab-da8b-42f3-a3d0-5729f57bed2b",
    },
};
