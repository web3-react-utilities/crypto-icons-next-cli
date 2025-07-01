# Crypto Icon Next.js CLI

🚀 A CLI tool for generating crypto icon components specifically designed for Next.js projects using shadcn/ui, Tailwind CSS, and Next.js Image component.

## Features

-   ✨ **Next.js optimized** - Uses Next.js `Image` component for optimal performance
-   🌗 **Automatic theme switching** - Smart light/dark mode support with Tailwind CSS
-   🎨 **shadcn/ui compatible** - Follows shadcn/ui patterns and best practices
-   📦 **Universal component** - One `CryptoIcon` component for all icons
-   🔧 **TypeScript first** - Full TypeScript support with proper type definitions
-   ⚡ **Tree-shakable** - Optimized exports for minimal bundle size

## Example Key

### Token Supported

|           |          |          |          |          |        |
| :-------- | :------- | :------- | :------- | :------- | :----- |
| AAVE      | AELF     | AI16Z    | AIRI     | ALGO 🌗  | APT 🌗 |
| AR 🌗     | ARB      | ATI      | ATOM     | AVAX     | AXS    |
| Aimstrong | BNB      | BONK     | BTC      | BTCB     | BTT 🌗 |
| BUSD 🌗   | COMP 🌗  | DAI      | DOGE     | EDU      | ETH    |
| FDUSD 🌗  | FIL      | FLOKI 🌗 | FLOW     | FLUX     | GALA   |
| GNO       | GNRT     | GRT      | HBAR 🌗  | HNT      | HOT 🌗 |
| HT        | HTX 🌗   | IMX      | INJ      | ION      | IOTX   |
| JASMY     | JITOSOL  | JST      | JUP      | KAS      | KCS    |
| KWT       | LEE      | LTC      | MANA     | MAX      | METIS  |
| MILKY     | MINA     | MKR      | NEO      | NEXO     | NFT 🌗 |
| NTMPI     | OCH      | ORAI 🌗  | ORAIX 🌗 | OSMO     | PEPE   |
| PYTH      | RACKS    | ROSE     | SHIB     | SNX      | SOL 🌗 |
| STRX      | STUSDT   | STX      | SUN      | SUNOLD   | TIA    |
| TON       | TRUMP 🌗 | TRX      | TUSD     | USDAI 🌗 | USDC   |
| USDD      | USDJ     | USDT     | VET      | VIRTUAL  | WBTC   |
| WETH      | WIF      | WIN      | XLM 🌗   | XMR      | XRP 🌗 |
| ZEC 🌗    | ZRX 🌗   | aUSDT    | sORAI    | sSOL     | scATOM |
| scINJ     | scORAI   | scOSMO   | stATOM   | stOSMO   | xOCH   |

### Wallet Supported

|         |         |          |          |               |          |
| :------ | :------ | :------- | :------- | :------------ | :------- |
| Bitget  | Bybit   | Keplr    | Leap     | Ledger        | MetaMask |
| Owallet | Phantom | Solflare | TronLink | WalletConnect |          |

### System Supported

|     |         |                |           |           |     |
| :-- | :------ | :------------- | :-------- | :-------- | :-- |
| BSC | Jito 🌗 | JustLendDAO 🌗 | Kamino 🌗 | Orchai 🌗 |     |

## Component Props

The `CryptoIcon` component accepts these props:

```typescript
type CryptoIconProps = {
    name: string; // Icon name (e.g., "BTC", "MetaMask", "Ethereum")
    mode?: "light" | "dark"; // Display mode (default: "light")
    className?: string; // Additional CSS classes
    size?: number; // For square icons (default: 24)
    width?: number; // Specific width (overrides size)
    height?: number; // Specific height (overrides size)
    alt?: string; // Alt text (default: icon name)
    fallback?: React.ReactNode; // Custom fallback when icon not found
};
```

Examples:

```tsx
// Basic usage (light mode by default)
<CryptoIcon name="BTC" size={32} />

// Dark mode
<CryptoIcon name="BTC" size={32} mode="dark" />

// With TypeScript enums
import { TokenSymbol, WalletName } from "./components/crypto-icons/types";
<CryptoIcon name={TokenSymbol.BTC} size={32} mode="dark" />
<CryptoIcon name={WalletName.MetaMask} size={24} />

// Custom dimensions
<CryptoIcon name="BTC" width={40} height={30} />

// With styling
<CryptoIcon name="BTC" size={24} className="rounded-full border" />

// With custom fallback
<CryptoIcon name="UNKNOWN" size={24} fallback={<span>❓</span>} />

// Dynamic mode switching based on your app's theme state
const [isDark, setIsDark] = useState(false);
<CryptoIcon name="ETH" size={32} mode={isDark ? "dark" : "light"} />
```

## Installation

No installation required! Use with npx:

```bash
npx crypto-icon-next-cli@latest init
```

## Quick Start

1. **Initialize** crypto icons in your Next.js project:

```bash
npx crypto-icon-next-cli@latest init
```

2. **Add some icons**:

```bash
npx crypto-icon-next-cli@latest add --token BTC ETH
npx crypto-icon-next-cli@latest add --wallet MetaMask TrustWallet
npx crypto-icon-next-cli@latest add --system Ethereum Polygon
```

3. **Use in your components**:

```tsx
import { CryptoIcon } from "./components/crypto-icons";

export function WalletBalance() {
    return (
        <div className="flex items-center gap-2">
            {/* Icons that exist in the map will display the image */}
            <CryptoIcon name="BTC" size={32} />
            <CryptoIcon name="ETH" size={32} mode="dark" className="rounded-full" />
            <CryptoIcon name="MetaMask" size={24} />

            {/* Icons that don't exist will show fallback text */}
            <CryptoIcon name="UNKNOWN" size={24} />

            {/* Custom fallback */}
            <CryptoIcon name="NOTFOUND" size={24} fallback={<div className="w-6 h-6 bg-gray-300 rounded">?</div>} />
        </div>
    );
}
```

**Universal Icon Component Benefits:**
✅ **One component for all icons** - No need for separate IconBTC, IconETH, etc.  
✅ **Dynamic icon loading** - Pass any icon name as a string  
✅ **Fallback support** - Shows text or custom component when icon not found  
✅ **Type-safe** - Full TypeScript support with intellisense  
✅ **No bundle bloat** - Only loads the icons you actually use

## Commands

### `config`

Configure default settings for the CLI:

```bash
npx crypto-icon-next-cli@latest config

Options:
  -d, --dir <directory>           Set default target directory
  -i, --image-path <path>         Set default image base path
  -r, --reset                     Reset configuration to defaults

Examples:
  npx crypto-icon-next-cli@latest config
  npx crypto-icon-next-cli@latest config --dir ./components/icons
  npx crypto-icon-next-cli@latest config --image-path /assets/crypto
  npx crypto-icon-next-cli@latest config --reset
```

### `init`

Initialize the crypto icons structure in your project:

```bash
npx crypto-icon-next-cli@latest init [options]

Options:
  -d, --dir <directory>  Target directory (default: from config or ./src/components/crypto-icons)
```

### `add`

Add crypto icon components:

```bash
npx crypto-icon-next-cli@latest add [options]

Options:
  -t, --token <tokens...>    Add token icons (e.g., BTC ETH SOL)
  -w, --wallet <wallets...>  Add wallet icons (e.g., MetaMask TrustWallet)
  -s, --system <systems...>  Add system icons (e.g., Ethereum Polygon)
  -d, --dir <directory>      Target directory (default: from config or ./src/components/crypto-icons)

Examples:
  npx crypto-icon-next-cli@latest add --token BTC ETH SOL
  npx crypto-icon-next-cli@latest add --wallet MetaMask TrustWallet Coinbase
  npx crypto-icon-next-cli@latest add --system Ethereum Polygon BSC
```

### `remove`

Remove crypto icon components:

```bash
npx crypto-icon-next-cli@latest remove [options]

Options:
  -t, --token <tokens...>    Remove token icons
  -w, --wallet <wallets...>  Remove wallet icons
  -s, --system <systems...>  Remove system icons
  -d, --dir <directory>      Target directory (default: from config or ./src/components/crypto-icons)

Examples:
  npx crypto-icon-next-cli@latest remove --token BTC
  npx crypto-icon-next-cli@latest remove --wallet MetaMask
```

## Project Structure

After initialization, your project will have this structure:

```
src/components/crypto-icons/
├── CryptoIcon.tsx          # Universal icon component
├── types/
│   ├── index.ts           # Main type exports
│   ├── TokenSymbol.ts     # Token symbols enum
│   ├── WalletName.ts      # Wallet names enum
│   └── SystemName.ts      # System names enum
├── constants/
│   └── imagePaths.ts      # Central icon map
├── utils/
│   └── theme.ts           # Theme detection utilities
└── index.ts               # Main exports
```

## Universal Component Architecture

Instead of generating individual component files for each icon, this CLI uses a universal component approach:

```tsx
// ❌ Old approach (individual components)
import { IconBTC, IconETH, IconMetaMask } from "./crypto-icons/tokens";

// ✅ New approach (universal component)
import { CryptoIcon, TokenSymbol, WalletName } from "./crypto-icons";

function Portfolio() {
    return (
        <div>
            <CryptoIcon name="BTC" size={32} />
            <CryptoIcon name={TokenSymbol.ETH} size={32} mode="dark" />
            <CryptoIcon name={WalletName.MetaMask} size={24} />
        </div>
    );
}
```

## Icon Sources

All icons are automatically loaded from Firebase Storage:

```typescript
// constants/imagePaths.ts
export const iconMap: Record<string, ImagePaths> = {
    BTC: {
        lightMode: baseImgUrlToken("BTC-lightmode"),
        darkMode: baseImgUrlToken("BTC-darkmode"),
    },
    MetaMask: {
        lightMode: baseImgUrlWallet("MetaMask-lightmode"),
        darkMode: baseImgUrlWallet("MetaMask-darkmode"),
    },
    Ethereum: {
        lightMode: baseImgUrlSystem("Ethereum-lightmode"),
        darkMode: baseImgUrlSystem("Ethereum-darkmode"),
    },
    // ... more icons
};
```

### Firebase Storage URLs

-   **Tokens**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-token/o/[TOKEN_NAME]-[mode].png?alt=media`
-   **Wallets**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-wallet/o/[WALLET_NAME]-[mode].png?alt=media`
-   **Systems**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-system/o/[SYSTEM_NAME]-[mode].png?alt=media`

## Manual Theme Control

Icons support both light and dark variants. You control the display mode manually:

```tsx
// Light mode (default)
<CryptoIcon name="BTC" size={32} />

// Dark mode
<CryptoIcon name="BTC" size={32} mode="dark" />

// Dynamic mode based on your app's theme state
const [isDark, setIsDark] = useState(false);
<CryptoIcon name="BTC" size={32} mode={isDark ? "dark" : "light"} />

// With next-themes or other theme libraries
import { useTheme } from "next-themes";

function MyComponent() {
    const { theme } = useTheme();
    return (
        <CryptoIcon
            name="BTC"
            size={32}
            mode={theme === "dark" ? "dark" : "light"}
        />
    );
}
```

## Requirements

-   Next.js 13+ (with app router support)
-   TypeScript
-   Tailwind CSS
-   **No local images required** - Icons served from Firebase Storage

## Troubleshooting

### Windows Git Bash Path Issues

If you're using Git Bash on Windows and encounter issues with image paths being converted to Windows paths (e.g., `C:/Program Files/Git/assets/crypto`), you can:

1. **Use quotes around the path:**

    ```bash
    npx crypto-icon-next-cli@latest config --image-path "/images/crypto"
    ```

2. **Manually edit the config file:**

    ```bash
    # Edit .crypto-icons.json directly
    {
      "defaultDirectory": "./src/components/icons",
      "imageBasePath": "/images/crypto"
    }
    ```

3. **Use double slashes to escape:**
    ```bash
    npx crypto-icon-next-cli@latest config --image-path "//images/crypto"
    ```

### Configuration File

The CLI stores configuration in `.crypto-icons.json` in your project root. You can edit this file directly if needed:

```json
{
    "defaultDirectory": "./src/components/crypto-icons",
    "imageBasePath": "/images/crypto"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
