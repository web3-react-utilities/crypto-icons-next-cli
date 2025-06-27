import chalk from "chalk";
import { AddCommandOptions } from "../types";
import { getTargetDirectoryWithConfig } from "../utils/config";
import { addTokens, addWallets, addSystems } from "../utils/add";

export async function addCommand(options: AddCommandOptions): Promise<void> {
    try {
        const targetDir = await getTargetDirectoryWithConfig(options.dir);

        if (!options.token && !options.wallet && !options.system) {
            console.log(chalk.yellow("⚠️ No icons specified to add."));
            console.log(chalk.white("Usage examples:"));
            console.log(chalk.gray("  crypto-next-icons add --token BTC ETH"));
            console.log(chalk.gray("  crypto-next-icons add --wallet MetaMask TrustWallet"));
            console.log(chalk.gray("  crypto-next-icons add --system Ethereum Polygon"));
            return;
        }

        console.log(chalk.blue("\n📦 Adding crypto icons...\n"));

        if (options.token) {
            await addTokens(options.token, targetDir);
        }

        if (options.wallet) {
            await addWallets(options.wallet, targetDir);
        }

        if (options.system) {
            await addSystems(options.system, targetDir);
        }

        console.log(chalk.green("\n✅ Icons added successfully!"));
    } catch (error) {
        console.error(chalk.red("❌ Failed to add icons:"), error);
        process.exit(1);
    }
}
