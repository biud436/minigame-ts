export interface ITextureManager {
    load(filename: string, id: string): Promise<boolean>;
    remove(id: string): boolean;
}
