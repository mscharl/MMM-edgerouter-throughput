export interface DataConfig {
    gateway: string,
    port: number,
    username: string,
    password: string,
}

export interface AppearanceConfig {
    interface: string,
    title?: string,
    showInterfaceName?: boolean,
}

interface Config extends DataConfig, AppearanceConfig {
}

export default Config;
