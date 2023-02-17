import { IRoomPacket } from './rooms';

export class Packet {
    raw: Record<string, IRoomPacket>;

    constructor() {
        this.raw = {};
    }

    add(key: string, value: IRoomPacket) {
        this.raw[key] = value;
    }

    append(key: string, packet: Packet) {
        this.raw = { ...this.raw, [key]: { ...this.raw[key], ...packet.raw } };

        return this;
    }

    toJSON() {
        return this.raw;
    }
}
