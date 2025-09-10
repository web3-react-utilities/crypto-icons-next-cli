# Supported Wallets

This document lists all available crypto wallet icons that can be generated using the CLI.

## Available Wallets

Below is the complete list of all available wallet icons:

|          |         |         |          |          |               |
| :------- | :------ | :------ | :------- | :------- | :------------ |
| Bitget   | Bybit   | Keplr   | LazorKit | Leap     | Ledger        |
| MetaMask | Owallet | Phantom | Solflare | TronLink | WalletConnect |

> **Note**: No wallets currently have special light/dark mode variants.
> **Note**: All wallet icons support automatic light/dark mode switching based on your theme configuration.

## Using Wallet Icons in Your Code

After adding a wallet icon to your project, you can use it as follows:

```tsx
import { CryptoIcon, WalletName } from "./components/crypto-icons";

function WalletConnector() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <CryptoIcon name="MetaMask" size={24} />
                <span>MetaMask</span>
            </button>

            <button className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <CryptoIcon name={WalletName.TrustWallet} size={24} mode="dark" />
                <span>Trust Wallet</span>
            </button>
        </div>
    );
}
```

## Image Sources

All wallet icons are automatically loaded from Firebase Storage URLs:

-   **Light mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-wallet/o/[WALLET_NAME]-lightmode.png?alt=media`
-   **Dark mode**: `https://firebasestorage.googleapis.com/v0/b/crypto-images-wallet/o/[WALLET_NAME]-darkmode.png?alt=media`

For example, for MetaMask wallet:

-   Light mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-wallet/o/MetaMask-lightmode.png?alt=media`
-   Dark mode: `https://firebasestorage.googleapis.com/v0/b/crypto-images-wallet/o/MetaMask-darkmode.png?alt=media`
