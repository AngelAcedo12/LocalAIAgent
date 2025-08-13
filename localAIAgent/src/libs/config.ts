import { invoke } from "@tauri-apps/api/core";


export interface ModelConfig {
    temperature: number;
    max_length: number;
    top_p: number;
}

export interface Config {
    default_model: string;
    model_config: ModelConfig;
}

export async function getConfig(): Promise<Config> {
    return invoke('get_config');
}

export async function getDefaultModel(): Promise<string> {
    return invoke('get_default_model');
}

export async function setDefaultModel(model: string): Promise<void> {
    return invoke('set_default_model', { model });
}

export async function getModelConfig(): Promise<ModelConfig> {
    return invoke('get_model_config');
}

export async function updateModelConfig(config: ModelConfig): Promise<void> {
    return invoke('update_model_config', { config });
}
