// 코드 블록 복사 기능
export function initializeCodeCopy() {
  if (typeof window === "undefined") return;

  // 모든 코드 블록에 복사 버튼 추가
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((block) => {
    // 이미 복사 버튼이 있으면 스킵
    if (block.querySelector(".copy-button")) return;

    const copyButton = document.createElement("button");

    copyButton.addEventListener("click", async () => {
      const code = block.querySelector("code")?.textContent || "";

      try {
        await navigator.clipboard.writeText(code);
      } catch (err) {
        console.error("복사 실패:", err);
      }
    });

    // 코드 블록에 상대 위치 설정
    block.style.position = "relative";
    block.appendChild(copyButton);
  });
}

// 페이지 로드 시 초기화
if (typeof window !== "undefined") {
  // DOM이 로드된 후 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCodeCopy);
  } else {
    initializeCodeCopy();
  }
}
