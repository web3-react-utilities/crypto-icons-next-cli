#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { removeCommand } from "./commands/remove";
import { configCommand } from "./commands/config";
import { updateCommand } from "./commands/update";
import * as packageJson from "../package.json";

const program = new Command();

program.name("crypto-next-icons").description("CLI tool for generating crypto icon components for Next.js projects").version(packageJson.version);

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
    .option("-f, --framework <framework>", "Target framework: next | vite (default: next)")
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

program
    .command("update")
    .description("Update image base URLs to Firebase Hosting without re-initializing")
    .option("-d, --dir <directory>", "Target directory (default: from config or ./src/components/crypto-icons)")
    .action(updateCommand);

program.parse();
