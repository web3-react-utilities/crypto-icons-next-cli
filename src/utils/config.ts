import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export type Config = {
    defaultDirectory?: string;
    imageBasePath?: string;
    darkModeClass?: string; // CSS class for dark mode (default: "dark")
};

const CONFIG_FILE_NAME = ".crypto-icons.json";

export function getConfigFilePath(): string {
    return path.join(process.cwd(), CONFIG_FILE_NAME);
}

export async function loadConfig(): Promise<Config> {
    const configPath = getConfigFilePath();

    if (await fs.pathExists(configPath)) {
        try {
            const configContent = await fs.readFile(configPath, "utf-8");
            return JSON.parse(configContent);
        } catch (error) {
            console.warn(chalk.yellow("⚠️ Failed to parse config file, using defaults"));
            return {};
        }
    }

    return {};
}

export async function saveConfig(config: Config): Promise<void> {
    const configPath = getConfigFilePath();

    try {
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green(`✓ Config saved to ${CONFIG_FILE_NAME}`));
    } catch (error) {
        console.error(chalk.red("❌ Failed to save config:"), error);
    }
}

export async function getTargetDirectoryWithConfig(dir?: string): Promise<string> {
    if (dir) {
        return path.resolve(process.cwd(), dir);
    }

    const config = await loadConfig();
    const defaultDir = config.defaultDirectory || "./src/components/crypto-icons";

    return path.resolve(process.cwd(), defaultDir);
}

export async function getImageBasePathWithConfig(): Promise<string> {
    const config = await loadConfig();
    return config.imageBasePath || "/images/crypto";
}

export async function getDarkModeClassWithConfig(): Promise<string> {
    const config = await loadConfig();
    return config.darkModeClass || "dark";
}
