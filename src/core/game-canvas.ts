export class GameCanvas {
    private _element!: HTMLCanvasElement;

    constructor(public width: number, public height: number) {
        this.width = width;
        this.height = height;

        this.initWithElement();
    }

    initWithElement(): void {
        this._element = document.createElement("canvas");
        this._element.width = this.width;
        this._element.height = this.height;
    }

    get context() {
        return this._element.getContext("2d");
    }

    get element() {
        return this._element;
    }
}
