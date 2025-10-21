"use client";

import React from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

// 동적 컴포넌트 로딩
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
  className?: string;
}

export const NotionRendererComponent: React.FC<NotionRendererProps> = ({
  recordMap,
  className = "",
}) => {
  return (
    <div className={`notion-container ${className}`}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        previewImages={true}
        showCollectionViewDropdown={false}
        showTableOfContents={true}
        minTableOfContentsItems={3}
        defaultPageIcon="📄"
        defaultPageCover=""
        defaultPageCoverPosition={0.5}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
        }}
      />
    </div>
  );
};
