# Supported Systems

This document lists all available blockchain/DeFi system icons that can be generated using the CLI.

## Available Systems

Below is the complete list of all available system icons:

|          |         |     |           |        |        |
| :------- | :------ | :-- | :-------- | :----- | :----- |
| Ethereum | Polygon | BSC | Avalanche | Solana | Cosmos |

> **Note**: All system icons support automatic light/dark mode switching based on your theme configuration.

## Using System Icons in Your Code

After adding a system icon to your project, you can use it as follows:

```tsx
import { IconEthereum, IconPolygon } from "./components/ui/crypto-icons/systems";

function NetworkSelector() {
    return (
        <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <IconEthereum width={16} height={16} />
                <span>Ethereum</span>
            </button>

            <button className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <IconPolygon width={16} height={16} />
                <span>Polygon</span>
            </button>
        </div>
    );
}
```

## Image Requirements

Each system requires two image files in your `public/images/crypto/systems/` directory:

-   `[SYSTEM_NAME]-lightmode.png` - Light theme version
-   `[SYSTEM_NAME]-darkmode.png` - Dark theme version

For example, for Ethereum system:

-   `public/images/crypto/systems/Ethereum-lightmode.png`
-   `public/images/crypto/systems/Ethereum-darkmode.png`
