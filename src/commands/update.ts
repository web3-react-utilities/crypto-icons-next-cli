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
    } catch (error) {
        console.error(chalk.red("❌ Failed to update constants to Hosting URLs:"), error);
        process.exit(1);
    }
}
