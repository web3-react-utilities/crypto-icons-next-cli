import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { getTargetDirectoryWithConfig } from "../utils/config";

export type UpdateCommandOptions = {
    dir?: string;
};

/**
 * Update constants/imagePaths.ts to use Firebase Hosting URLs instead of Storage URLs.
 * This preserves the existing iconMap entries, only rewrites the base helpers.
 */
export async function updateCommand(options: UpdateCommandOptions): Promise<void> {
    try {
        const targetDir = await getTargetDirectoryWithConfig(options.dir);
        const constantsFile = path.join(targetDir, "constants", "imagePaths.ts");

        if (!(await fs.pathExists(constantsFile))) {
            console.log(chalk.yellow("⚠️ constants/imagePaths.ts not found. Run `crypto-next-icons init` first."));
            return;
        }

        let content = await fs.readFile(constantsFile, "utf8");

        // Replace base section regardless of current state
        const replacements: Array<{ regex: RegExp; value: string }> = [
            { regex: /export\s+const\s+baseImgUrl\s*=\s*[^;]+;/, value: `export const baseImgUrl = 'https://crypto-images-4545f.web.app/images';` },
            {
                regex: /export\s+const\s+baseImgUrlToken\s*=\s*\([^)]*\)\s*=>\s*[^;]+;/,
                value: `export const baseImgUrlToken = (nameToken: string) => \`${"${"}baseImgUrl}/token/${"${"}nameToken}.png\`;`,
            },
            {
                regex: /export\s+const\s+baseImgUrlSystem\s*=\s*\([^)]*\)\s*=>\s*[^;]+;/,
                value: `export const baseImgUrlSystem = (nameSystem: string) => \`${"${"}baseImgUrl}/system/${"${"}nameSystem}.png\`;`,
            },
            {
                regex: /export\s+const\s+baseImgUrlWallet\s*=\s*\([^)]*\)\s*=>\s*[^;]+;/,
                value: `export const baseImgUrlWallet = (nameWallet: string) => \`${"${"}baseImgUrl}/wallet/${"${"}nameWallet}.png\`;`,
            },
        ];

        let replacedAny = false;
        for (const r of replacements) {
            if (r.regex.test(content)) {
                content = content.replace(r.regex, r.value);
                replacedAny = true;
            }
        }

        if (!replacedAny) {
            // If we couldn't find the lines, inject a new section after ImagePaths type
            const newBaseSection = `// Firebase Hosting URLs\nexport const baseImgUrl = 'https://crypto-images-4545f.web.app/images';\nexport const baseImgUrlToken = (nameToken: string) => \`${"${"}baseImgUrl}/token/${"${"}nameToken}.png\`;\nexport const baseImgUrlSystem = (nameSystem: string) => \`${"${"}baseImgUrl}/system/${"${"}nameSystem}.png\`;\nexport const baseImgUrlWallet = (nameWallet: string) => \`${"${"}baseImgUrl}/wallet/${"${"}nameWallet}.png\`;\n\n`;
            content = content.replace(/export\s+type\s+ImagePaths[\s\S]*?};\n/, (m) => m + "\n" + newBaseSection);
        }

        await fs.writeFile(constantsFile, content);
        console.log(chalk.green("✅ Updated image base URLs to Firebase Hosting in constants/imagePaths.ts"));

        // Also update next.config.* remotePatterns to hosting domain
        await ensureHostingRemotePattern(process.cwd());
    } catch (error) {
        console.error(chalk.red("❌ Failed to update constants to Hosting URLs:"), error);
        process.exit(1);
    }
}

async function ensureHostingRemotePattern(projectRoot: string) {
    const requiredHost = "crypto-images-4545f.web.app";
    const oldHost = "firebasestorage.googleapis.com";
    const patternSnippetArrayEntry = `      { protocol: 'https', hostname: 'crypto-images-4545f.web.app' }`;

    const candidateFiles = ["next.config.js", "next.config.mjs", "next.config.cjs", "next.config.ts"];

    let configPath: string | null = null;
    for (const file of candidateFiles) {
        const p = path.join(projectRoot, file);
        if (await fs.pathExists(p)) {
            configPath = p;
            break;
        }
    }

    if (!configPath) {
        // Create a minimal next.config.js
        configPath = path.join(projectRoot, "next.config.js");
        const content = `/** Added by crypto-next-icons update */\nconst nextConfig = {\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },\n};\n\nmodule.exports = nextConfig;\n`;
        await fs.writeFile(configPath, content, "utf8");
        console.log(chalk.green("✔ Created next.config.js with images.remotePatterns for Hosting domain."));
        return;
    }

    let content = await fs.readFile(configPath, "utf8");
    if (content.includes(requiredHost)) {
        console.log(chalk.gray("ℹ Hosting domain already present in next.config remotePatterns."));
        return;
    }

    // If old storage host exists in remotePatterns, replace its hostname with hosting domain
    if (content.includes(oldHost)) {
        content = content.replace(new RegExp(oldHost, "g"), requiredHost);
        await fs.writeFile(configPath, content, "utf8");
        console.log(chalk.green("✔ Replaced Storage host with Hosting domain in next.config."));
        return;
    }

    const hasImagesBlock = /images\s*:\s*{/.test(content);
    const hasRemotePatterns = /remotePatterns\s*:\s*\[/.test(content);
    const varConfigMatch = content.match(/const\s+(\w+)\s*=\s*{([\s\S]*?)}\s*;?[^]*?export\s+default\s+\1/);

    if (!hasImagesBlock) {
        let inserted = false;
        if (/module\.exports\s*=\s*/.test(content)) {
            content = content.replace(/module\.exports\s*=\s*/, (match) => {
                inserted = true;
                return `// Added by crypto-next-icons update\nconst __ci_next_config_injected_images = {\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },\n};\n\n${match}`;
            });
            if (inserted) {
                content = content.replace(/module\.exports\s*=\s*{/, (m) => m + "\n  ...__ci_next_config_injected_images.images,");
            }
        } else if (/export\s+default\s*{/.test(content)) {
            content = content.replace(/export\s+default\s*{/, (m) => `${m}\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },`);
            inserted = true;
        } else if (varConfigMatch) {
            const varName = varConfigMatch[1];
            const declRegex = new RegExp(`const\\s+${varName}\\s*=\\s*{`);
            if (declRegex.test(content)) {
                content = content.replace(declRegex, (m) => `${m}\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },`);
                inserted = true;
            }
        }
        if (inserted) {
            await fs.writeFile(configPath, content, "utf8");
            console.log(chalk.green("✔ Added Hosting domain to images.remotePatterns in next.config."));
            return;
        }
    } else if (hasImagesBlock && !hasRemotePatterns) {
        content = content.replace(/images\s*:\s*{/, (m) => `${m}\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],`);
        await fs.writeFile(configPath, content, "utf8");
        console.log(chalk.green("✔ Injected remotePatterns with Hosting domain into images block."));
        return;
    } else if (hasRemotePatterns) {
        const rpIndex = content.search(/remotePatterns\s*:\s*\[/);
        if (rpIndex !== -1) {
            const startBracket = content.indexOf("[", rpIndex);
            if (startBracket !== -1) {
                let i = startBracket + 1;
                let depth = 1;
                while (i < content.length && depth > 0) {
                    if (content[i] === "[") depth++;
                    else if (content[i] === "]") depth--;
                    i++;
                }
                const endBracket = i - 1;
                if (endBracket > startBracket) {
                    const before = content.substring(0, endBracket);
                    const inside = content.substring(startBracket + 1, endBracket).trim();
                    if (!inside.includes(requiredHost)) {
                        const needsComma = inside.length > 0 && !/[\,\n]\s*$/.test(inside);
                        const insertion = (inside.length ? (needsComma ? "," : "") + "\n" : "") + patternSnippetArrayEntry + "\n";
                        content = before + insertion + content.substring(endBracket);
                        await fs.writeFile(configPath, content, "utf8");
                        console.log(chalk.green("✔ Appended Hosting domain to existing remotePatterns array."));
                        return;
                    }
                }
            }
        }
    }

    console.log(chalk.yellow("⚠ Could not automatically update next.config. Please add this remote pattern:"));
    console.log("{ protocol: 'https', hostname: 'crypto-images-4545f.web.app' }");
}
