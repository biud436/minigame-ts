import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameTransform } from 'src/game/units/interfaces/game-transform.interface';
import { IGameObject } from '../../units/interfaces/game-object.interface';
import { PlanetEarth } from '../../units/planet-earth';
import { ServerTime } from '../../units/server-time';
import { Packet } from './packet';

export type GameObject<T = IGameObject> = Map<string, T>;
export type IRoomPacket = GameTransform & {
    children?: Array<GameTransform>;
};

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

    collectStaticPackets(): Packet {
        const serializedData = new Packet();

        for (const [key, value] of this.objects) {
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
