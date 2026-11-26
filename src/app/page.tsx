"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { toPng } from "html-to-image";
import ReelEditor from "../components/ReelEditor";
import ReelPreview from "../components/ReelPreview";
import type { ExportSize } from "../components/ReelPreview";
import { createBlankDraft } from "../types/reel";
import type { ReelDraft, ReelTemplate } from "../types/reel";
import styles from "./page.module.css";

const initialDrafts: Record<ReelTemplate, ReelDraft> = {
  wrong: createBlankDraft("compare"),
  correct: createBlankDraft("single"),
  cycle: createBlankDraft("output"),
};

export default function Home() {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [template, setTemplate] = useState<ReelTemplate>("wrong");
  const [step, setStep] = useState<1 | 2>(1);
  const [size, setSize] = useState<ExportSize>("feed");
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const draft = drafts[template];

  const updateDraft = <K extends keyof ReelDraft>(
    key: K,
    value: ReelDraft[K],
  ) => {
    setDrafts((current) => ({
      ...current,
      [template]: { ...current[template], [key]: value },
    }));
  };

  const exportPng = async () => {
    const canvas = document.getElementById("export-canvas");
    if (!canvas) return;
    const dimensions =
      size === "feed"
        ? { width: 1080, height: 1350 }
        : { width: 1080, height: 1920 };
    setExporting(true);
    setMessage("");
    try {
      await document.fonts.ready;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const image = await toPng(canvas, {
        ...dimensions,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `react-day-${draft.number || "reel"}-${draft.layout}.png`;
      link.href = image;
      link.click();
      setMessage(`PNG exported at ${dimensions.width} × ${dimensions.height}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Export failed: ${error.message}`
          : "Export failed. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            R<span>•</span>
          </span>
          <div>
            <strong>React Reel Studio</strong>
            <small>CODE CONTENT, MADE BEAUTIFUL</small>
          </div>
        </div>
        <div className={styles.project}>
          <span className={styles.liveDot} /> Project{" "}
          <b>{draft.title || "Untitled reel"}</b>
          <span className={styles.saved}>Saved in this session</span>
        </div>
        <div className={styles.headerActions}>
          <Button
            className={styles.secondaryButton}
            onClick={() => setMessage("The preview updates as you edit.")}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            className={styles.exportButton}
            onClick={exportPng}
            disabled={exporting}
          >
            {exporting ? "Exporting…" : "↓ Export PNG"}
          </Button>
        </div>
      </header>
      <div className={styles.workspace}>
        <ReelEditor
          draft={draft}
          template={template}
          step={step}
          onStepChange={setStep}
          onTemplateChange={(next) => {
            setTemplate(next);
            setStep(1);
          }}
          onChange={updateDraft}
          onExport={exportPng}
          exporting={exporting}
        />
        <ReelPreview
          reel={draft}
          size={size}
          onSizeChange={setSize}
          message={message}
          onDismissMessage={() => setMessage("")}
        />
      </div>
    </main>
  );
}
