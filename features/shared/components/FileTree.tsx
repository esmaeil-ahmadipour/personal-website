"use client";

import { useState } from "react";

// Make the type more strict with literal types
export type FileNode = {
  name: string;
  type: "folder" | "file";
  children?: FileNode[];
  severity?: "critical" | "high" | "medium" | "low" | "none";
};

interface FileTreeProps {
  tree: FileNode[];
  level?: number;
}

// SVG Icons - High Contrast Colors
const FolderIcon = () => (
  <svg
    className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 7l6-3.5L15 7l6-3.5V17l-6 3.5L9 17l-6 3.5V7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 7l6 3.5L15 7l6 3.5"
    />
  </svg>
);

const FileIcon = () => (
  <svg
    className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 2v7h7"
    />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-90" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const SeverityDot = ({ severity }: { severity?: FileNode["severity"] }) => {
  const colors = {
    critical: "bg-rose-500 shadow-rose-500/30",
    high: "bg-amber-500 shadow-amber-500/30",
    medium: "bg-yellow-500 shadow-yellow-500/30",
    low: "bg-blue-400 shadow-blue-400/30",
    none: "bg-[var(--border-subtle)]",
  };
  return (
    <span
      className={`w-1.5 h-1.5 rounded-full ${colors[severity || "none"]} shadow-lg flex-shrink-0`}
    />
  );
};

function TreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const handleToggle = () => {
    if (isFolder) setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        onClick={handleToggle}
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer
          transition-colors duration-150
          hover:bg-[var(--bg-elevated)]
          ${isFolder ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isFolder && <ChevronIcon open={isOpen} />}
        {isFolder ? <FolderIcon /> : <FileIcon />}
        <span className="text-sm font-medium flex-1 truncate">{node.name}</span>
        {!isFolder && <SeverityDot severity={node.severity} />}
        {isFolder && hasChildren && (
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {node.children?.length}
          </span>
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div className="border-l border-[var(--border-subtle)] ml-3">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ tree }: FileTreeProps) {
  return (
    <div className="space-y-0.5">
      {tree.map((node, index) => (
        <TreeNode key={index} node={node} level={0} />
      ))}
    </div>
  );
}
