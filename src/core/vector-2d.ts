export class Vector2D {
    constructor(private _x: number, private _y: number) {}

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(x: number) {
        this._x = x;
    }

    public set y(y: number) {
        this._y = y;
    }

    public get length(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    public normalize(): Vector2D {
        const length = this.length;
        if (length > 0) return new Vector2D(this._x / length, this._y / length);
        return new Vector2D(0, 0);
    }

    public add(vector: Vector2D): Vector2D {
        return new Vector2D(this._x + vector.x, this._y + vector.y);
    }

    public subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this._x - vector.x, this._y - vector.y);
    }

    public multiply(vector: Vector2D): Vector2D {
        return new Vector2D(this._x * vector.x, this._y * vector.y);
    }

    public divide(vector: Vector2D): Vector2D {
        return new Vector2D(this._x / vector.x, this._y / vector.y);
    }

    public dot(vector: Vector2D): number {
        return this._x * vector.x + this._y * vector.y;
    }
}
