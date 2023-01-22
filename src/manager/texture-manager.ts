import { Matrix } from "../core/matrix";
import { Rect } from "../core/rect";

export interface ITextureManager {
    load(filename: string, id: string): boolean;
    remove(id: string): boolean;
}

export class TextureManager implements ITextureManager {
    private textureMap: Map<string, HTMLImageElement> = new Map();
    private onLoadedCallback: Map<string, () => void> = new Map();

    load(filename: string, id: string): boolean {
        const image = new Image();
        image.src = filename;
        image.onload = () => {
            this.onLoadedCallback.get(id)?.();
        };
        this.textureMap.set(id, image);

        return true;
    }

    remove(id: string): boolean {
        const isRemoved = this.textureMap.delete(id);

        if (this.onLoadedCallback.has(id)) {
            this.onLoadedCallback.delete(id);
        }

        return isRemoved;
    }
}
