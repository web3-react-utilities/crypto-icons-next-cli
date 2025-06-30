import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function removeTokens(tokens: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${tokens.length} token(s)...`));

    for (const token of tokens) {
        await removeFromIconMap(token, targetDir);
        await removeFromTokenSymbolEnum(token, targetDir);
    }
}

export async function removeWallets(wallets: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${wallets.length} wallet(s)...`));

    for (const wallet of wallets) {
        await removeFromIconMap(wallet, targetDir);
        await removeFromWalletEnum(wallet, targetDir);
    }
}

export async function removeSystems(systems: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${systems.length} system(s)...`));

    for (const system of systems) {
        await removeFromIconMap(system, targetDir);
        await removeFromSystemEnum(system, targetDir);
    }
}

async function removeFromIconMap(name: string, targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");

    if (!(await fs.pathExists(constantsFile))) {
        console.log(chalk.yellow(`⚠️ Constants file not found: ${constantsFile}`));
        return;
    }

    let content = await fs.readFile(constantsFile, "utf-8");

    // Remove the icon entry from iconMap
    const iconKeyRegex = new RegExp(`\\s*"${name}":\\s*\\{[^}]*\\},?\\n?`, "g");
    const updatedContent = content.replace(iconKeyRegex, "");

    if (content !== updatedContent) {
        await fs.writeFile(constantsFile, updatedContent);
        console.log(chalk.green(`✓ Removed ${name} from icon map`));
    } else {
        console.log(chalk.yellow(`⚠️ Icon ${name} not found in map`));
    }
}

async function removeTokenComponent(token: string, targetDir: string): Promise<void> {
    const componentFile = path.join(targetDir, "tokens", `Icon${token}.tsx`);

    if (await fs.pathExists(componentFile)) {
        await fs.remove(componentFile);
        console.log(chalk.green(`✓ Removed token component: Icon${token}`));
    } else {
        console.log(chalk.yellow(`⚠️ Token component not found: Icon${token}`));
    }
}

async function removeWalletComponent(wallet: string, targetDir: string): Promise<void> {
    const componentFile = path.join(targetDir, "wallets", `Icon${wallet}.tsx`);

    if (await fs.pathExists(componentFile)) {
        await fs.remove(componentFile);
        console.log(chalk.green(`✓ Removed wallet component: Icon${wallet}`));
    } else {
        console.log(chalk.yellow(`⚠️ Wallet component not found: Icon${wallet}`));
    }
}

async function removeSystemComponent(system: string, targetDir: string): Promise<void> {
    const componentFile = path.join(targetDir, "systems", `Icon${system}.tsx`);

    if (await fs.pathExists(componentFile)) {
        await fs.remove(componentFile);
        console.log(chalk.green(`✓ Removed system component: Icon${system}`));
    } else {
        console.log(chalk.yellow(`⚠️ System component not found: Icon${system}`));
    }
}

async function removeFromTokenExports(token: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "tokens", "index.ts");

    if (await fs.pathExists(indexFile)) {
        let content = await fs.readFile(indexFile, "utf-8");
        const exportLine = `export { Icon${token} } from './Icon${token}';`;

        if (content.includes(exportLine)) {
            content = content.replace(exportLine + "\n", "").replace(exportLine, "");
            await fs.writeFile(indexFile, content);
        }
    }
}

async function removeFromWalletExports(wallet: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "wallets", "index.ts");

    if (await fs.pathExists(indexFile)) {
        let content = await fs.readFile(indexFile, "utf-8");
        const exportLine = `export { Icon${wallet} } from './Icon${wallet}';`;

        if (content.includes(exportLine)) {
            content = content.replace(exportLine + "\n", "").replace(exportLine, "");
            await fs.writeFile(indexFile, content);
        }
    }
}

async function removeFromSystemExports(system: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "systems", "index.ts");

    if (await fs.pathExists(indexFile)) {
        let content = await fs.readFile(indexFile, "utf-8");
        const exportLine = `export { Icon${system} } from './Icon${system}';`;

        if (content.includes(exportLine)) {
            content = content.replace(exportLine + "\n", "").replace(exportLine, "");
            await fs.writeFile(indexFile, content);
        }
    }
}

async function removeFromTokenSymbolEnum(token: string, targetDir: string): Promise<void> {
    const tokenSymbolFile = path.join(targetDir, "types", "TokenSymbol.ts");

    if (await fs.pathExists(tokenSymbolFile)) {
        let content = await fs.readFile(tokenSymbolFile, "utf-8");
        const enumEntry = `  ${token} = "${token}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(tokenSymbolFile, content);
        }
    }
}

async function removeFromWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const walletNameFile = path.join(targetDir, "types", "WalletName.ts");

    if (await fs.pathExists(walletNameFile)) {
        let content = await fs.readFile(walletNameFile, "utf-8");
        const enumEntry = `  ${wallet} = "${wallet}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(walletNameFile, content);
        }
    }
}

async function removeFromSystemEnum(system: string, targetDir: string): Promise<void> {
    const systemNameFile = path.join(targetDir, "types", "SystemName.ts");

    if (await fs.pathExists(systemNameFile)) {
        let content = await fs.readFile(systemNameFile, "utf-8");
        const enumEntry = `  ${system} = "${system}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(systemNameFile, content);
        }
    }
}

async function removeFromImagePaths(name: string, category: "TOKEN" | "WALLET" | "SYSTEM", targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");

    if (await fs.pathExists(constantsFile)) {
        let content = await fs.readFile(constantsFile, "utf-8");
        const constName = `${category}_${name}`;

        // Remove the constant declaration (looking for multi-line export)
        const constRegex = new RegExp(`export const ${constName}: ImagePaths = \\{[\\s\\S]*?\\};?\\n?`, "g");
        content = content.replace(constRegex, "");

        await fs.writeFile(constantsFile, content);
    }
}
