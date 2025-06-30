#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { removeCommand } from "./commands/remove";
import { configCommand } from "./commands/config";

const program = new Command();

program.name("crypto-next-icons").description("CLI tool for generating crypto icon components for Next.js projects").version("1.0.0");

program
    .command("config")
    .description("Configure default settings for the CLI")
    .option("-d, --dir <directory>", "Set default target directory")
    .option("-i, --image-path <path>", "Set default image base path")
    .option("-c, --dark-mode-class <class>", "Set CSS class for dark mode detection (default: dark)")
    .option("-r, --reset", "Reset configuration to defaults")
    .action(configCommand);

program
    .command("init")
    .description("Initialize crypto icons structure in your Next.js project")
    .option("-d, --dir <directory>", "Target directory (default: from config or ./src/components/crypto-icons)")
    .action(initCommand);

program
    .command("add")
    .description("Add crypto icon components")
    .option("-t, --token <tokens...>", "Add token icons")
    .option("-w, --wallet <wallets...>", "Add wallet icons")
    .option("-s, --system <systems...>", "Add system icons")
    .option("-d, --dir <directory>", "Target directory (default: from config or ./src/components/crypto-icons)")
    .action(addCommand);

program
    .command("remove")
    .description("Remove crypto icon components")
    .option("-t, --token <tokens...>", "Remove token icons")
    .option("-w, --wallet <wallets...>", "Remove wallet icons")
    .option("-s, --system <systems...>", "Remove system icons")
    .option("-d, --dir <directory>", "Target directory (default: from config or ./src/components/crypto-icons)")
    .action(removeCommand);

program.parse();
