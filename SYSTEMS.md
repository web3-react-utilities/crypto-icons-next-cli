# Supported Systems

This document lists all available blockchain/DeFi system icons that can be generated using the CLI.

## Available Systems

Below is the complete list of all available system icons:

|     |         |                |           |           |     |
| :-- | :------ | :------------- | :-------- | :-------- | :-- |
| BSC | Jito 🌗 | JustLendDAO 🌗 | Kamino 🌗 | Orchai 🌗 |     |

> **Note**: All system icons support automatic light/dark mode switching based on your theme configuration.

## Using System Icons in Your Code

After adding a system icon to your project, you can use it as follows:

```tsx
import { CryptoIcon, SystemName } from "./components/crypto-icons";

function NetworkSelector() {
    return (
        <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <CryptoIcon name="Ethereum" size={16} />
                <span>Ethereum</span>
            </button>

            <button className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <CryptoIcon name={SystemName.Polygon} size={16} mode="dark" />
                <span>Polygon</span>
            </button>
        </div>
    );
}
```

## Image Sources

All system icons are automatically loaded from Firebase Storage URLs:

-   **Light mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-system/o/[SYSTEM_NAME]-lightmode.png?alt=media`
-   **Dark mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-system/o/[SYSTEM_NAME]-darkmode.png?alt=media`

For example, for Ethereum system:

-   Light mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-system/o/Ethereum-lightmode.png?alt=media`
-   Dark mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-system/o/Ethereum-darkmode.png?alt=media`
