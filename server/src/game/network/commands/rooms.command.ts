import { Injectable, OnModuleInit } from '@nestjs/common';
import { IGameObject } from '../../units/interfaces/game-object.interface';
import { PlanetEarth } from '../../units/planet-earth';
import { ServerTime } from '../../units/server-time';

export type GameObject<T = IGameObject> = Map<string, T>;
export interface IRoomPacket {
    x: number;
    y: number;
    angle: number;
}

@Injectable()
export class Rooms implements OnModuleInit {
    private objects: GameObject = new Map();

    onModuleInit() {
        this.objects.set('planetEarth', new PlanetEarth());
        this.objects.set('serverTime', new ServerTime());
    }

    join(id: string, gameObject: IGameObject) {
        this.objects.set(id, gameObject);
    }

    leave(id: string) {
        this.objects.delete(id);
    }

    collectPackets() {
        const serializedData: Record<string, IRoomPacket> = {};

        for (const [key, value] of this.objects) {
            value.update();

            serializedData[key] = {
                x: value.x,
                y: value.y,
                angle: value.angle,
            };
        }

        return serializedData;
    }
}
