"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import styles from "../app/page.module.css";

type Props = {
  code: string;
  language: string;
  highlights: string;
  tone?: string;
  theme: string;
};

export default function CodePanel({
  code,
  language,
  highlights,
  tone,
  theme,
}: Props) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!code.trim()) return;
    const selected = new Set<number>();
    highlights.split(",").forEach((part) => {
      const [start, end] = part.trim().split("-").map(Number);
      if (start)
        for (let line = start; line <= (end || start); line++)
          selected.add(line);
    });
    codeToHtml(code, {
      lang: language as "tsx",
      theme: theme as "github-dark",
      transformers: [
        {
          line(node, line) {
            if (selected.has(line))
              node.properties.class = `${String(node.properties.class || "")} highlighted-line ${tone || ""}`;
          },
        },
      ],
    })
      .then((result) => {
        if (active) {
          setHtml(result);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setHtml("");
          setError(
            reason instanceof Error
              ? reason.message
              : "Syntax highlighting failed",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [code, language, highlights, tone, theme]);

  if (!code.trim())
    return (
      <pre className={styles.emptyCode}>
        Add a code snippet in the editor to preview it.
      </pre>
    );
  if (error) return <pre className={styles.codeError}>{error}</pre>;
  return (
    <div
      className={styles.syntax}
      dangerouslySetInnerHTML={{
        __html: html || "<pre>Highlighting code…</pre>",
      }}
    />
  );
}
