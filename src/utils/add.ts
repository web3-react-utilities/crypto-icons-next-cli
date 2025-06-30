import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { getImageBasePathWithConfig } from "./config";

export async function addTokens(tokens: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${tokens.length} token(s)...`));

    for (const token of tokens) {
        await addTokenToIconMap(token, targetDir);
        await updateTokenSymbolEnum(token, targetDir);
    }
}

export async function addWallets(wallets: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${wallets.length} wallet(s)...`));

    for (const wallet of wallets) {
        await addWalletToIconMap(wallet, targetDir);
        await updateWalletEnum(wallet, targetDir);
    }
}

export async function addSystems(systems: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${systems.length} system(s)...`));

    for (const system of systems) {
        await addSystemToIconMap(system, targetDir);
        await updateSystemEnum(system, targetDir);
    }
}

async function addTokenToIconMap(token: string, targetDir: string): Promise<void> {
    await addToIconMap(token, "tokens", targetDir);
    console.log(chalk.green(`✓ Added token to icon map: ${token}`));
}

async function addWalletToIconMap(wallet: string, targetDir: string): Promise<void> {
    await addToIconMap(wallet, "wallets", targetDir);
    console.log(chalk.green(`✓ Added wallet to icon map: ${wallet}`));
}

async function addSystemToIconMap(system: string, targetDir: string): Promise<void> {
    await addToIconMap(system, "systems", targetDir);
    console.log(chalk.green(`✓ Added system to icon map: ${system}`));
}

async function addToIconMap(name: string, category: string, targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");

    if (!(await fs.pathExists(constantsFile))) {
        throw new Error(`Constants file not found: ${constantsFile}`);
    }

    // Generate Firebase URLs based on category
    let lightModePath: string;
    let darkModePath: string;

    if (category === "tokens") {
        lightModePath = `baseImgUrlToken("${name}-lightmode")`;
        darkModePath = `baseImgUrlToken("${name}-darkmode")`;
    } else if (category === "wallets") {
        lightModePath = `baseImgUrlWallet("${name}-lightmode")`;
        darkModePath = `baseImgUrlWallet("${name}-darkmode")`;
    } else if (category === "systems") {
        lightModePath = `baseImgUrlSystem("${name}-lightmode")`;
        darkModePath = `baseImgUrlSystem("${name}-darkmode")`;
    } else {
        throw new Error(`Unknown category: ${category}`);
    }

    let content = await fs.readFile(constantsFile, "utf-8");

    // Check if icon already exists
    const iconKey = `"${name}":`;
    if (content.includes(iconKey)) {
        console.log(chalk.yellow(`⚠️ Icon ${name} already exists in map, skipping...`));
        return;
    }

    // Find the iconMap object and add the new entry
    const mapRegex = /(export const iconMap: Record<string, ImagePaths> = \{)([\s\S]*?)(\};)/;
    const match = content.match(mapRegex);

    if (!match) {
        throw new Error("Could not find iconMap in constants file");
    }

    const beforeMap = match[1];
    const mapContent = match[2];
    const afterMap = match[3];

    // Add the new icon entry (using function calls, not strings)
    const newEntry = `  "${name}": {
    lightMode: ${lightModePath},
    darkMode: ${darkModePath}
  },`;

    // Insert new entry at the end of the map
    const updatedMapContent = mapContent + (mapContent.trim() ? "\n" : "") + newEntry + "\n";
    const updatedContent = content.replace(mapRegex, beforeMap + updatedMapContent + afterMap);

    await fs.writeFile(constantsFile, updatedContent);
}

async function updateTokenSymbolEnum(token: string, targetDir: string): Promise<void> {
    const tokenSymbolFile = path.join(targetDir, "types", "TokenSymbol.ts");

    if (await fs.pathExists(tokenSymbolFile)) {
        let content = await fs.readFile(tokenSymbolFile, "utf-8");

        // Add to TokenSymbol enum if not already present
        const enumEntry = `  ${token} = "${token}",`;
        if (!content.includes(enumEntry)) {
            content = content.replace(/export enum TokenSymbol \{[^}]*\}/, (match) => {
                if (match.includes("// Example:")) {
                    return match.replace("// Example:", `${enumEntry}\n  // Example:`);
                } else {
                    return match.replace("}", `  ${enumEntry}\n}`);
                }
            });
            await fs.writeFile(tokenSymbolFile, content);
        }
    }
}

async function updateWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const walletNameFile = path.join(targetDir, "types", "WalletName.ts");

    if (await fs.pathExists(walletNameFile)) {
        let content = await fs.readFile(walletNameFile, "utf-8");

        // Add to WalletName enum if not already present
        const enumEntry = `  ${wallet} = "${wallet}",`;
        if (!content.includes(enumEntry)) {
            content = content.replace(/export enum WalletName \{[^}]*\}/, (match) => {
                if (match.includes("// Example:")) {
                    return match.replace("// Example:", `${enumEntry}\n  // Example:`);
                } else {
                    return match.replace("}", `  ${enumEntry}\n}`);
                }
            });
            await fs.writeFile(walletNameFile, content);
        }
    }
}

async function updateSystemEnum(system: string, targetDir: string): Promise<void> {
    const systemNameFile = path.join(targetDir, "types", "SystemName.ts");

    if (await fs.pathExists(systemNameFile)) {
        let content = await fs.readFile(systemNameFile, "utf-8");

        // Add to SystemName enum if not already present
        const enumEntry = `  ${system} = "${system}",`;
        if (!content.includes(enumEntry)) {
            content = content.replace(/export enum SystemName \{[^}]*\}/, (match) => {
                if (match.includes("// Example:")) {
                    return match.replace("// Example:", `${enumEntry}\n  // Example:`);
                } else {
                    return match.replace("}", `  ${enumEntry}\n}`);
                }
            });
            await fs.writeFile(systemNameFile, content);
        }
    }
}
