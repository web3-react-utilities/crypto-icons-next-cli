import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { getImageBasePathWithConfig } from "./config";

export async function addTokens(tokens: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${tokens.length} token(s)...`));

    for (const token of tokens) {
        await addTokenComponent(token, targetDir);
        await updateTokenExports(token, targetDir);
        await updateTokenEnum(token, targetDir);
    }
}

export async function addWallets(wallets: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${wallets.length} wallet(s)...`));

    for (const wallet of wallets) {
        await addWalletComponent(wallet, targetDir);
        await updateWalletExports(wallet, targetDir);
        await updateWalletEnum(wallet, targetDir);
    }
}

export async function addSystems(systems: string[], targetDir: string): Promise<void> {
    console.log(chalk.blue(`Adding ${systems.length} system(s)...`));

    for (const system of systems) {
        await addSystemComponent(system, targetDir);
        await updateSystemExports(system, targetDir);
        await updateSystemEnum(system, targetDir);
    }
}

async function addTokenComponent(token: string, targetDir: string): Promise<void> {
    const templatePath = path.join(__dirname, "..", "templates", "TokenTemplate.tsx");
    let componentContent = await fs.readFile(templatePath, "utf-8");

    // Replace template placeholders
    componentContent = componentContent.replace(/\{\{TOKEN_NAME\}\}/g, token);

    const componentFile = path.join(targetDir, "tokens", `Icon${token}.tsx`);
    await fs.writeFile(componentFile, componentContent);
    console.log(chalk.green(`✓ Created token component: Icon${token}`));

    // Add to image paths constants
    await addTokenImagePathConstant(token, targetDir);
}

async function addWalletComponent(wallet: string, targetDir: string): Promise<void> {
    const templatePath = path.join(__dirname, "..", "templates", "WalletTemplate.tsx");
    let componentContent = await fs.readFile(templatePath, "utf-8");

    // Replace template placeholders
    componentContent = componentContent.replace(/\{\{WALLET_NAME\}\}/g, wallet);

    const componentFile = path.join(targetDir, "wallets", `Icon${wallet}.tsx`);
    await fs.writeFile(componentFile, componentContent);
    console.log(chalk.green(`✓ Created wallet component: Icon${wallet}`));

    // Add to image paths constants
    await addWalletImagePathConstant(wallet, targetDir);
}

async function addSystemComponent(system: string, targetDir: string): Promise<void> {
    const templatePath = path.join(__dirname, "..", "templates", "SystemTemplate.tsx");
    let componentContent = await fs.readFile(templatePath, "utf-8");

    // Replace template placeholders
    componentContent = componentContent.replace(/\{\{SYSTEM_NAME\}\}/g, system);

    const componentFile = path.join(targetDir, "systems", `Icon${system}.tsx`);
    await fs.writeFile(componentFile, componentContent);
    console.log(chalk.green(`✓ Created system component: Icon${system}`));

    // Add to image paths constants
    await addSystemImagePathConstant(system, targetDir);
}

async function updateTokenExports(token: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "tokens", "index.ts");
    const exportLine = `export { Icon${token} } from './Icon${token}';\n`;

    if (await fs.pathExists(indexFile)) {
        const content = await fs.readFile(indexFile, "utf-8");
        if (!content.includes(exportLine)) {
            await fs.appendFile(indexFile, exportLine);
        }
    } else {
        await fs.writeFile(indexFile, exportLine);
    }
}

async function updateWalletExports(wallet: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "wallets", "index.ts");
    const exportLine = `export { Icon${wallet} } from './Icon${wallet}';\n`;

    if (await fs.pathExists(indexFile)) {
        const content = await fs.readFile(indexFile, "utf-8");
        if (!content.includes(exportLine)) {
            await fs.appendFile(indexFile, exportLine);
        }
    } else {
        await fs.writeFile(indexFile, exportLine);
    }
}

async function updateSystemExports(system: string, targetDir: string): Promise<void> {
    const indexFile = path.join(targetDir, "systems", "index.ts");
    const exportLine = `export { Icon${system} } from './Icon${system}';\n`;

    if (await fs.pathExists(indexFile)) {
        const content = await fs.readFile(indexFile, "utf-8");
        if (!content.includes(exportLine)) {
            await fs.appendFile(indexFile, exportLine);
        }
    } else {
        await fs.writeFile(indexFile, exportLine);
    }
}

async function updateTokenEnum(token: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");

        // Add to TokenName enum if not already present
        const enumEntry = `  ${token} = "${token}",`;
        if (!content.includes(enumEntry)) {
            content = content.replace(/export enum TokenName \{[^}]*\}/, (match) => {
                if (match.includes("// Example:")) {
                    return match.replace("// Example:", `${enumEntry}\n  // Example:`);
                } else {
                    return match.replace("}", `  ${enumEntry}\n}`);
                }
            });
            await fs.writeFile(typesFile, content);
        }
    }
}

async function updateWalletEnum(wallet: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");

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
            await fs.writeFile(typesFile, content);
        }
    }
}

async function updateSystemEnum(system: string, targetDir: string): Promise<void> {
    const typesFile = path.join(targetDir, "types", "index.ts");

    if (await fs.pathExists(typesFile)) {
        let content = await fs.readFile(typesFile, "utf-8");

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
            await fs.writeFile(typesFile, content);
        }
    }
}

async function addTokenImagePathConstant(token: string, targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");
    const baseImagePath = await getImageBasePathWithConfig();

    if (await fs.pathExists(constantsFile)) {
        let content = await fs.readFile(constantsFile, "utf-8");

        const constant = `export const TOKEN_${token}: ImagePaths = {
  lightMode: "${baseImagePath}/tokens/${token}-lightmode.png",
  darkMode: "${baseImagePath}/tokens/${token}-darkmode.png"
};`;

        if (!content.includes(`TOKEN_${token}`)) {
            // Add after the token comment
            content = content.replace("// Token image paths will be added here", `// Token image paths will be added here\n${constant}`);
            await fs.writeFile(constantsFile, content);
        }
    }
}

async function addWalletImagePathConstant(wallet: string, targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");
    const baseImagePath = await getImageBasePathWithConfig();

    if (await fs.pathExists(constantsFile)) {
        let content = await fs.readFile(constantsFile, "utf-8");

        const constant = `export const WALLET_${wallet}: ImagePaths = {
  lightMode: "${baseImagePath}/wallets/${wallet}-lightmode.png",
  darkMode: "${baseImagePath}/wallets/${wallet}-darkmode.png"
};`;

        if (!content.includes(`WALLET_${wallet}`)) {
            // Add after the wallet comment
            content = content.replace("// Wallet image paths will be added here", `// Wallet image paths will be added here\n${constant}`);
            await fs.writeFile(constantsFile, content);
        }
    }
}

async function addSystemImagePathConstant(system: string, targetDir: string): Promise<void> {
    const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");
    const baseImagePath = await getImageBasePathWithConfig();

    if (await fs.pathExists(constantsFile)) {
        let content = await fs.readFile(constantsFile, "utf-8");

        const constant = `export const SYSTEM_${system}: ImagePaths = {
  lightMode: "${baseImagePath}/systems/${system}-lightmode.png",
  darkMode: "${baseImagePath}/systems/${system}-darkmode.png"
};`;

        if (!content.includes(`SYSTEM_${system}`)) {
            // Add after the system comment
            content = content.replace("// System image paths will be added here", `// System image paths will be added here\n${constant}`);
            await fs.writeFile(constantsFile, content);
        }
    }
}
