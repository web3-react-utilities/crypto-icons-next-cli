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

    // Find the iconMap object
    const mapRegex = /(export const iconMap: Record<string, ImagePaths> = \{)([\s\S]*?)(\};)/;
    const match = content.match(mapRegex);

    if (!match) {
        console.log(chalk.yellow(`⚠️ Could not find iconMap in constants file`));
        return;
    }

    const beforeMap = match[1];
    const mapContent = match[2];
    const afterMap = match[3];

    // Check if icon exists in the map
    const iconKey = `"${name}":`;
    const mapContentWithoutComments = mapContent.replace(/^\s*\/\/.*$/gm, "");
    if (!mapContentWithoutComments.includes(iconKey)) {
        console.log(chalk.yellow(`⚠️ Icon ${name} not found in map`));
        return;
    }

    // Parse existing icons and remove the target icon
    const existingIcons = parseExistingIcons(mapContent);

    // Remove icon from appropriate category
    let removed = false;
    existingIcons.tokens = existingIcons.tokens.filter((icon) => {
        if (icon.name === name) {
            removed = true;
            return false;
        }
        return true;
    });

    if (!removed) {
        existingIcons.wallets = existingIcons.wallets.filter((icon) => {
            if (icon.name === name) {
                removed = true;
                return false;
            }
            return true;
        });
    }

    if (!removed) {
        existingIcons.systems = existingIcons.systems.filter((icon) => {
            if (icon.name === name) {
                removed = true;
                return false;
            }
            return true;
        });
    }

    if (removed) {
        // Regenerate the iconMap content with proper formatting
        const newMapContent = generateIconMapContent(existingIcons);
        const updatedContent = content.replace(mapRegex, beforeMap + newMapContent + afterMap);

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

        // Parse existing enum entries
        const enumRegex = /export enum TokenSymbol \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Remove the target entry
            const filteredEntries = entries.filter((entry: string) => entry !== token);

            if (filteredEntries.length !== entries.length) {
                // Generate new enum content (already sorted)
                const newEnumContent = generateEnumContent(filteredEntries, "TokenSymbol");
                content = content.replace(enumRegex, newEnumContent);

                await fs.writeFile(tokenSymbolFile, content);
            }
        }
    }
}

async function removeFromWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const walletNameFile = path.join(targetDir, "types", "WalletName.ts");

    if (await fs.pathExists(walletNameFile)) {
        let content = await fs.readFile(walletNameFile, "utf-8");

        // Parse existing enum entries
        const enumRegex = /export enum WalletName \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Remove the target entry
            const filteredEntries = entries.filter((entry: string) => entry !== wallet);

            if (filteredEntries.length !== entries.length) {
                // Generate new enum content (already sorted)
                const newEnumContent = generateEnumContent(filteredEntries, "WalletName");
                content = content.replace(enumRegex, newEnumContent);

                await fs.writeFile(walletNameFile, content);
            }
        }
    }
}

async function removeFromSystemEnum(system: string, targetDir: string): Promise<void> {
    const systemNameFile = path.join(targetDir, "types", "SystemName.ts");

    if (await fs.pathExists(systemNameFile)) {
        let content = await fs.readFile(systemNameFile, "utf-8");

        // Parse existing enum entries
        const enumRegex = /export enum SystemName \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Remove the target entry
            const filteredEntries = entries.filter((entry: string) => entry !== system);

            if (filteredEntries.length !== entries.length) {
                // Generate new enum content (already sorted)
                const newEnumContent = generateEnumContent(filteredEntries, "SystemName");
                content = content.replace(enumRegex, newEnumContent);

                await fs.writeFile(systemNameFile, content);
            }
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

// Helper types and functions for organizing icons
type IconEntry = {
    name: string;
    lightMode: string;
    darkMode: string;
};

type OrganizedIcons = {
    tokens: IconEntry[];
    wallets: IconEntry[];
    systems: IconEntry[];
};

function parseExistingIcons(mapContent: string): OrganizedIcons {
    const organized: OrganizedIcons = {
        tokens: [],
        wallets: [],
        systems: [],
    };

    // Parse existing icon entries
    const iconRegex = /"([^"]+)":\s*\{[^}]+lightMode:\s*([^,]+),\s*darkMode:\s*([^}]+)\s*\}/g;
    let match;

    while ((match = iconRegex.exec(mapContent)) !== null) {
        const name = match[1];
        const lightMode = match[2].trim();
        const darkMode = match[3].trim();

        const iconEntry: IconEntry = { name, lightMode, darkMode };

        // Categorize based on the function used
        if (lightMode.includes("baseImgUrlToken")) {
            organized.tokens.push(iconEntry);
        } else if (lightMode.includes("baseImgUrlWallet")) {
            organized.wallets.push(iconEntry);
        } else if (lightMode.includes("baseImgUrlSystem")) {
            organized.systems.push(iconEntry);
        }
    }

    return organized;
}

function generateIconMapContent(organized: OrganizedIcons): string {
    let content = "\n  // Token icons will be added here\n";

    // Add tokens section
    organized.tokens.forEach((icon: IconEntry, index: number) => {
        content += `  "${icon.name}": {\n    lightMode: ${icon.lightMode},\n    darkMode: ${icon.darkMode}\n  }`;
        // Add comma if not the last item in tokens or if there are wallets/systems after
        if (index < organized.tokens.length - 1 || organized.wallets.length > 0 || organized.systems.length > 0) {
            content += ",";
        }
        content += "\n";
    });

    if (organized.tokens.length > 0) content += "\n";

    content += "  // Wallet icons will be added here\n";

    // Add wallets section
    organized.wallets.forEach((icon: IconEntry, index: number) => {
        content += `  "${icon.name}": {\n    lightMode: ${icon.lightMode},\n    darkMode: ${icon.darkMode}\n  }`;
        // Add comma if not the last item in wallets or if there are systems after
        if (index < organized.wallets.length - 1 || organized.systems.length > 0) {
            content += ",";
        }
        content += "\n";
    });

    if (organized.wallets.length > 0) content += "\n";

    content += "  // System icons will be added here\n";

    // Add systems section
    organized.systems.forEach((icon: IconEntry, index: number) => {
        content += `  "${icon.name}": {\n    lightMode: ${icon.lightMode},\n    darkMode: ${icon.darkMode}\n  }`;
        // Add comma if not the last item
        if (index < organized.systems.length - 1) {
            content += ",";
        }
        content += "\n";
    });

    return content;
}

// Helper functions for enum parsing and generation
function parseEnumEntries(enumContent: string): string[] {
    const entries: string[] = [];

    // Remove comment lines first to avoid parsing enum entries in comments
    const enumContentWithoutComments = enumContent.replace(/^\s*\/\/.*$/gm, "");

    // Extract all enum entries like "BTC = "BTC","
    const entryRegex = /(\w+)\s*=\s*"[^"]*"/g;
    let match;

    while ((match = entryRegex.exec(enumContentWithoutComments)) !== null) {
        entries.push(match[1]);
    }

    return entries;
}

function generateEnumContent(entries: string[], enumName: string): string {
    let content = `export enum ${enumName} {\n`;

    entries.forEach((entry, index) => {
        content += `  ${entry} = "${entry}"`;
        if (index < entries.length - 1) {
            content += ",";
        }
        content += "\n";
    });

    if (entries.length === 0) {
        content += '  // Example: BTC = "BTC"\n';
    }

    content += "}";
    return content;
}
