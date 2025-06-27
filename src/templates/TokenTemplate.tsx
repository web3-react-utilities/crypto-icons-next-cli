"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { ComponentProps } from "../types";
import { TOKEN_{{TOKEN_NAME}} } from "../constants/imagePaths";

type Icon{{TOKEN_NAME}}Props = ComponentProps;

export function Icon{{TOKEN_NAME}}({ 
  className = "", 
  size = 24,
  width,
  height,
  alt = "{{TOKEN_NAME}}" 
}: Icon{{TOKEN_NAME}}Props) {
  const { theme, systemTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  
  const imageSrc = isDark 
    ? TOKEN_{{TOKEN_NAME}}.darkMode
    : TOKEN_{{TOKEN_NAME}}.lightMode;

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
