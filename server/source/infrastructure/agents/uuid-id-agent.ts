import { IdAgent } from "../../application/agents/id-agent";
import { v4 } from 'uuid'

export class UuidIdAgent implements IdAgent {
    generate(): string {
        return v4()
    }
}
