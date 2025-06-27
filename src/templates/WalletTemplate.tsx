"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { ComponentProps } from "../types";
import { WALLET_{{WALLET_NAME}} } from "../constants/imagePaths";

type Icon{{WALLET_NAME}}Props = ComponentProps;

export function Icon{{WALLET_NAME}}({ 
  className = "", 
  size = 24,
  width,
  height,
  alt = "{{WALLET_NAME}}" 
}: Icon{{WALLET_NAME}}Props) {
  const { theme, systemTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  
  const imageSrc = isDark 
    ? WALLET_{{WALLET_NAME}}.darkMode
    : WALLET_{{WALLET_NAME}}.lightMode;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={`transition-all duration-200 ${className}`}
      priority={false}
    />
  );
}
