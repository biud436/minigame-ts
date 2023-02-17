import { IGameObject } from './interfaces/game-object.interface';
import { Socket } from 'socket.io';
import { Guest } from './guest';
import { Injectable } from '@nestjs/common';
import { GameTransform } from './interfaces/game-transform.interface';
import { Packet } from '../network/core/packet';

@Injectable()
export class Players implements IGameObject {
    x: number = 0;
    y: number = 0;
    angle: number = 0;

    children: Map<Socket['id'], Guest> = new Map();

    constructor() {}

    update() {}

    add(client: Socket) {
        const clientId = client.id;

        const guest = new Guest();
        guest.initialize();

        this.children.set(clientId, guest);
    }

    sync(clientId: string, transform: GameTransform) {
        const guest = this.children.get(clientId);

        if (guest) {
            guest.sync(transform);
        }
    }

    remove(clientId: string) {
        this.children.delete(clientId);
    }

    clear() {
        this.children.clear();
    }

    collectPackets(): Packet {
        const serializedData = new Packet();

        for (const [key, value] of this.children) {
            value.update();

            serializedData.add(key, {
                x: value.x,
                y: value.y,
                angle: value.angle,
            });
        }

        return serializedData;
    }
}
