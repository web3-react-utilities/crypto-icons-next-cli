# Crypto Icon Next.js CLI

🚀 A CLI tool for generating crypto icon components specifically designed for Next.js projects using shadcn/ui, Tailwind All generated components accept these props:

```typescript
type ComponentProps = {
    className?: string; // Additional CSS classes
    size?: number; // For square icons (default: 24)
    width?: number; // Specific width (overrides size)
    height?: number; // Specific height (overrides size)
    alt?: string; // Alt text (default: icon name)
};
```

Examples:

````tsx
// Square icon with size
<IconBTC size={32} />

// Custom dimensions
<IconBTC width={40} height={30} />

// With styling
<IconBTC size={24} className="rounded-full border" />
```ext.js Image component.

## Features

-   ✨ **Next.js optimized** - Uses Next.js `Image` component for optimal performance
-   🌗 **Automatic theme switching** - Smart light/dark mode support with Tailwind CSS
-   🎨 **shadcn/ui compatible** - Follows shadcn/ui patterns and best practices
-   📦 **Three categories** - Support for tokens, wallets, and systems
-   🔧 **TypeScript first** - Full TypeScript support with proper type definitions
-   ⚡ **Tree-shakable** - Optimized exports for minimal bundle size

## Installation

No installation required! Use with npx:

```bash
npx crypto-icon-next-cli@latest init
````

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
import { IconBTC, IconETH } from "./components/ui/crypto-icons/tokens";
import { IconMetaMask } from "./components/ui/crypto-icons/wallets";

export function WalletBalance() {
    return (
        <div className="flex items-center gap-2">
            <IconBTC width={32} height={32} />
            <IconETH width={32} height={32} className="rounded-full" />
            <IconMetaMask width={24} height={24} />
        </div>
    );
}
```

## Commands

### `config`

Configure default settings for the CLI:

```bash
npx crypto-icon-next-cli@latest config

Options:
  -d, --dir <directory>      Set default target directory
  -i, --image-path <path>    Set default image base path
  -r, --reset               Reset configuration to defaults

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
├── tokens/
│   ├── IconBTC.tsx
│   ├── IconETH.tsx
│   └── index.ts
├── wallets/
│   ├── IconMetaMask.tsx
│   ├── IconTrustWallet.tsx
│   └── index.ts
├── systems/
│   ├── IconEthereum.tsx
│   ├── IconPolygon.tsx
│   └── index.ts
├── types/
│   └── index.ts
├── constants/
│   └── imagePaths.ts
├── utils/
│   └── theme.ts
└── index.ts
```

## Component API

All generated components accept these props:

```typescript
type ComponentProps = {
    className?: string; // Additional CSS classes
    width?: number; // Image width (default: 24)
    height?: number; // Image height (default: 24)
    alt?: string; // Alt text (default: icon name)
};
```

## Theme Support

Icons automatically switch between light and dark variants based on your theme configuration:

```tsx
// Light mode: /images/crypto/tokens/BTC-lightmode.png
// Dark mode: /images/crypto/tokens/BTC-darkmode.png
<IconBTC />
```

Make sure you have `next-themes` configured in your Next.js project for automatic theme switching.

## Image Organization

Place your crypto icon images in the following structure:

```
public/images/crypto/
├── tokens/
│   ├── BTC-lightmode.png
│   ├── BTC-darkmode.png
│   ├── ETH-lightmode.png
│   └── ETH-darkmode.png
├── wallets/
│   ├── MetaMask-lightmode.png
│   ├── MetaMask-darkmode.png
│   └── ...
└── systems/
    ├── Ethereum-lightmode.png
    ├── Ethereum-darkmode.png
    └── ...
```

## Requirements

-   Next.js 13+ (with app router support)
-   TypeScript
-   Tailwind CSS
-   next-themes (for automatic theme switching)

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
