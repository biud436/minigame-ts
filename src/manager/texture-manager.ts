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

    private static INSTANCE: TextureManager;
    private static NORMAL_TRANSFORM: Matrix = new Matrix();

    private constructor() {}

    static getInstance(): TextureManager {
        if (!TextureManager.INSTANCE) {
            TextureManager.INSTANCE = new TextureManager();
        }

        return TextureManager.INSTANCE;
    }

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

    valid(textureId: string): boolean {
        return this.textureMap.has(textureId);
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

    renderFrame(
        ctx: CanvasRenderingContext2D,
        textureId: string,
        x: number,
        y: number,
        width: number,
        height: number,
        rect: Rect,
        opacity: number,
        transform: Matrix
    ): void {
        if (!this.valid(textureId)) {
            return;
        }

        const currentTexture = this.textureMap.get(textureId);
        const normalTransform = TextureManager.NORMAL_TRANSFORM;

        ctx.save();
        this.setWorldTransform(ctx, transform);

        /**
         * 투명도 설정
         */
        ctx.globalAlpha = opacity / 255;
        ctx.drawImage(
            currentTexture!.texture,
            0,
            0,
            width,
            height,
            rect.x,
            rect.y,
            width,
            height
        );

        this.setWorldTransform(ctx, normalTransform);
        ctx.restore();
    }

    setWorldTransform(ctx: CanvasRenderingContext2D, transform: Matrix): void {
        ctx.setTransform(transform.toTransformData());
    }
}
