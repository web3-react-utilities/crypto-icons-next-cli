import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { getImageBasePathWithConfig } from "./config";
import { specialTokens, specialWallets, specialSystems } from "./specialIcons";

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

    // Generate Firebase URLs based on category and whether it's a special icon
    let lightModePath: string;
    let darkModePath: string;

    if (category === "tokens") {
        const isSpecial = specialTokens.includes(name);
        if (isSpecial) {
            lightModePath = `baseImgUrlToken("${name}-lightmode")`;
            darkModePath = `baseImgUrlToken("${name}-darkmode")`;
        } else {
            // Non-special tokens use the same image for both modes
            lightModePath = `baseImgUrlToken("${name}")`;
            darkModePath = `baseImgUrlToken("${name}")`;
        }
    } else if (category === "wallets") {
        const isSpecial = specialWallets.includes(name);
        if (isSpecial) {
            lightModePath = `baseImgUrlWallet("${name}-lightmode")`;
            darkModePath = `baseImgUrlWallet("${name}-darkmode")`;
        } else {
            // Non-special wallets use the same image for both modes
            lightModePath = `baseImgUrlWallet("${name}")`;
            darkModePath = `baseImgUrlWallet("${name}")`;
        }
    } else if (category === "systems") {
        const isSpecial = specialSystems.includes(name);
        if (isSpecial) {
            lightModePath = `baseImgUrlSystem("${name}-lightmode")`;
            darkModePath = `baseImgUrlSystem("${name}-darkmode")`;
        } else {
            // Non-special systems use the same image for both modes
            lightModePath = `baseImgUrlSystem("${name}")`;
            darkModePath = `baseImgUrlSystem("${name}")`;
        }
    } else {
        throw new Error(`Unknown category: ${category}`);
    }

    let content = await fs.readFile(constantsFile, "utf-8");

    // Find the iconMap object first
    const mapRegex = /(export const iconMap: Record<string, ImagePaths> = \{)([\s\S]*?)(\};)/;
    const match = content.match(mapRegex);

    if (!match) {
        throw new Error("Could not find iconMap in constants file");
    }

    const beforeMap = match[1];
    const mapContent = match[2];
    const afterMap = match[3];

    // Check if icon already exists in the actual iconMap content (not in comments)
    const iconKey = `"${name}":`;
    // Remove comment lines to avoid false positives
    const mapContentWithoutComments = mapContent.replace(/^\s*\/\/.*$/gm, "");
    if (mapContentWithoutComments.includes(iconKey)) {
        console.log(chalk.yellow(`⚠️ Icon ${name} already exists in map, skipping...`));
        return;
    }

    // Parse existing icons and organize by category
    const existingIcons = parseExistingIcons(mapContent);

    // Add new icon to appropriate category
    const newIcon = {
        name,
        lightMode: lightModePath,
        darkMode: darkModePath,
    };

    if (category === "tokens") {
        existingIcons.tokens.push(newIcon);
        existingIcons.tokens.sort((a, b) => a.name.localeCompare(b.name));
    } else if (category === "wallets") {
        existingIcons.wallets.push(newIcon);
        existingIcons.wallets.sort((a, b) => a.name.localeCompare(b.name));
    } else if (category === "systems") {
        existingIcons.systems.push(newIcon);
        existingIcons.systems.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Regenerate the iconMap content
    const newMapContent = generateIconMapContent(existingIcons);
    const updatedContent = content.replace(mapRegex, beforeMap + newMapContent + afterMap);

    await fs.writeFile(constantsFile, updatedContent);
}

async function updateTokenSymbolEnum(token: string, targetDir: string): Promise<void> {
    const tokenSymbolFile = path.join(targetDir, "types", "TokenSymbol.ts");

    if (await fs.pathExists(tokenSymbolFile)) {
        let content = await fs.readFile(tokenSymbolFile, "utf-8");

        // Check if token already exists
        const enumEntry = `${token} = "${token}"`;
        if (content.includes(enumEntry)) {
            return; // Already exists
        }

        // Parse existing enum entries
        const enumRegex = /export enum TokenSymbol \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Add new entry and sort
            entries.push(token);
            entries.sort();

            // Generate new enum content
            const newEnumContent = generateEnumContent(entries, "TokenSymbol");
            content = content.replace(enumRegex, newEnumContent);

            await fs.writeFile(tokenSymbolFile, content);
        }
    }
}

async function updateWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const walletNameFile = path.join(targetDir, "types", "WalletName.ts");

    if (await fs.pathExists(walletNameFile)) {
        let content = await fs.readFile(walletNameFile, "utf-8");

        // Check if wallet already exists
        const enumEntry = `${wallet} = "${wallet}"`;
        if (content.includes(enumEntry)) {
            return; // Already exists
        }

        // Parse existing enum entries
        const enumRegex = /export enum WalletName \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Add new entry and sort
            entries.push(wallet);
            entries.sort();

            // Generate new enum content
            const newEnumContent = generateEnumContent(entries, "WalletName");
            content = content.replace(enumRegex, newEnumContent);

            await fs.writeFile(walletNameFile, content);
        }
    }
}

async function updateSystemEnum(system: string, targetDir: string): Promise<void> {
    const systemNameFile = path.join(targetDir, "types", "SystemName.ts");

    if (await fs.pathExists(systemNameFile)) {
        let content = await fs.readFile(systemNameFile, "utf-8");

        // Check if system already exists
        const enumEntry = `${system} = "${system}"`;
        if (content.includes(enumEntry)) {
            return; // Already exists
        }

        // Parse existing enum entries
        const enumRegex = /export enum SystemName \{([^}]*)\}/;
        const match = content.match(enumRegex);

        if (match) {
            const enumContent = match[1];
            const entries = parseEnumEntries(enumContent);

            // Add new entry and sort
            entries.push(system);
            entries.sort();

            // Generate new enum content
            const newEnumContent = generateEnumContent(entries, "SystemName");
            content = content.replace(enumRegex, newEnumContent);

            await fs.writeFile(systemNameFile, content);
        }
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

    // Extract all enum entries like "BTC = "BTC","
    const entryRegex = /(\w+)\s*=\s*"[^"]*"/g;
    let match;

    while ((match = entryRegex.exec(enumContent)) !== null) {
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
