# Supported Wallets

This document lists all available crypto wallet icons that can be generated using the CLI.

## Available Wallets

Below is the complete list of all available wallet icons:

|          |             |          |         |       |               |
| :------- | :---------- | :------- | :------ | :---- | :------------ |
| MetaMask | TrustWallet | Coinbase | Binance | Keplr | WalletConnect |

> **Note**: All wallet icons support automatic light/dark mode switching based on your theme configuration.

## Using Wallet Icons in Your Code

After adding a wallet icon to your project, you can use it as follows:

```tsx
import { IconMetaMask, IconTrustWallet } from "./components/ui/crypto-icons/wallets";

function WalletConnector() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <IconMetaMask width={24} height={24} />
                <span>MetaMask</span>
            </button>

            <button className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <IconTrustWallet width={24} height={24} />
                <span>Trust Wallet</span>
            </button>
        </div>
    );
}
```

## Image Requirements

Each wallet requires two image files in your `public/images/crypto/wallets/` directory:

-   `[WALLET_NAME]-lightmode.png` - Light theme version
-   `[WALLET_NAME]-darkmode.png` - Dark theme version

For example, for MetaMask wallet:

-   `public/images/crypto/wallets/MetaMask-lightmode.png`
-   `public/images/crypto/wallets/MetaMask-darkmode.png`
