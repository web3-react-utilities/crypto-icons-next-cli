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

    // Find the iconMap object first (tolerant to whitespace/newlines)
    const mapRegex = /(export\s+const\s+iconMap\s*:\s*Record<\s*string\s*,\s*ImagePaths\s*>\s*=\s*\{)([\s\S]*?)(\}\s*;)/i;
    const match = content.match(mapRegex);

    if (!match) {
        throw new Error("Could not find iconMap in constants file");
    }

    const beforeMap = match[1];
    const mapContent = match[2];
    const afterMap = match[3];

    // Detect newline style to respect user's format
    const newline = content.includes("\r\n") ? "\r\n" : "\n";
    // Detect indentation used for entries inside iconMap
    const detectedIndent = detectIndent(mapContent) || "  ";

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
    const newMapContent = generateIconMapContent(existingIcons, detectedIndent, newline);
    const updatedContent = content.replace(mapRegex, beforeMap + newMapContent + afterMap);

    await fs.writeFile(constantsFile, updatedContent);
}

async function updateTokenSymbolEnum(token: string, targetDir: string): Promise<void> {
    const file = path.join(targetDir, "types", "TokenSymbol.ts");
    await updateEnumFile(file, "TokenSymbol", token);
}

async function updateWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const file = path.join(targetDir, "types", "WalletName.ts");
    await updateEnumFile(file, "WalletName", wallet);
}

async function updateSystemEnum(system: string, targetDir: string): Promise<void> {
    const file = path.join(targetDir, "types", "SystemName.ts");
    await updateEnumFile(file, "SystemName", system);
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
        const lightMode = stripTrailingComma(match[2].trim());
        const darkMode = stripTrailingComma(match[3].trim());

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

function stripTrailingComma(value: string): string {
    // Remove a trailing comma if formatter added one
    return value.replace(/,\s*$/, "");
}

function generateIconMapContent(organized: OrganizedIcons, indent: string, nl: string): string {
    // Base indent is what's used before a key line (e.g., 2 or 4 spaces)
    const i1 = indent; // level 1 inside map
    const i2 = indent + indent; // level 2 for properties

    let content = nl + i1 + "// Token icons will be added here" + nl;

    // Add tokens section
    organized.tokens.forEach((icon: IconEntry, index: number) => {
        content += `${i1}"${icon.name}": {${nl}${i2}lightMode: ${icon.lightMode},${nl}${i2}darkMode: ${icon.darkMode}${nl}${i1}}`;
        // Add comma if not the last item in tokens or if there are wallets/systems after
        if (index < organized.tokens.length - 1 || organized.wallets.length > 0 || organized.systems.length > 0) {
            content += ",";
        }
        content += nl;
    });

    if (organized.tokens.length > 0) content += nl;

    content += i1 + "// Wallet icons will be added here" + nl;

    // Add wallets section
    organized.wallets.forEach((icon: IconEntry, index: number) => {
        content += `${i1}"${icon.name}": {${nl}${i2}lightMode: ${icon.lightMode},${nl}${i2}darkMode: ${icon.darkMode}${nl}${i1}}`;
        // Add comma if not the last item in wallets or if there are systems after
        if (index < organized.wallets.length - 1 || organized.systems.length > 0) {
            content += ",";
        }
        content += nl;
    });

    if (organized.wallets.length > 0) content += nl;

    content += i1 + "// System icons will be added here" + nl;

    // Add systems section
    organized.systems.forEach((icon: IconEntry, index: number) => {
        content += `${i1}"${icon.name}": {${nl}${i2}lightMode: ${icon.lightMode},${nl}${i2}darkMode: ${icon.darkMode}${nl}${i1}}`;
        // Add comma if not the last item
        if (index < organized.systems.length - 1) {
            content += ",";
        }
        content += nl;
    });

    return content;
}

function detectIndent(mapContent: string): string | null {
    // Try to find the first entry line and use its leading whitespace
    const entryLine = mapContent.match(/\n([ \t]+)"[^"\n]+"\s*:/);
    if (entryLine && entryLine[1]) return entryLine[1];
    // Fallback: try to read indent from the token comment line
    const tokenComment = mapContent.match(/\n([ \t]+)\/\/\s*Token icons will be added here/);
    if (tokenComment && tokenComment[1]) return tokenComment[1];
    return null;
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

function generateEnumBody(entries: string[], indent: string, nl: string): string {
    let body = nl;
    const i1 = indent || "  ";
    if (entries.length === 0) {
        body += i1 + '// Example: BTC = "BTC"' + nl;
        return body;
    }
    entries.forEach((entry, index) => {
        body += `${i1}${entry} = "${entry}"`;
        if (index < entries.length - 1) body += ",";
        body += nl;
    });
    return body;
}

async function updateEnumFile(filePath: string, enumName: string, newEntry: string): Promise<void> {
    if (!(await fs.pathExists(filePath))) return;
    let content = await fs.readFile(filePath, "utf-8");

    const nl = detectNewline(content);
    // Match enum block: keep header and closing brace, replace only body
    const enumBlock = new RegExp(`(export\\s+enum\\s+${enumName}\\s*\\{)([\\s\\S]*?)(\\})`);
    const match = content.match(enumBlock);
    if (!match) return;

    const header = match[1];
    const body = match[2];
    const footer = match[3];

    const entries = parseEnumEntries(body);
    if (entries.includes(newEntry)) return;
    entries.push(newEntry);
    entries.sort();

    const indent = detectEnumIndent(body) || "  ";
    const newBody = generateEnumBody(entries, indent, nl);
    const replacement = header + newBody + footer;
    content = content.replace(enumBlock, replacement);
    await fs.writeFile(filePath, content);
}

function detectNewline(text: string): string {
    return text.includes("\r\n") ? "\r\n" : "\n";
}

function detectEnumIndent(enumBody: string): string | null {
    // Find first entry line like '  BTC = "BTC"'
    const m = enumBody.match(/\n([ \t]+)\w+\s*=\s*"/);
    if (m && m[1]) return m[1];
    return null;
}
