export interface CustomDomainConfig {
    readonly name: string;
    readonly hostedZoneId: string;
}

export interface Config {
    readonly customDomain?: CustomDomainConfig;
}

export const DefaultConfig: Config = {
    customDomain: {
        name: "jansenmoreira.com.br",
        hostedZoneId: "Z04574592UGZXSAWCQF1B",
    },
};
