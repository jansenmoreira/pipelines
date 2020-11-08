export class TimestampAgent {

    now(): number {
        return Date.parse(new Date().toISOString());
    }

}
