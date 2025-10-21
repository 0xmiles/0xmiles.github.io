"use client";

import { useEffect } from "react";

export function CodeCopyScript() {
  useEffect(() => {
    // 코드 복사 기능 초기화
    const initializeCodeCopy = () => {
      const codeBlocks = document.querySelectorAll("pre");

      codeBlocks.forEach((block) => {
        // 이미 복사 버튼이 있으면 스킵
        if (block.querySelector(".copy-button")) return;

        const copyButton = document.createElement("button");

        copyButton.addEventListener("click", async () => {
          const code = block.querySelector("code")?.textContent || "";

          try {
            await navigator.clipboard.writeText(code);

            // 복사 성공 시 체크 아이콘으로 변경
            copyButton.innerHTML = `
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            `;

            // 2초 후 원래 아이콘으로 복원
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              `;
            }, 2000);
          } catch (err) {
            console.error("복사 실패:", err);
          }
        });

        // 코드 블록에 상대 위치 설정
        block.style.position = "relative";
        block.appendChild(copyButton);
      });
    };

    // DOM이 로드된 후 실행
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeCodeCopy);
    } else {
      initializeCodeCopy();
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      document.removeEventListener("DOMContentLoaded", initializeCodeCopy);
    };
  }, []);

  return null;
}
