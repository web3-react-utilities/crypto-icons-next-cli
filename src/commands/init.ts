import chalk from "chalk";
import fs from "fs";
import path from "path";
import { InitCommandOptions } from "../types";
import { createBaseStructure } from "../utils/structure";
import { getTargetDirectoryWithConfig } from "../utils/config";

/**
 * Ensure Next.js `images.remotePatterns` includes firebase storage host. If no next.config.* file exists,
 * create a minimal next.config.js. If it exists but missing the host, try to inject it when safe; otherwise
 * prompt the user with a code snippet.
 */
async function ensureFirebaseRemotePattern(projectRoot: string) {
    const requiredHost = "crypto-images-4545f.web.app";
    const patternSnippetObject = `{
            hostname: 'crypto-images-4545f.web.app',
            protocol: 'https',
        }`;
    const patternSnippetArrayEntry = `      { hostname: 'crypto-images-4545f.web.app', protocol: 'https' }`;

    const candidateFiles = ["next.config.js", "next.config.mjs", "next.config.cjs", "next.config.ts"];

    let configPath: string | null = null;
    for (const file of candidateFiles) {
        const p = path.join(projectRoot, file);
        if (fs.existsSync(p)) {
            configPath = p;
            break;
        }
    }

    if (!configPath) {
        // Create a fresh next.config.js
        configPath = path.join(projectRoot, "next.config.js");
        const content = `/** Added by crypto-next-icons */\nconst nextConfig = {\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },\n};\n\nmodule.exports = nextConfig;\n`;
        fs.writeFileSync(configPath, content, "utf8");
        console.log(chalk.green("✔ Created next.config.js with required images.remotePatterns for Hosting domain."));
        return;
    }

    let content = fs.readFileSync(configPath, "utf8");
    if (content.includes(requiredHost)) {
        console.log(chalk.gray("ℹ Hosting domain already present in next.config."));
        return;
    }

    const hasImagesBlock = /images\s*:\s*{/.test(content);
    const hasRemotePatterns = /remotePatterns\s*:\s*\[/.test(content);
    // Capture: const <name> = { ... }; followed later by export default <name>
    const varConfigMatch = content.match(/const\s+(\w+)\s*=\s*{([\s\S]*?)}\s*;?[^]*?export\s+default\s+\1/);

    // Attempt to repair previously malformed insertion where images block was placed at top-level
    if (varConfigMatch && !hasImagesBlock) {
        // Detect a stray top-level images block (starts at beginning or after the JSDoc comment) preceding const declaration
        const strayBlockRegex = /(\/\*\*[^]*?\*\/\s*)?(\n)?\s*images:\s*{[\s\S]*?\n\s*},\s*\n/;
        if (strayBlockRegex.test(content)) {
            content = content.replace(strayBlockRegex, (m) => {
                // Remove stray block entirely
                return m.startsWith("/**") ? m.split("*/")[0] + "*/\n" : "";
            });
        }
    }

    if (!hasImagesBlock) {
        // Try to insert images block before module.exports or export default
        let inserted = false;
        if (/module\.exports\s*=\s*/.test(content)) {
            // Directly inject images block into the exported object literal
            content = content.replace(/module\.exports\s*=\s*{/, (m) => {
                inserted = true;
                return `${m}\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },`;
            });
        } else if (/export\s+default\s*{/.test(content)) {
            content = content.replace(/export\s+default\s*{/, (m) => {
                return `${m}\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },`;
            });
            inserted = true;
        } else if (varConfigMatch) {
            const varName = varConfigMatch[1];
            // Simple replacement: find 'const <varName> = {' and inject immediately after
            const declRegex = new RegExp(`const\\s+${varName}\\s*=\\s*{`);
            if (declRegex.test(content)) {
                content = content.replace(declRegex, (m) => {
                    return `${m}\n  images: {\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],\n  },`;
                });
                inserted = true;
            }
        }

        if (inserted) {
            fs.writeFileSync(configPath, content, "utf8");
            console.log(chalk.green("✔ Added images.remotePatterns (Hosting domain) to existing next.config."));
            return;
        }
    } else if (hasImagesBlock && !hasRemotePatterns) {
        // Inject remotePatterns inside images block (first occurrence)
        content = content.replace(/images\s*:\s*{/, (m) => {
            return `${m}\n    remotePatterns: [\n${patternSnippetArrayEntry},\n    ],`;
        });
        fs.writeFileSync(configPath, content, "utf8");
        console.log(chalk.green("✔ Injected remotePatterns array with Firebase host into images block."));
        return;
    } else if (hasRemotePatterns) {
        // Attempt to append entry inside remotePatterns array
        const rpIndex = content.search(/remotePatterns\s*:\s*\[/);
        if (rpIndex !== -1) {
            const startBracket = content.indexOf("[", rpIndex);
            if (startBracket !== -1) {
                // Find matching closing bracket for this array (basic balance)
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
                    const needsComma = inside.length > 0 && !/[,\n]\s*$/.test(inside);
                    const insertion = (inside.length ? (needsComma ? "," : "") + "\n" : "") + patternSnippetArrayEntry + "\n";
                    content = before + insertion + content.substring(endBracket);
                    fs.writeFileSync(configPath, content, "utf8");
                    console.log(chalk.green("✔ Appended Firebase host to existing remotePatterns array."));
                    return;
                }
            }
        }
    }

    // Fallback: could not safely modify; show instructions
    console.log(chalk.yellow("⚠ Could not automatically update next.config. Please add this inside your images.remotePatterns array:"));
    console.log(chalk.gray(patternSnippetObject));
}

export async function initCommand(options: InitCommandOptions): Promise<void> {
    try {
        console.log(chalk.blue("\n🚀 Initializing crypto icons...\n"));

        const targetDir = await getTargetDirectoryWithConfig(options.dir);
        const framework = options.framework ?? "next";

        await createBaseStructure(targetDir, framework);
        if (framework === "next") {
            // Ensure Next.js image remotePatterns config contains Hosting domain
            await ensureFirebaseRemotePattern(process.cwd());
        }

        console.log(chalk.green("\n✅ Crypto icons initialized successfully!"));
        console.log(chalk.yellow("\nNext steps:"));
        console.log(chalk.white("  1. Configure default settings (optional): crypto-next-icons config"));
        console.log(chalk.white("  2. Add some icons: crypto-next-icons add --token BTC ETH"));
        console.log(chalk.white("  3. Import and use in your components:"));
        console.log(chalk.gray(`     import { CryptoIcon } from "${targetDir.replace(process.cwd(), ".")}"`));
        console.log(chalk.gray(`     <CryptoIcon name="BTC" size={32} />`));
    } catch (error) {
        console.error(chalk.red("❌ Failed to initialize crypto icons:"), error);
        process.exit(1);
    }
}
