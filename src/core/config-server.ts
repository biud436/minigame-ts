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
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.INSTANCE) {
            ConfigService.INSTANCE = new ConfigService();
        }

        return ConfigService.INSTANCE;
    }
}
