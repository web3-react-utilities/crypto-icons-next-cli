import chalk from "chalk";
import { InitCommandOptions } from "../types";
import { createBaseStructure } from "../utils/structure";
import { getTargetDirectoryWithConfig } from "../utils/config";

export async function initCommand(options: InitCommandOptions): Promise<void> {
    try {
        console.log(chalk.blue("\n🚀 Initializing crypto icons for Next.js project...\n"));

        const targetDir = await getTargetDirectoryWithConfig(options.dir);

        await createBaseStructure(targetDir);

        console.log(chalk.green("\n✅ Crypto icons initialized successfully!"));
        console.log(chalk.yellow("\nNext steps:"));
        console.log(chalk.white("  1. Configure default settings (optional): crypto-next-icons config"));
        console.log(chalk.white("  2. Add some icons: crypto-next-icons add --token BTC ETH"));
        console.log(chalk.white("  3. Import and use in your components:"));
        console.log(chalk.gray(`     import { CryptoIcon } from "${targetDir.replace(process.cwd(), ".")}"`));
        console.log(chalk.gray(`     <CryptoIcon name="BTC" size={32} />`));
    } catch (error) {
        console.error(chalk.red("❌ Failed to initialize crypto icons:"), error);
        process.exit(1);
    }
}
