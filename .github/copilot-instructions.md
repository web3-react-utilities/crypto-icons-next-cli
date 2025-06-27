<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Crypto Icon Next.js CLI

This is a CLI tool for generating crypto icon components specifically designed for Next.js projects using shadcn/ui, Tailwind CSS, and Next.js Image component.

## Development Guidelines for Copilot

-   This project generates React components for Next.js applications using TypeScript
-   All components should use Next.js `Image` component from `next/image` instead of standard HTML img tags
-   Components should be compatible with shadcn/ui component library and follow its patterns
-   Use Tailwind CSS classes for styling and theme switching (light/dark mode)
-   Maintain placeholder format like `{{TOKEN_NAME}}`, `{{WALLET_NAME}}`, `{{SYSTEM_NAME}}` in templates as they will be replaced by the CLI
-   Follow alphabetical sorting for all enums and lists in types/index.ts
-   Use `type` declarations instead of `interface` when defining types
-   When working with utility files in `utils/`, ensure proper error handling and user-friendly logging
-   The CLI should support three categories: tokens, wallets, and systems
-   Each category should have its own template and support light/dark mode variants
-   Special icons (those with light/dark variants) should be marked with 🌗 emoji in documentation
-   Always maintain consistency between documentation files and source code
-   Use proper Next.js and React patterns for component architecture
-   Ensure all generated components are TypeScript compliant
-   Support automatic theme switching using Tailwind CSS dark mode classes
-   Image paths should follow the pattern: `[NAME].png`, `[NAME]-lightmode.png`, `[NAME]-darkmode.png`
-   Generated components should accept standard React props and be fully customizable
-   Maintain proper imports and exports structure for easy tree-shaking
-   Follow Next.js best practices for image optimization and loading
