import { GameObject } from "./GameObject";

export interface IGameState {
    update(elapsed: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    onEnter(): boolean;
    onExit(): boolean;

    getStateID(): string;
    addChild(object: GameObject): void;
}
