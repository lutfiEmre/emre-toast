"use client";

import React from "react";

type TokenType = "keyword" | "string" | "comment" | "method" | "number" | "plain";

const colors: Record<TokenType, string> = {
  keyword: "text-violet-400",
  string: "text-amber-400",
  comment: "text-slate-500",
  method: "text-cyan-400",
  number: "text-emerald-400",
  plain: "text-slate-300 dark:text-slate-400",
};

const patterns: { regex: RegExp; type: TokenType }[] = [
  { regex: /\b(import|from|export|const|let|var|function|return|if|else|for|while|switch|case|break|default|try|catch|throw|new|class|extends|async|await|typeof|instanceof|in|of)\b/g, type: "keyword" },
  { regex: /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, type: "string" },
  { regex: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, type: "comment" },
  { regex: /\b(emreToast|EmreToaster|useEmreToast|success|error|warning|info|loading|promise|stream|progress|undo|update|dismiss)\b/g, type: "method" },
  { regex: /\b\d+\b/g, type: "number" },
];

function tokenize(code: string): { text: string; type: TokenType }[] {
  const tokens: { start: number; end: number; type: TokenType }[] = [];

  for (const { regex, type } of patterns) {
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(code)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, type });
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number; type: TokenType }[] = [];
  for (const t of tokens) {
    const last = merged[merged.length - 1];
    if (last && t.start < last.end) continue;
    merged.push(t);
  }

  const result: { text: string; type: TokenType }[] = [];
  let pos = 0;
  for (const { start, end, type } of merged) {
    if (start > pos) {
      result.push({ text: code.slice(pos, start), type: "plain" });
    }
    result.push({ text: code.slice(start, end), type });
    pos = end;
  }
  if (pos < code.length) {
    result.push({ text: code.slice(pos), type: "plain" });
  }
  return result;
}

export function highlightCode(code: string): React.ReactNode {
  const tokens = tokenize(code);
  return tokens.map((token, i) => (
    <span key={i} className={colors[token.type]}>
      {token.text}
    </span>
  ));
}
