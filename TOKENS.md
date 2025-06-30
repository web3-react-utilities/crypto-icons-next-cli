# Supported Tokens

This document lists all available crypto token icons that can be generated using the CLI.

## Available Tokens

Below is the complete list of all available token icons:

|     |     |     |     |     |      |
| :-- | :-- | :-- | :-- | :-- | :--- |
| BTC | ETH | SOL | ADA | DOT | LINK |

> **Note**: All token icons support automatic light/dark mode switching based on your theme configuration.

## Using Token Icons in Your Code

After adding a token icon to your project, you can use it as follows:

```tsx
import { CryptoIcon, TokenSymbol } from "./components/crypto-icons";

function Portfolio() {
    return (
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <CryptoIcon name="BTC" size={32} />
                <span>Bitcoin</span>
            </div>

            <div className="flex items-center gap-2">
                <CryptoIcon name={TokenSymbol.ETH} size={32} mode="dark" className="rounded-full" />
                <span>Ethereum</span>
            </div>
        </div>
    );
}
```

## Image Sources

All token icons are automatically loaded from Firebase Storage URLs:

-   **Light mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-token/o/[TOKEN_NAME]-lightmode.png?alt=media`
-   **Dark mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-token/o/[TOKEN_NAME]-darkmode.png?alt=media`

For example, for BTC token:

-   Light mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-token/o/BTC-lightmode.png?alt=media`
-   Dark mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-token/o/BTC-darkmode.png?alt=media`
