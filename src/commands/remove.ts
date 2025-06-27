import chalk from 'chalk';
import { RemoveCommandOptions } from '../types';
import { getTargetDirectoryWithConfig } from '../utils/config';
import { removeTokens, removeWallets, removeSystems } from '../utils/remove';

export async function removeCommand(options: RemoveCommandOptions): Promise<void> {
  try {
    const targetDir = await getTargetDirectoryWithConfig(options.dir);
    
    if (!options.token && !options.wallet && !options.system) {
      console.log(chalk.yellow('⚠️ No icons specified to remove.'));
      console.log(chalk.white('Usage examples:'));
      console.log(chalk.gray('  crypto-next-icons remove --token BTC ETH'));
      console.log(chalk.gray('  crypto-next-icons remove --wallet MetaMask'));
      console.log(chalk.gray('  crypto-next-icons remove --system Ethereum'));
      return;
    }

    console.log(chalk.blue('\n🗑️ Removing crypto icons...\n'));

    if (options.token) {
      await removeTokens(options.token, targetDir);
    }

    if (options.wallet) {
      await removeWallets(options.wallet, targetDir);
    }

    if (options.system) {
      await removeSystems(options.system, targetDir);
    }

    console.log(chalk.green('\n✅ Icons removed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to remove icons:'), error);
    process.exit(1);
  }
}
