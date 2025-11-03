# Supported Tokens

This document lists all available crypto token icons that can be generated using the CLI.

## Available Tokens

Below is the complete list of all available token icons:

|           |          |          |          |          |          |
| :-------- | :------- | :------- | :------- | :------- | :------- |
| AAVE      | AELF     | AI16Z    | AIRI     | ALGO 🌗  | APT 🌗   |
| AR 🌗     | ARB      | ATI      | ATOM     | AVAX     | AXS      |
| Aimstrong | BASE     | BNB      | BONK     | BTC      | BTCB     |
| BTT 🌗    | BUSD 🌗  | COMP 🌗  | DAI      | DOGE     | EDU      |
| ETH       | FDUSD 🌗 | FIL      | FLOKI 🌗 | FLOW     | FLUX     |
| GALA      | GNO      | GNRT     | GRT      | HBAR 🌗  | HNT      |
| HOT 🌗    | HT       | HTX 🌗   | IMX      | INJ      | ION      |
| IOTX      | JASMY    | JITOSOL  | JST      | JUP      | KAS      |
| KCS       | KWT      | LEE      | LFG 🌗   | LTC      | MANA     |
| MAX       | METIS    | MILKY    | MINA     | MKR      | NEO      |
| NEXO      | NFT 🌗   | NTMPI    | OCH      | ORAI 🌗  | ORAIX 🌗 |
| OSMO      | PEPE     | PYTH     | RACKS    | RAY 🌗   | ROSE     |
| SHIB      | SNX      | SOL 🌗   | STRX     | STUSDT   | STX      |
| SUN       | SUNOLD   | TIA      | TON      | TRUMP 🌗 | TRX      |
| TUSD      | USD1     | USDAI 🌗 | USDC     | USDD     | USDJ     |
| USDT      | VET      | VIRTUAL  | WBTC     | WETH     | WIF      |
| WIN       | XLM 🌗   | XMR      | XRP 🌗   | ZEC 🌗   | ZRX 🌗   |
| aUSDT     | sORAI    | sSOL     | scATOM   | scINJ    | scORAI   |
| scOSMO    | stATOM   | stOSMO   | xOCH     |          |          |

> **Note**: The tokens marked with 🌗 have different images for light and dark mode.
> **Note**: The tokens marked with 🌗 have different images for light and dark mode.
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
