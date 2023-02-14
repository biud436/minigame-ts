export class Rect {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    public add(rect: Rect): Rect {
        return new Rect(
            this.x + rect.x,
            this.y + rect.y,
            this.width + rect.width,
            this.height + rect.height
        );
    }

    public subtract(rect: Rect): Rect {
        return new Rect(
            this.x - rect.x,
            this.y - rect.y,
            this.width - rect.width,
            this.height - rect.height
        );
    }

    public multiply(rect: Rect): Rect {
        return new Rect(
            this.x * rect.x,
            this.y * rect.y,
            this.width * rect.width,
            this.height * rect.height
        );
    }

    public divide(rect: Rect): Rect {
        return new Rect(
            this.x / rect.x,
            this.y / rect.y,
            this.width / rect.width,
            this.height / rect.height
        );
    }
}
