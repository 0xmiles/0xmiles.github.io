"use client";

import { ExtendedRecordMap } from "notion-types";
import { useEffect } from "react";
import { NotionRenderer as NotionRendererComponent } from "react-notion-x";

// Import the CSS for react-notion-x
import "react-notion-x/src/styles.css";
import "./notion.css";
import dynamic from "next/dynamic";
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
}

export const NotionRenderer = ({ recordMap }: NotionRendererProps) => {
  useEffect(() => {
    // Load Prism.js for code highlighting
    const loadPrism = async () => {
      if (typeof window !== "undefined") {
        try {
          const Prism = (await import("prismjs")).default;

          // Load common languages using dynamic imports
          const languages = [
            "prismjs/components/prism-javascript",
            "prismjs/components/prism-typescript",
            "prismjs/components/prism-python",
            "prismjs/components/prism-java",
            "prismjs/components/prism-css",
            "prismjs/components/prism-json",
            "prismjs/components/prism-bash",
            "prismjs/components/prism-sql",
          ];

          for (const lang of languages) {
            try {
              await import(lang);
            } catch (e) {
              // Language not found, continue
            }
          }

          // Highlight all code blocks
          Prism.highlightAll();
        } catch (error) {
          console.warn("Failed to load Prism.js:", error);
        }
      }
    };

    loadPrism();
  }, []);

  return (
    <NotionRendererComponent
      recordMap={recordMap}
      fullPage={false}
      darkMode={true}
      previewImages={true}
      showCollectionViewDropdown={false}
      showTableOfContents={true}
      minTableOfContentsItems={3}
      defaultPageIcon="📄"
      defaultPageCover=""
      defaultPageCoverPosition={0.5}
      className="notion-post"
      components={{
        Code,
      }}
    />
  );
};
