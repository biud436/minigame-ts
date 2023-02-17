import { IRoomPacket } from './rooms';

export class Packet {
    raw: Record<string, IRoomPacket>;

    constructor() {
        this.raw = {};
    }

    add(key: string, value: IRoomPacket) {
        this.raw[key] = value;
    }

    append(packet: Packet) {
        this.raw = { ...this.raw, ...packet.raw };

        return this;
    }

    toJSON() {
        return this.raw;
    }
}
