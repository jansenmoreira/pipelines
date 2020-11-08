import { TimestampAgent } from "../../application/agents/timestamp-agent";

export class DateTimestampAgent implements TimestampAgent {
    now(): number {
        return Date.parse(new Date().toISOString());
    }
}
