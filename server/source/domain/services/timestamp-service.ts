export class TimestampService {

    now(): number {
        return Date.parse(new Date().toISOString());
    }

}
