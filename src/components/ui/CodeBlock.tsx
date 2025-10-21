"use client";

import { FC, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  theme?: "light" | "dark" | "auto";
}

export const CodeBlock: FC<CodeBlockProps> = ({
  children,
  className = "",
  language = "text",
  theme = "auto",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof children === "string") {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    // 모든 코드 블록에 복사 버튼 추가
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      if (!block.querySelector(".copy-button")) {
        const copyButton = document.createElement("button");
        copyButton.className =
          "copy-button absolute top-2 right-2 p-1 rounded hover:bg-gray-700 transition-colors";

        copyButton.addEventListener("click", async () => {
          const code = block.querySelector("code")?.textContent || "";
          await navigator.clipboard.writeText(code);
          copyButton.innerHTML =
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
          setTimeout(() => {
            copyButton.innerHTML =
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
          }, 2000);
        });

        block.style.position = "relative";
        block.appendChild(copyButton);
      }
    });

    // 테마 적용
    const shikiElements = document.querySelectorAll(".shiki");
    shikiElements.forEach((element) => {
      if (theme === "dark") {
        element.classList.add("dark");
        element.classList.remove("light");
      } else if (theme === "light") {
        element.classList.add("light");
        element.classList.remove("dark");
      } else {
        // auto 모드에서는 시스템 테마에 따라 결정
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (isDark) {
          element.classList.add("dark");
          element.classList.remove("light");
        } else {
          element.classList.add("light");
          element.classList.remove("dark");
        }
      }
    });
  }, [copied, theme]);

  return <div className={`relative group ${className}`}>{children}</div>;
};
