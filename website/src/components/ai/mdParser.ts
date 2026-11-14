/**
 * mdParser.ts — lightweight 2-stage Markdown → token tree.
 * Stage 1: line-by-line state machine → Block[]
 * Stage 2: inline scanner → InlineToken[]
 *
 * Security: never touches dangerouslySetInnerHTML.
 * Links: only http/https protocols allowed.
 * ponytail: covers common AI response syntax; no HTML passthrough, no footnotes, no raw HTML blocks.
 */

// ─── Inline tokens ───────────────────────────────────────────────────────────

export type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "bold"; children: InlineToken[] }
  | { kind: "italic"; children: InlineToken[] }
  | { kind: "bolditalic"; children: InlineToken[] }
  | { kind: "code"; value: string }
  | { kind: "link"; href: string; children: InlineToken[] };

/** Validate link protocol — only http/https. */
function safeHref(raw: string): string | null {
  try {
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    // relative path without protocol
    if (/^[a-zA-Z0-9/_-]/.test(raw)) return raw;
  }
  return null; // reject javascript:, data:, etc.
}

/** Stage 2: scan inline string → InlineToken[]. Non-recursive depth guard. */
export function parseInline(src: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let i = 0;

  while (i < src.length) {
    // ── inline code ─────────────────────────────────────────────────────────
    if (src[i] === "`") {
      const end = src.indexOf("`", i + 1);
      if (end !== -1) {
        tokens.push({ kind: "code", value: src.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // ── bold+italic ***text*** ───────────────────────────────────────────────
    if (src.slice(i, i + 3) === "***") {
      const end = src.indexOf("***", i + 3);
      if (end !== -1) {
        tokens.push({ kind: "bolditalic", children: parseInline(src.slice(i + 3, end)) });
        i = end + 3;
        continue;
      }
    }

    // ── bold **text** ────────────────────────────────────────────────────────
    if (src.slice(i, i + 2) === "**") {
      const end = src.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ kind: "bold", children: parseInline(src.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }

    // ── italic *text* (not **) ───────────────────────────────────────────────
    if (src[i] === "*" && src[i + 1] !== "*") {
      const end = src.indexOf("*", i + 1);
      if (end !== -1 && src[end + 1] !== "*") {
        tokens.push({ kind: "italic", children: parseInline(src.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }

    // ── [link](url) ──────────────────────────────────────────────────────────
    if (src[i] === "[") {
      const closeBracket = src.indexOf("]", i + 1);
      if (closeBracket !== -1 && src[closeBracket + 1] === "(") {
        const closeParen = src.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          const href = safeHref(src.slice(closeBracket + 2, closeParen));
          if (href) {
            tokens.push({
              kind: "link",
              href,
              children: parseInline(src.slice(i + 1, closeBracket)),
            });
            i = closeParen + 1;
            continue;
          }
        }
      }
    }

    // ── plain text: accumulate until next special char ───────────────────────
    let j = i + 1;
    while (j < src.length && !"*`[".includes(src[j])) j++;
    const last = tokens[tokens.length - 1];
    if (last?.kind === "text") {
      last.value += src.slice(i, j); // merge adjacent text
    } else {
      tokens.push({ kind: "text", value: src.slice(i, j) });
    }
    i = j;
  }

  return tokens;
}

// ─── Block types ─────────────────────────────────────────────────────────────

export type Block =
  | { kind: "heading"; level: 1 | 2 | 3; inline: InlineToken[] }
  | { kind: "paragraph"; inline: InlineToken[] }
  | { kind: "hr" }
  | { kind: "code_fence"; lang: string; lines: string[] }
  | { kind: "blockquote"; children: Block[] }
  | { kind: "list"; ordered: boolean; items: ListItem[] }
  | { kind: "table"; align: Align[]; head: InlineToken[][]; rows: InlineToken[][][] };

export type Align = "left" | "center" | "right" | null;

export interface ListItem {
  inline: InlineToken[];
  checked: boolean | null; // null = not a task item
  children: Block[];       // nested sub-list
  depth: number;
}

// ─── Stage 1: block state machine ────────────────────────────────────────────

/** Parse Markdown string → Block[]. Handles incomplete/streaming input gracefully. */
export function parseBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trimStart();

    // ── blank line ───────────────────────────────────────────────────────────
    if (trimmed === "") { i++; continue; }

    // ── fenced code block ```lang ────────────────────────────────────────────
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      blocks.push({ kind: "code_fence", lang, lines: codeLines });
      continue;
    }

    // ── heading # ## ### ────────────────────────────────────────────────────
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        kind: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        inline: parseInline(headingMatch[2]),
      });
      i++;
      continue;
    }

    // ── horizontal rule --- or *** or ___ ────────────────────────────────────
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(trimmed)) {
      blocks.push({ kind: "hr" });
      i++;
      continue;
    }

    // ── blockquote > ────────────────────────────────────────────────────────
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("> ")) {
        quoteLines.push(lines[i].trimStart().slice(2));
        i++;
      }
      blocks.push({ kind: "blockquote", children: parseBlocks(quoteLines.join("\n")) });
      continue;
    }

    // ── table: line contains | and next line is alignment row ───────────────
    if (trimmed.includes("|")) {
      const lookahead = lines[i + 1]?.trimStart() ?? "";
      const isAlignRow = /^[|:\- ]+$/.test(lookahead) && lookahead.includes("-");
      if (isAlignRow) {
        const parseRow = (line: string) =>
          line.split("|").slice(1, -1).map((c) => parseInline(c.trim()));

        const head = parseRow(trimmed);
        const alignRow = lines[i + 1].split("|").slice(1, -1).map((c) => {
          const t = c.trim();
          if (t.startsWith(":") && t.endsWith(":")) return "center" as Align;
          if (t.endsWith(":")) return "right" as Align;
          if (t.startsWith(":")) return "left" as Align;
          return null as Align;
        });
        i += 2;
        const rows: InlineToken[][][] = [];
        while (i < lines.length && lines[i].trimStart().includes("|")) {
          rows.push(parseRow(lines[i].trimStart()));
          i++;
        }
        blocks.push({ kind: "table", align: alignRow, head, rows });
        continue;
      }
    }

    // ── list: unordered (- * +) or ordered (1.) ──────────────────────────────
    const isUnordered = /^[-*+]\s/.test(trimmed);
    const isOrdered = /^\d+\.\s/.test(trimmed);
    if (isUnordered || isOrdered) {
      const items = collectListItems(lines, i);
      i += countListLines(lines, i);
      blocks.push({ kind: "list", ordered: isOrdered, items });
      continue;
    }

    // ── paragraph: accumulate until blank / heading / fence ─────────────────
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trimStart() !== "" &&
      !lines[i].trimStart().startsWith("```") &&
      !lines[i].trimStart().match(/^#{1,3}\s/) &&
      !lines[i].trimStart().startsWith("> ")
    ) {
      paraLines.push(lines[i].trimStart());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ kind: "paragraph", inline: parseInline(paraLines.join(" ")) });
    }
  }

  return blocks;
}

// ─── List helpers ─────────────────────────────────────────────────────────────

function getListDepth(line: string): number {
  return Math.floor((line.length - line.trimStart().length) / 2);
}

function parseListItemText(trimmed: string): { text: string; checked: boolean | null } {
  // Task list: - [x] or - [ ]
  const task = trimmed.match(/^[-*+\d.]+\s+\[(x| )\]\s+(.*)/i);
  if (task) return { text: task[2], checked: task[1].toLowerCase() === "x" };
  // Normal
  const text = trimmed.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "");
  return { text, checked: null };
}

function collectListItems(lines: string[], start: number): ListItem[] {
  const items: ListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trimStart();
    const isItem = /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
    if (!isItem && trimmed !== "") break;
    if (trimmed === "") { i++; continue; }

    const depth = getListDepth(raw);
    const { text, checked } = parseListItemText(trimmed);
    const item: ListItem = { inline: parseInline(text), checked, children: [], depth };

    // look ahead for nested items
    const subLines: string[] = [];
    let j = i + 1;
    while (j < lines.length) {
      const nextRaw = lines[j];
      const nextTrimmed = nextRaw.trimStart();
      const nextDepth = getListDepth(nextRaw);
      const nextIsItem = /^[-*+]\s/.test(nextTrimmed) || /^\d+\.\s/.test(nextTrimmed);
      if (nextDepth > depth && (nextIsItem || nextTrimmed === "")) {
        subLines.push(nextRaw);
        j++;
      } else {
        break;
      }
    }

    if (subLines.length > 0) {
      const stripped = subLines.map((l) => l.slice(2)); // dedent 2 spaces
      item.children = [{ kind: "list", ordered: false, items: collectListItems(stripped, 0) }];
    }

    items.push(item);
    i = j;
  }

  return items;
}

function countListLines(lines: string[], start: number): number {
  let count = 0;
  let i = start;
  while (i < lines.length) {
    const trimmed = lines[i].trimStart();
    const isItem = /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
    if (!isItem && trimmed !== "") break;
    count++;
    i++;
  }
  return count;
}
