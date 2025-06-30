import chalk from "chalk";
import inquirer from "inquirer";
import { loadConfig, saveConfig, Config } from "../utils/config";

export type ConfigCommandOptions = {
    dir?: string;
    imagePath?: string;
    darkModeClass?: string;
    reset?: boolean;
};

export async function configCommand(options: ConfigCommandOptions): Promise<void> {
    try {
        if (options.reset) {
            await saveConfig({});
            console.log(chalk.green("✅ Configuration reset to defaults!"));
            return;
        }

        let config = await loadConfig();

        if (options.dir || options.imagePath || options.darkModeClass) {
            // Direct setting via options
            if (options.dir) {
                config.defaultDirectory = options.dir;
            }
            if (options.imagePath) {
                config.imageBasePath = options.imagePath;
            }
            if (options.darkModeClass) {
                config.darkModeClass = options.darkModeClass;
            }

            await saveConfig(config);
            console.log(chalk.green("✅ Configuration updated!"));
            return;
        }

        // Interactive configuration
        console.log(chalk.blue("\n🔧 Crypto Icons Configuration\n"));

        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "defaultDirectory",
                message: "Default directory for crypto icons:",
                default: config.defaultDirectory || "./src/components/crypto-icons",
                validate: (input: string) => input.trim().length > 0 || "Directory cannot be empty",
            },
            {
                type: "input",
                name: "imageBasePath",
                message: "Base path for images:",
                default: config.imageBasePath || "/images/crypto",
                validate: (input: string) => input.trim().length > 0 || "Image path cannot be empty",
            },
            {
                type: "input",
                name: "darkModeClass",
                message: "CSS class for dark mode detection:",
                default: config.darkModeClass || "dark",
                validate: (input: string) => input.trim().length > 0 || "Dark mode class cannot be empty",
            },
            {
                type: "confirm",
                name: "save",
                message: "Save configuration?",
                default: true,
            },
        ]);

        if (answers.save) {
            const newConfig: Config = {
                defaultDirectory: answers.defaultDirectory,
                imageBasePath: answers.imageBasePath,
                darkModeClass: answers.darkModeClass,
            };

            await saveConfig(newConfig);
            console.log(chalk.green("\n✅ Configuration saved successfully!"));
            console.log(chalk.yellow("\nNext time you run commands, these settings will be used by default."));
        } else {
            console.log(chalk.yellow("Configuration not saved."));
        }
    } catch (error) {
        console.error(chalk.red("❌ Failed to configure:"), error);
        process.exit(1);
    }
}
