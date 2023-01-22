/**
 * @class Texture2D
 */
export class Texture2D {
    id: string;
    texture: HTMLImageElement;

    constructor(id: string, texture: HTMLImageElement) {
        this.id = id;
        this.texture = texture;
    }

    static of(id: string, texture: HTMLImageElement): Texture2D {
        return new Texture2D(id, texture);
    }
}
