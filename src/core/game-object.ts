export abstract class GameObject {
    abstract update(elapsed: number): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract destroy(): void;
}
