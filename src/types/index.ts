export type AddCommandOptions = {
    token?: string[];
    wallet?: string[];
    system?: string[];
    dir?: string;
};

export type RemoveCommandOptions = {
    token?: string[];
    wallet?: string[];
    system?: string[];
    dir?: string;
};

export type InitCommandOptions = {
    dir?: string;
    framework?: "next" | "vite";
};

export type UpdateCommandOptions = {
    dir?: string;
};

export type IconUrls = {
    lightMode: string;
    darkMode: string;
};

export type ComponentProps = {
    className?: string;
    size?: number; // For square icons, applies to both width and height
    width?: number; // Specific width (overrides size)
    height?: number; // Specific height (overrides size)
    alt?: string;
};

// Token types
export enum TokenName {
    BTC = "BTC",
    ETH = "ETH",
    // Will be expanded with more tokens
}

// Wallet types
export enum WalletName {
    MetaMask = "MetaMask",
    TrustWallet = "TrustWallet",
    // Will be expanded with more wallets
}

// System types
export enum SystemName {
    Ethereum = "Ethereum",
    Polygon = "Polygon",
    // Will be expanded with more systems
}
