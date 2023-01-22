import { Matrix } from "../core/matrix";
import { Rect } from "../core/rect";
import { Texture2D } from "../core/texture-2d";

export interface ITextureManager {
    load(filename: string, id: string): boolean;
    remove(id: string): boolean;
}

export class TextureManager implements ITextureManager {
    private textureMap: Map<string, Texture2D> = new Map();
    private onLoadedCallback: Map<string, (img: Texture2D) => void> = new Map();
    static MAX_POLL_SIZE: number = 20;

    load(filename: string, id: string): boolean {
        if (this.textureMap.has(id)) {
            return false;
        }

        if (!this.isValidPoolSize()) {
            console.error("텍스쳐 풀 사이즈가 초과되었습니다.");
            return false;
        }

        // Create image
        const image = new Image();

        this.onLoadedCallback.set(id, (img: Texture2D) => {
            this.textureMap.set(id, img);
        });

        image.src = filename;
        image.onload = () => {
            this.onLoadedCallback.get(id)?.(Texture2D.of(id, image));
        };

        return true;
    }

    remove(id: string): boolean {
        const isRemoved = this.textureMap.delete(id);

        if (this.onLoadedCallback.has(id)) this.onLoadedCallback.delete(id);

        return isRemoved;
    }

    /**
     * 이벤트 업데이트
     */
    update(): void {
        this.onLoadedCallback.forEach((callback, id) => {
            if (this.textureMap.has(id)) callback(this.textureMap.get(id)!);
        });

        this.onLoadedCallback.clear();
    }

    isValidPoolSize(): boolean {
        return this.textureMap.size < TextureManager.MAX_POLL_SIZE;
    }
}
