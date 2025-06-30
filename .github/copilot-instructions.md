<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Crypto Icon Next.js CLI

This is a CLI tool for generating crypto icon components specifically designed for Next.js projects using shadcn/ui, Tailwind CSS, and Next.js Image component.

## Architecture Overview (Updated)

### Universal Component Approach

-   **Single Component**: Uses one `CryptoIcon` component instead of generating individual components (IconBTC, IconETH, etc.)
-   **Dynamic Loading**: Icons are loaded dynamically by passing `name` prop
-   **Icon Map**: All icons are stored in a centralized `iconMap` object in `constants/imagePaths.ts`
-   **Fallback System**: Shows text or custom fallback when icon not found

### Type System

-   **TokenSymbol**: Changed from `TokenName` to `TokenSymbol` for better semantics
-   **Separated Enums**: Each enum type has its own file:
    -   `types/TokenSymbol.ts` - for token symbols
    -   `types/WalletName.ts` - for wallet names
    -   `types/SystemName.ts` - for system names
    -   `types/index.ts` - main export file

### Theme Detection

-   **CSS Class Method**: Uses CSS class detection instead of next-themes
-   **MutationObserver**: Monitors DOM changes for theme class updates
-   **Configurable**: Dark mode class is configurable (default: "dark")
-   **No Dependencies**: Removed dependency on next-themes package

## Development Guidelines for Copilot

### Core Principles

-   This project generates a **universal React component** for Next.js applications using TypeScript
-   Use Next.js `Image` component from `next/image` instead of standard HTML img tags
-   Components should be compatible with shadcn/ui component library and follow its patterns
-   Use **CSS class detection** for theme switching, not next-themes
-   The main component is `CryptoIcon` which accepts a `name` prop

### Universal Component System

-   **DO NOT** create individual component files (IconBTC.tsx, IconETH.tsx, etc.)
-   **DO** add icons to the `iconMap` object in `constants/imagePaths.ts`
-   **DO** use the format: `"iconName": { lightMode: "path", darkMode: "path" }`
-   Icons are loaded dynamically through the universal `CryptoIcon` component

### Type Management

-   Use `TokenSymbol` instead of `TokenName` for tokens
-   Create separate enum files for each category:
    -   `types/TokenSymbol.ts` for token symbols
    -   `types/WalletName.ts` for wallet names
    -   `types/SystemName.ts` for system names
-   When adding icons, update the corresponding enum file, not the main types file

### Theme Detection

-   Use CSS class detection with `MutationObserver`
-   Default dark mode class is "dark" but configurable via config
-   Component props include optional `darkModeClass` for custom theme class
-   Monitor both `document.documentElement` and `document.body` for class changes

### Configuration System

-   Config file: `.crypto-icons.json` in project root
-   Supported options:
    -   `defaultDirectory` - target directory for generated files
    -   `imageBasePath` - base path for images
    -   `darkModeClass` - CSS class for dark mode detection
-   CLI options: `--dir`, `--image-path`, `--dark-mode-class`

### File Structure

```
components/crypto-icons/
├── CryptoIcon.tsx          # Universal component
├── types/
│   ├── index.ts           # Main exports
│   ├── TokenSymbol.ts     # Token enum
│   ├── WalletName.ts      # Wallet enum
│   └── SystemName.ts      # System enum
├── constants/
│   └── imagePaths.ts      # Icon map object
├── utils/
│   └── theme.ts           # Theme utilities
└── index.ts               # Main exports
```

### CLI Commands Logic

-   `init`: Creates base structure with universal component
-   `add`: Adds entries to iconMap and updates corresponding enum files
-   `remove`: Removes entries from iconMap and enum files
-   `config`: Manages configuration including dark mode class

### Best Practices

-   Follow alphabetical sorting for iconMap entries
-   Use `type` declarations instead of `interface` when defining types
-   Ensure proper error handling and user-friendly logging
-   Support light/dark mode variants for all icons
-   Image paths follow pattern: `[NAME]-lightmode.png`, `[NAME]-darkmode.png`
-   Maintain proper imports and exports structure for tree-shaking
-   Always maintain consistency between documentation and source code

### Windows Git Bash Issues

-   Git Bash on Windows converts `/path` to Windows absolute paths
-   Document workarounds in README.md troubleshooting section
-   Provide manual config editing instructions for users

### Component Usage Example

```tsx
import { CryptoIcon, TokenSymbol } from "./components/crypto-icons";

// Dynamic string name
<CryptoIcon name="BTC" size={32} />

// With TypeScript enum
<CryptoIcon name={TokenSymbol.BTC} size={32} />

// Custom fallback
<CryptoIcon name="UNKNOWN" fallback={<span>❓</span>} />

// Custom dark mode class
<CryptoIcon name="ETH" darkModeClass="dark-theme" />
```
