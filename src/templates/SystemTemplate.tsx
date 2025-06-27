"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { ComponentProps } from "../types";
import { SYSTEM_{{SYSTEM_NAME}} } from "../constants/imagePaths";

type Icon{{SYSTEM_NAME}}Props = ComponentProps;

export function Icon{{SYSTEM_NAME}}({ 
  className = "", 
  size = 24,
  width,
  height,
  alt = "{{SYSTEM_NAME}}" 
}: Icon{{SYSTEM_NAME}}Props) {
  const { theme, systemTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  
  const imageSrc = isDark 
    ? SYSTEM_{{SYSTEM_NAME}}.darkMode
    : SYSTEM_{{SYSTEM_NAME}}.lightMode;

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
