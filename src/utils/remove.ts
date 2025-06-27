import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function removeTokens(tokens: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${tokens.length} token(s)...`));

    for (const token of tokens) {
        await removeTokenComponent(token, targetDir);
        await removeFromTokenExports(token, targetDir);
        await removeFromTokenEnum(token, targetDir);
        await removeFromImagePaths(token, "TOKEN", targetDir);
    }
}

export async function removeWallets(wallets: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${wallets.length} wallet(s)...`));

    for (const wallet of wallets) {
        await removeWalletComponent(wallet, targetDir);
        await removeFromWalletExports(wallet, targetDir);
        await removeFromWalletEnum(wallet, targetDir);
        await removeFromImagePaths(wallet, "WALLET", targetDir);
    }
}

export async function removeSystems(systems: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Removing ${systems.length} system(s)...`));

    for (const system of systems) {
        await removeSystemComponent(system, targetDir);
        await removeFromSystemExports(system, targetDir);
        await removeFromSystemEnum(system, targetDir);
        await removeFromImagePaths(system, "SYSTEM", targetDir);
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

async function removeFromTokenEnum(token: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");
        const enumEntry = `  ${token} = "${token}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(typesFile, content);
        }
    }
}

async function removeFromWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");
        const enumEntry = `  ${wallet} = "${wallet}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(typesFile, content);
        }
    }
}

async function removeFromSystemEnum(system: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");
        const enumEntry = `  ${system} = "${system}",`;

        if (content.includes(enumEntry)) {
            content = content.replace(enumEntry + "\n", "").replace(enumEntry, "");
            await fs.writeFile(typesFile, content);
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
