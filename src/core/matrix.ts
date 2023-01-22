/**
 * 이 클래스는 2D 변환 행렬을 나타낸다.
 * 통상적으로 e와 f는 dx, dy 좌표를 표현한다.
 *
 * | Matrix |
 * | - |
 * | a c e |
 * | b d f |
 */
export class Matrix {
    a!: number;
    b!: number;
    c!: number;
    d!: number;
    e!: number;
    f!: number;

    private _rotation!: number;
    private _scale!: number;

    constructor(...args: number[]) {
        if (args.length === 6) {
            this.a = args[0];
            this.b = args[1];
            this.c = args[2];
            this.d = args[3];
            this.e = args[4];
            this.f = args[5];
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }

    setScale(scale: number) {
        this._scale = scale;
        this.a = scale;
        this.d = scale;

        return this;
    }

    translate(x: number, y: number) {
        this.e = x;
        this.f = y;

        return this;
    }

    rotation(radian: number) {
        this._rotation = radian;

        return this;
    }

    setDegree(degree: number) {
        this._rotation = degree * (Math.PI / 180);

        return this;
    }

    getScale() {
        return this._scale;
    }

    getRotate() {
        return this._rotation;
    }

    update() {
        this.a = Math.cos(this._rotation) * this._scale;
        this.b = Math.sin(this._rotation) * this._scale;
        this.c = -Math.sin(this._rotation) * this._scale;
        this.d = Math.cos(this._rotation) * this._scale;
    }

    toTransformData() {
        const { a, b, c, d, e, f } = this;

        return {
            a,
            b,
            c,
            d,
            e,
            f,
        };
    }
}
