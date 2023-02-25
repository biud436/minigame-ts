import { Inject } from '@nestjs/common';

export const NETWORK_MODULE_OPTIONS = 'NETWORK_MODULE_OPTIONS';

export function InjectNetworkModuleOptions(): ParameterDecorator {
    return Inject(NETWORK_MODULE_OPTIONS);
}
