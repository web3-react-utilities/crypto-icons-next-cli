import path from "path";

export function getTargetDirectory(dir?: string): string {
    return path.resolve(process.cwd(), dir || "./src/components/crypto-icons");
}

export function getImagePath(name: string, category: "tokens" | "wallets" | "systems", isDarkMode: boolean = false): string {
    const suffix = isDarkMode ? "-darkmode" : "-lightmode";
    return `/images/crypto/${category}/${name}${suffix}.png`;
}

export function getImagePaths(name: string, category: "tokens" | "wallets" | "systems") {
    return {
        lightMode: getImagePath(name, category, false),
        darkMode: getImagePath(name, category, true),
    };
}
