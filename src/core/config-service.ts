import loadYaml from "./yaml-loader";

interface IManifest {
    version: string;
    core: {
        width: number;
        height: number;
    };
}

export class ConfigService {
    private static INSTANCE: ConfigService;
    private data?: IManifest;
    private done: boolean = false;

    private constructor() {}

    async init() {
        const data = await loadYaml<IManifest>("/assets/manifest.yaml");
        this.data = {
            version: data.version,
            core: {
                width: data.core.width,
                height: data.core.height,
            },
        };
        this.done = true;
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.INSTANCE) {
            ConfigService.INSTANCE = new ConfigService();
        }

        return ConfigService.INSTANCE;
    }

    get width() {
        return this.data?.core.width ?? 800;
    }

    get height() {
        return this.data?.core.height ?? 600;
    }
}
