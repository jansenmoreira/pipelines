import { v4 } from "uuid";
import { IdAgent } from "../../application/agents/id-agent";

export class UuidIdAgent implements IdAgent {
    generate(): string {
        return v4();
    }
}
