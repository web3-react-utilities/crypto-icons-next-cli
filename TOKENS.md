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
import { IconBTC, IconETH } from "./components/ui/crypto-icons/tokens";

function Portfolio() {
    return (
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <IconBTC width={32} height={32} />
                <span>Bitcoin</span>
            </div>

            <div className="flex items-center gap-2">
                <IconETH width={32} height={32} className="rounded-full" />
                <span>Ethereum</span>
            </div>
        </div>
    );
}
```

## Image Requirements

Each token requires two image files in your `public/images/crypto/tokens/` directory:

-   `[TOKEN_NAME]-lightmode.png` - Light theme version
-   `[TOKEN_NAME]-darkmode.png` - Dark theme version

For example, for BTC token:

-   `public/images/crypto/tokens/BTC-lightmode.png`
-   `public/images/crypto/tokens/BTC-darkmode.png`
