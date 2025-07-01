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

### Theme Control

-   **Manual Mode Control**: Uses simple `mode` prop instead of automatic detection
-   **No Dependencies**: No next-themes or external theme detection libraries
-   **Simple API**: Component accepts `mode?: "light" | "dark"` prop (default: "light")
-   **Developer Control**: Theme switching is managed by the developer, not automatically detected

### Firebase Storage Integration

-   **Cloud-based Icons**: All icons are served from Firebase Storage URLs
-   **No Local Images**: No need for local public/images directory
-   **CDN Benefits**: Automatic CDN and caching through Firebase Storage
-   **URL Generation**: Dynamic URLs generated via helper functions:
    -   `baseImgUrlToken(name)` for token icons
    -   `baseImgUrlWallet(name)` for wallet icons
    -   `baseImgUrlSystem(name)` for system icons

### Icon Organization

-   **Categorized Sections**: Icons organized by type in iconMap
-   **Alphabetical Sorting**: Icons sorted alphabetically within each category
-   **Smart Insertion**: New icons inserted in correct alphabetical position
-   **Clean Structure**: Clear separation between tokens, wallets, and systems

## Development Guidelines for Copilot

### Core Principles

-   This project generates a **universal React component** for Next.js applications using TypeScript
-   Use Next.js `Image` component from `next/image` instead of standard HTML img tags
-   Components should be compatible with shadcn/ui component library and follow its patterns
-   Use **manual mode control** with `mode` prop, not automatic theme detection
-   The main component is `CryptoIcon` which accepts `name` and optional `mode` props
-   All icons are served from **Firebase Storage** URLs, not local files

### Universal Component System

-   **DO NOT** create individual component files (IconBTC.tsx, IconETH.tsx, etc.)
-   **DO** add icons to the `iconMap` object in `constants/imagePaths.ts`
-   **DO** use Firebase Storage URLs with helper functions: `baseImgUrlToken()`, `baseImgUrlWallet()`, `baseImgUrlSystem()`
-   **DO** organize icons by category and sort alphabetically within each section
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
    -   `imageBasePath` - base path for images (deprecated, now uses Firebase URLs)
-   CLI options: `--dir`, `--image-path` (legacy)
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
│   └── imagePaths.ts      # Icon map object with Firebase URLs
├── utils/
│   └── theme.ts           # Theme utilities
└── index.ts               # Main exports
```

### CLI Commands Logic

-   `init`: Creates base structure with universal component
-   `add`: Adds entries to iconMap and updates corresponding enum files with alphabetical sorting
-   `remove`: Removes entries from iconMap and enum files
-   `config`: Manages configuration (no longer includes dark mode class)

### Firebase Storage Integration

-   **Base URLs**: `https://firebasestorage.googleapis.com/v0/b/crypto-images`
-   **Token Storage**: `crypto-images-token` bucket
-   **Wallet Storage**: `crypto-images-wallet` bucket
-   **System Storage**: `crypto-images-system` bucket
-   **URL Pattern**: `{bucket}/o/{name}-{mode}.png?alt=media`

### Icon Map Organization

-   **Sectioned by Category**: Tokens, Wallets, Systems have separate sections
-   **Alphabetical Sorting**: Icons sorted A-Z within each category
-   **Smart Insertion**: New icons inserted in correct alphabetical position
-   **Clean Comments**: Section headers without examples to avoid conflicts

### Best Practices

-   Follow alphabetical sorting for iconMap entries within each category
-   Use `type` declarations instead of `interface` when defining types
-   Ensure proper error handling and user-friendly logging
-   Use Firebase Storage URLs for all icons
-   Icon names follow pattern: `[NAME]-lightmode`, `[NAME]-darkmode`
-   Maintain proper imports and exports structure for tree-shaking
-   Always maintain consistency between documentation and source code

### Component Usage Example

```tsx
import { CryptoIcon, TokenSymbol } from "./components/crypto-icons";

// Manual mode control
<CryptoIcon name="BTC" size={32} mode="light" />
<CryptoIcon name="BTC" size={32} mode="dark" />

// With TypeScript enum
<CryptoIcon name={TokenSymbol.BTC} size={32} />

// Custom fallback
<CryptoIcon name="UNKNOWN" fallback={<span>❓</span>} />
```

### Key Updates Implemented

1. **Manual Mode Control**: Removed automatic theme detection, now uses `mode?: "light" | "dark"` prop
2. **Firebase Storage Integration**: All icons served from Firebase Storage URLs instead of local files
3. **Organized Icon Map**: Icons categorized by type (tokens/wallets/systems) and alphabetically sorted
4. **Smart Add Logic**: Icons inserted in correct alphabetical position within their category section
5. **No Folder Generation**: Only creates necessary files, no tokens/wallets/systems folders
6. **Universal Component**: Single CryptoIcon component for all icon types

### Recent Fixes

-   Fixed duplicate icon detection logic to avoid false positives from comments
-   Implemented alphabetical sorting within categories when adding icons
-   Removed examples from iconMap comments to prevent conflicts
-   Added proper section organization in generated iconMap
