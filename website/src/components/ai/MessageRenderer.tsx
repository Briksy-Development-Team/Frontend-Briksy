/**
 * MessageRenderer.tsx — renders parsed Block[] → React nodes.
 * Uses design tokens from index.css @theme, never hex literals.
 * ponytail: no syntax highlighter (would need a dep); code blocks render mono with muted bg.
 */
import React, { useMemo } from "react";
import { parseBlocks, parseInline } from "./mdParser";
import type { Block, InlineToken, ListItem, Align } from "./mdParser";

// ─── Inline renderer ─────────────────────────────────────────────────────────

function renderInline(tokens: InlineToken[], keyPrefix: string): React.ReactNode[] {
  return tokens.map((t, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (t.kind) {
      case "text":
        return <React.Fragment key={key}>{t.value}</React.Fragment>;
      case "bold":
        return <strong key={key} className="font-semibold text-primary-brown">{renderInline(t.children, key)}</strong>;
      case "italic":
        return <em key={key} className="italic">{renderInline(t.children, key)}</em>;
      case "bolditalic":
        return <strong key={key} className="font-semibold italic">{renderInline(t.children, key)}</strong>;
      case "code":
        return (
          <code key={key} className="rounded-[4px] bg-white-100 px-[5px] py-[2px] font-mono text-[0.8em] text-primary-brown">
            {t.value}
          </code>
        );
      case "link":
        return (
          <a
            key={key}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light-brown underline underline-offset-2 hover:text-primary-brown transition-colors"
          >
            {renderInline(t.children, key)}
          </a>
        );
      default:
        return null;
    }
  });
}

// ─── Block renderers ─────────────────────────────────────────────────────────

function renderHeading(block: Extract<Block, { kind: "heading" }>, key: string) {
  const content = renderInline(block.inline, key);
  const cls = "font-medium text-primary-brown leading-snug";
  if (block.level === 1) return <h1 key={key} className={`text-[1.4rem] ${cls} mt-6 mb-2`}>{content}</h1>;
  if (block.level === 2) return <h2 key={key} className={`text-[1.2rem] ${cls} mt-5 mb-1.5`}>{content}</h2>;
  return <h3 key={key} className={`text-[1.05rem] ${cls} mt-4 mb-1`}>{content}</h3>;
}

function renderCodeFence(block: Extract<Block, { kind: "code_fence" }>, key: string) {
  return (
    <div key={key} className="my-4 overflow-hidden rounded-xl border border-white-100 bg-white-100/60">
      {block.lang && (
        <div className="border-b border-white-100 px-4 py-1.5 font-mono text-[0.72rem] text-primary-light-brown">
          {block.lang}
        </div>
      )}
      {/* ponytail: no syntax highlighting — upgrade path: add shiki-lite if added as dep */}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.82rem] leading-6 text-primary-brown whitespace-pre">
        {block.lines.join("\n")}
      </pre>
    </div>
  );
}

function renderBlockquote(block: Extract<Block, { kind: "blockquote" }>, key: string) {
  return (
    <blockquote key={key} className="my-3 border-l-2 border-primary-bleach pl-4 italic text-primary-light-brown">
      {renderBlocks(block.children, key)}
    </blockquote>
  );
}

function renderHr(_block: Block, key: string) {
  return <hr key={key} className="my-4 border-white-100" />;
}

function renderParagraph(block: Extract<Block, { kind: "paragraph" }>, key: string) {
  return (
    <p key={key} className="leading-7 text-primary-brown text-[0.95rem]">
      {renderInline(block.inline, key)}
    </p>
  );
}

function renderListItem(item: ListItem, keyPrefix: string, ordered: boolean, idx: number) {
  const key = `${keyPrefix}-li-${idx}`;
  const marker = ordered
    ? <span className="shrink-0 w-5 text-primary-light-brown select-none">{idx + 1}.</span>
    : <span className="shrink-0 mt-[0.3rem] h-1.5 w-1.5 rounded-full bg-primary-light-brown" />;

  const checkbox =
    item.checked !== null ? (
      <span
        className={`mr-1.5 mt-[0.25rem] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
          item.checked
            ? "border-primary-brown bg-primary-brown text-white"
            : "border-primary-light-brown"
        }`}
      >
        {item.checked && (
          <svg viewBox="0 0 12 10" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
            <polyline points="1,5 4.5,8.5 11,1" />
          </svg>
        )}
      </span>
    ) : null;

  return (
    <li key={key} className="flex items-start gap-2 text-[0.93rem] leading-7 text-primary-brown">
      {item.checked !== null ? checkbox : marker}
      <span className="flex-1 min-w-0">
        {renderInline(item.inline, key)}
        {item.children.length > 0 && (
          <div className="mt-1 ml-2">{renderBlocks(item.children, `${key}-sub`)}</div>
        )}
      </span>
    </li>
  );
}

function renderList(block: Extract<Block, { kind: "list" }>, key: string) {
  return (
    <ul key={key} className="my-2 flex flex-col gap-1 pl-1">
      {block.items.map((item, idx) => renderListItem(item, key, block.ordered, idx))}
    </ul>
  );
}

function renderTable(block: Extract<Block, { kind: "table" }>, key: string) {
  const alignClass = (a: Align) =>
    a === "center" ? "text-center" : a === "right" ? "text-right" : "text-left";

  return (
    <div key={key} className="my-4 overflow-x-auto rounded-xl border border-white-100">
      <table className="min-w-full border-collapse text-[0.88rem]">
        <thead>
          <tr className="bg-white-50">
            {block.head.map((cell, ci) => (
              <th
                key={ci}
                className={`border-b border-white-100 px-4 py-2.5 font-semibold text-primary-brown ${alignClass(block.align[ci] ?? null)}`}
              >
                {renderInline(cell, `${key}-th-${ci}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? "bg-white-50/60" : ""}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border-b border-white-100/60 px-4 py-2 text-primary-brown ${alignClass(block.align[ci] ?? null)}`}
                >
                  {renderInline(cell, `${key}-td-${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main block dispatcher ────────────────────────────────────────────────────

function renderBlocks(blocks: Block[], keyPrefix: string): React.ReactNode[] {
  return blocks.map((b, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (b.kind) {
      case "heading":    return renderHeading(b, key);
      case "code_fence": return renderCodeFence(b, key);
      case "blockquote": return renderBlockquote(b, key);
      case "hr":         return renderHr(b, key);
      case "paragraph":  return renderParagraph(b, key);
      case "list":       return renderList(b, key);
      case "table":      return renderTable(b, key);
      default:           return null;
    }
  });
}

// ─── Public component ─────────────────────────────────────────────────────────

type Props = {
  /** Raw Markdown string from the AI response */
  content: string;
  /** Set true while streaming — parser handles incomplete syntax gracefully */
  streaming?: boolean;
};

export default function MessageRenderer({ content }: Props) {
  // ponytail: memo keyed on content string — avoids re-parse on parent re-renders
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className="flex flex-col gap-3">
      {renderBlocks(blocks, "b")}
    </div>
  );
}

/** Parse a plain string to inline tokens for small use cases (e.g. titles). */
export { parseInline };
