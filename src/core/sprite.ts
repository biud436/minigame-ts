import { TextureManager } from "../manager/texture-manager";
import { GameObject } from "./interfaces/GameObject";
import { Matrix } from "./matrix";
import { Rect } from "./rect";
import { SpriteData } from "./sprite-data";

export const SPRITE_SHEET_COLS = 4;
export const SPRITE_SHEET_ROWS = 4;
export const PI_2 = Math.PI * 2;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export interface ISprite extends GameObject {
    initialize(
        x: number,
        y: number,
        width: number,
        height: number,
        maxFrames: number,
        textuereId: string
    ): boolean;
    update(elapsed: number): void;

    getSpriteData(): SpriteData;
}

export class Sprite extends GameObject implements ISprite {
    private spriteData: SpriteData;
    private isVisible: boolean;
    private isAnimComplete: boolean;
    private isLoop: boolean;
    private currentFrame: number;
    private maxFrame: number;
    private animationTime: number;
    private isInitialized: boolean;
    private transform: Matrix;

    constructor() {
        super();

        this.isVisible = false;
        this.isLoop = false;
        this.isAnimComplete = false;
        this.currentFrame = 0;
        this.maxFrame = 1;
        this.animationTime = 0;
        this.spriteData = new SpriteData();
        this.transform = new Matrix();
        this.isInitialized = false;
    }

    initialize(
        x: number,
        y: number,
        width: number,
        height: number,
        maxFrames: number,
        textureId: string
    ): boolean {
        this.spriteData.id = textureId;
        this.spriteData.position.set(x, y);
        this.spriteData.width = width;
        this.spriteData.height = height;

        this.maxFrame = Math.max(1, maxFrames);

        this.setFrames(0, this.maxFrame);
        this.setCurrentFrame(0);

        this.spriteData.frameDelay = 0;
        this.animationTime = 0;

        this.isVisible = true;

        return this.isInitialized;
    }

    destroy(): void {
        const textureId = this.spriteData.id;

        if (!TextureManager.getInstance().valid(textureId)) {
            TextureManager.getInstance().remove(textureId);
        }
    }

    updateTexture(): void {
        // 텍스쳐가 로드되지 않았다면 로드가 완료될 때까지 대기 (브라우저 특성상)
        if (!TextureManager.getInstance().valid(this.spriteData.id)) {
            this.isInitialized = false;
        } else {
            this.isInitialized = true;
        }
    }

    update(elapsed: number): void {
        this.updateTexture();

        if (!this.isInitialized) {
            return;
        }

        const { startFrame, endFrame, frameDelay: delay } = this.spriteData;

        if (endFrame - startFrame > 0) {
            this.animationTime += elapsed;

            if (this.animationTime > delay) {
                this.animationTime -= delay;
                this.currentFrame++;

                if (
                    this.currentFrame < startFrame ||
                    this.currentFrame > endFrame
                ) {
                    if (this.isLoop) {
                        this.currentFrame = startFrame;
                    } else {
                        this.currentFrame = endFrame;
                        this.isAnimComplete = true;
                    }
                }

                this.setRect();
            }
        }

        this.updateTransform();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isInitialized) {
            return;
        }

        TextureManager.getInstance().renderFrame(
            ctx,
            this.spriteData.id,
            this.spriteData.position.x,
            this.spriteData.position.y,
            this.spriteData.width,
            this.spriteData.height,
            this.spriteData.rect,
            this.spriteData.opacity,
            this.transform
        );
    }

    getSpriteData(): SpriteData {
        return new SpriteData();
    }

    getX(): number {
        return this.spriteData.position.x;
    }

    getY(): number {
        return this.spriteData.position.x;
    }

    getScale(): number {
        return this.spriteData.scale;
    }

    getWidth(): number {
        return this.spriteData.width;
    }

    getHeight(): number {
        return this.spriteData.height;
    }

    getAngle(): number {
        return this.spriteData.rotation * RAD_TO_DEG;
    }

    getRadian(): number {
        return this.spriteData.rotation;
    }

    getVisible(): boolean {
        return this.isVisible;
    }

    getOpacity(): number {
        return this.spriteData.opacity;
    }

    getFrameDelay(): number {
        return this.spriteData.frameDelay;
    }

    getStartFrame(): number {
        return this.spriteData.startFrame;
    }

    getEndFrame(): number {
        return this.spriteData.endFrame;
    }

    getCurrentFrame(): number {
        return this.currentFrame;
    }

    getRect(): Rect {
        return this.spriteData.rect;
    }

    getAnimComplete(): boolean {
        return this.isAnimComplete;
    }

    setX(x: number): Sprite {
        this.spriteData.position.x = x;

        return this;
    }

    setY(y: number): Sprite {
        this.spriteData.position.y = y;

        return this;
    }

    setScale(scale: number): Sprite {
        this.spriteData.scale = scale;

        return this;
    }

    setAngle(degree: number) {
        this.spriteData.rotation = DEG_TO_RAD * degree;

        return this;
    }

    setRadians(radians: number): Sprite {
        this.spriteData.rotation = radians;

        return this;
    }

    setVisible(visible: boolean): Sprite {
        this.isVisible = visible;

        return this;
    }

    setOpacity(opacity: number): Sprite {
        if (opacity < 0) {
            opacity = 0;
        }

        if (opacity > 255) {
            opacity = 255;
        }

        this.spriteData.opacity = opacity;

        return this;
    }

    setFrameDelay(delay: number): Sprite {
        this.spriteData.frameDelay = delay;

        return this;
    }

    setFrames(startNum: number, endNum: number): Sprite {
        this.spriteData.startFrame = startNum;

        if (endNum < 0) {
            endNum = 1;
        }

        if (endNum > this.maxFrame) {
            endNum = this.maxFrame;
        }

        this.spriteData.endFrame = endNum - 1;

        return this;
    }

    setCurrentFrame(currentFrame: number): Sprite {
        if (currentFrame >= 0) {
            this.currentFrame = currentFrame;

            this.isAnimComplete = false;
            this.animationTime = 0.0;

            this.setRect();
        }

        return this;
    }

    setRect(rect?: Rect): Sprite {
        if (rect) {
            this.spriteData.rect = rect;
            return this;
        }

        const { currentFrame } = this;

        this.spriteData.rect.x =
            (currentFrame % SPRITE_SHEET_COLS) * this.spriteData.width;
        this.spriteData.rect.width =
            this.spriteData.rect.x + this.spriteData.width;
        this.spriteData.rect.y =
            (currentFrame / SPRITE_SHEET_COLS) * this.spriteData.height;
        this.spriteData.rect.height =
            this.spriteData.rect.y + this.spriteData.height;

        return this;
    }

    setLoop(isLooping: boolean): Sprite {
        this.isLoop = isLooping;

        return this;
    }

    setAnimComplete(isComplete: boolean): Sprite {
        this.isAnimComplete = isComplete;

        return this;
    }

    updateTransform(): void {
        this.transform.a =
            Math.cos(this.spriteData.rotation) * this.spriteData.scale;
        this.transform.b =
            Math.sin(this.spriteData.rotation) * this.spriteData.scale;
        this.transform.c =
            -Math.sin(this.spriteData.rotation) * this.spriteData.scale;
        this.transform.d =
            Math.cos(this.spriteData.rotation) * this.spriteData.scale;
        this.transform.e = this.spriteData.position.x + this.spriteData.offsetX;
        this.transform.f = this.spriteData.position.y + this.spriteData.offsetY;
    }
}
