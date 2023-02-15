import { GameContext } from "./core-context";

export abstract class GameObject {
    abstract update(elapsed: number): void;
    abstract draw(ctx: GameContext): void;
    abstract destroy(): void;
}
