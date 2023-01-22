import { Matrix } from "../core/matrix";
import { Rect } from "../core/rect";

export interface ITextureManager {
    load(filename: string, id: string): boolean;
    remove(id: string): boolean;
}

export class TextureManager implements ITextureManager {
    private textureMap: Map<string, HTMLImageElement> = new Map();
    private onLoadedCallback: Map<string, (img: HTMLImageElement) => void> =
        new Map();
    static MAX_POLL_SIZE: number = 20;

    load(filename: string, id: string): boolean {
        const image = new Image();

        this.onLoadedCallback.set(id, (img: HTMLImageElement) => {
            this.textureMap.set(id, img);
        });

        image.src = filename;
        image.onload = () => {
            this.onLoadedCallback.get(id)?.(image);
        };

        return true;
    }

    remove(id: string): boolean {
        const isRemoved = this.textureMap.delete(id);

        if (this.onLoadedCallback.has(id)) {
            this.onLoadedCallback.delete(id);
        }

        return isRemoved;
    }

    update(): void {
        this.onLoadedCallback.forEach((callback, id) => {
            if (this.textureMap.has(id)) {
                callback(this.textureMap.get(id)!);
            }
        });

        this.onLoadedCallback.clear();
    }
}
