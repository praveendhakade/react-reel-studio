"use client";

import { Button, MenuItem, Select, TextField } from "@mui/material";
import type { ReelDraft, ReelLayout, ReelTemplate } from "../types/reel";
import styles from "../app/page.module.css";

type Props = {
  draft: ReelDraft;
  template: ReelTemplate;
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
  onTemplateChange: (template: ReelTemplate) => void;
  onChange: <K extends keyof ReelDraft>(key: K, value: ReelDraft[K]) => void;
  onExport: () => void;
  exporting: boolean;
};

export default function ReelEditor({
  draft,
  template,
  step,
  onStepChange,
  onTemplateChange,
  onChange,
  onExport,
  exporting,
}: Props) {
  const input = (
    label: string,
    key: keyof ReelDraft,
    placeholder: string,
    multiline = false,
  ) => (
    <label className={styles.field}>
      <span>{label}</span>
      <TextField
        size="small"
        value={draft[key] as string}
        placeholder={placeholder}
        onChange={(event) => onChange(key, event.target.value)}
        multiline={multiline}
        minRows={multiline ? 3 : undefined}
        fullWidth
      />
    </label>
  );
  const setLayout = (value: string) => onChange("layout", value as ReelLayout);

  return (
    <aside className={styles.editor}>
      <div className={styles.editorTitle}>
        <div>
          <span className={styles.eyebrow}>CONTENT BUILDER</span>
          <h1>Reel setup</h1>
        </div>
        <span className={styles.step}>
          {step} <i>/ 2</i>
        </span>
      </div>
      <div className={styles.templates}>
        <span>START WITH</span>
        <div>
          <button
            className={template === "wrong" ? styles.selectedTemplate : ""}
            onClick={() => onTemplateChange("wrong")}
          >
            Wrong vs right
          </button>
          <button
            className={template === "correct" ? styles.selectedTemplate : ""}
            onClick={() => onTemplateChange("correct")}
          >
            Single code
          </button>
          <button
            className={template === "cycle" ? styles.selectedTemplate : ""}
            onClick={() => onTemplateChange("cycle")}
          >
            Code + output
          </button>
        </div>
      </div>
      <div className={styles.stepTabs} aria-label="Reel setup steps">
        <button
          className={step === 1 ? styles.activeStep : ""}
          onClick={() => onStepChange(1)}
        >
          <b>1</b> Story details
        </button>
        <button
          className={step === 2 ? styles.activeStep : ""}
          onClick={() => onStepChange(2)}
        >
          <b>2</b> Code & design
        </button>
      </div>
      <div className={styles.scrollArea}>
        {step === 1 ? (
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <b>01</b>
              <h2>Story details</h2>
            </div>
            <div className={styles.twoCol}>
              {input("Reel number", "number", "e.g. 22")}
              {input("Category", "category", "e.g. React Hooks")}
            </div>
            {input("Title", "title", "What will viewers learn?")}
            {input("Subtitle", "subtitle", "A short supporting line", true)}
            <p className={styles.formHint}>
              These fields are optional. Add only the text you want on your
              reel.
            </p>
          </section>
        ) : (
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <b>02</b>
              <h2>Code & design</h2>
            </div>
            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Language</span>
                <Select
                  size="small"
                  value={draft.language}
                  onChange={(event) => onChange("language", event.target.value)}
                >
                  <MenuItem value="jsx">JavaScript JSX</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="typescript">TypeScript</MenuItem>
                  <MenuItem value="tsx">TypeScript JSX</MenuItem>
                </Select>
              </label>
              <label className={styles.field}>
                <span>Layout</span>
                <Select
                  size="small"
                  value={draft.layout}
                  onChange={(event) => setLayout(event.target.value)}
                >
                  <MenuItem value="single">Single code</MenuItem>
                  <MenuItem value="compare">Wrong vs right</MenuItem>
                  <MenuItem value="output">Code + output</MenuItem>
                </Select>
              </label>
            </div>
            <label className={styles.field}>
              <span>
                {draft.layout === "compare" ? "Wrong code" : "Code snippet"}
                <em>{draft.code.split("\n").length} lines</em>
              </span>
              <TextField
                className={styles.codeInput}
                value={draft.code}
                placeholder="Paste or type your source code"
                onChange={(event) => onChange("code", event.target.value)}
                multiline
                minRows={9}
                fullWidth
              />
            </label>
            <div className={styles.twoCol}>
              {input("Highlight lines", "highlights", "e.g. 2-4, 8")}
              <label className={styles.field}>
                <span>Syntax theme</span>
                <Select
                  size="small"
                  value={draft.theme}
                  onChange={(event) => onChange("theme", event.target.value)}
                >
                  <MenuItem value="github-dark">GitHub Dark</MenuItem>
                  <MenuItem value="nord">Nord</MenuItem>
                  <MenuItem value="dracula">Dracula</MenuItem>
                  <MenuItem value="vitesse-dark">Vitesse Dark</MenuItem>
                </Select>
              </label>
            </div>
            {draft.layout === "compare" && (
              <>
                <label className={styles.field}>
                  <span>Correct code</span>
                  <TextField
                    className={styles.codeInput}
                    value={draft.correctCode}
                    placeholder="Add the corrected version"
                    onChange={(event) =>
                      onChange("correctCode", event.target.value)
                    }
                    multiline
                    minRows={7}
                    fullWidth
                  />
                </label>
                {input(
                  "Correct code highlight lines",
                  "correctHighlights",
                  "e.g. 5",
                )}
                {input(
                  "Wrong code explanation",
                  "explanation",
                  "Explain what goes wrong",
                  true,
                )}
                {input(
                  "Correct code explanation",
                  "correctExplanation",
                  "Explain how the fix works",
                  true,
                )}
              </>
            )}
            {draft.layout === "single" &&
              input(
                "Explanation",
                "explanation",
                "Add a short explanation",
                true,
              )}
            {draft.layout === "output" &&
              input("Output", "output", "What should the code display?", true)}
          </section>
        )}
      </div>
      <div className={styles.editorBottom}>
        {step === 1 ? (
          <Button
            variant="contained"
            className={styles.exportButton}
            onClick={() => onStepChange(2)}
          >
            Continue to code <span aria-hidden="true">→</span>
          </Button>
        ) : (
          <>
            <Button
              className={styles.secondaryButton}
              onClick={() => onStepChange(1)}
            >
              ← Back
            </Button>
            <Button
              variant="contained"
              className={styles.exportButton}
              onClick={onExport}
              disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export reel ↓"}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}
