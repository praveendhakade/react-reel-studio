"use client";

import { useEffect, useRef, useState } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { toPng } from "html-to-image";
import { codeToHtml } from "shiki";
import styles from "./page.module.css";

type Layout = "single" | "compare" | "output";
type Reel = { number: string; title: string; subtitle: string; category: string; language: string; code: string; explanation: string; highlights: string; theme: string; layout: Layout; correctCode: string; correctExplanation: string; output: string };
const wrong = `import { useEffect, useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    setCount(count + 1);\n  });\n\n  return <h2>{count}</h2>;\n}`;
const right = `import { useEffect, useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    setCount(1);\n  }, []);\n\n  return <h2>{count}</h2>;\n}`;
const defaults: Reel = { number: "22", title: "Why does useEffect run repeatedly?", subtitle: "A missing dependency array can trigger an effect after every render.", category: "React Hooks", language: "tsx", code: wrong, explanation: "No dependency array means this effect runs after every commit. Updating state causes another render, which runs the effect again.", highlights: "6-8", theme: "github-dark", layout: "compare", correctCode: right, correctExplanation: "An empty dependency array means the effect runs after the initial commit. React Strict Mode may perform an additional setup cycle in development.", output: "Render → effect → state update → render" };

function CodePanel({ code, language, highlights, tone, theme }: { code: string; language: string; highlights: string; tone?: string; theme: string }) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (!code.trim()) return;
    const selected = new Set<number>();
    highlights.split(",").forEach((part) => { const [a, b] = part.trim().split("-").map(Number); if (a) for (let i = a; i <= (b || a); i++) selected.add(i); });
    codeToHtml(code, { lang: language as "tsx", theme: theme as "github-dark", transformers: [{ line(node, line) { if (selected.has(line)) node.properties.class = `${String(node.properties.class || "")} highlighted-line ${tone || ""}`; } }] })
      .then((result) => { if (active) { setHtml(result); setError(""); } })
      .catch((err: unknown) => { if (active) { setHtml(""); setError(err instanceof Error ? err.message : "Syntax highlighting failed"); } });
    return () => { active = false; };
  }, [code, language, highlights, tone, theme]);
  if (error) return <pre className={styles.codeError}>{error}</pre>;
  if (!code.trim()) return <pre className={styles.emptyCode}>Add code to see a preview</pre>;
  return <div className={styles.syntax} dangerouslySetInnerHTML={{ __html: html || "<pre>Highlighting code…</pre>" }} />;
}

function ExportCanvas({ reel, dimensions }: { reel: Reel; dimensions: "feed" | "story" }) {
  const language = reel.language;
  const codeBlock = (code: string, lines: string, tone?: string) => <CodePanel code={code} language={language} highlights={lines} tone={tone} theme={reel.theme} />;
  return <article id="export-canvas" className={`${styles.canvas} ${dimensions === "story" ? styles.story : styles.feed}`}>
    <div className={styles.canvasGlow} />
    <header className={styles.canvasHead}><span className={styles.canvasMark}>R<span>•</span></span><span>REACT REEL STUDIO</span><span className={styles.day}>DAY {reel.number}</span></header>
    <div className={styles.canvasContent}>
      <div className={styles.category}><i />{reel.category.toUpperCase()}</div>
      <h1>{reel.title}</h1><p className={styles.canvasSubtitle}>{reel.subtitle}</p>
      {reel.layout === "compare" ? <div className={styles.compareGrid}><section className={`${styles.canvasCode} ${styles.wrongCard}`}><div className={styles.codeLabel}><b>×</b> WRONG</div>{codeBlock(reel.code, reel.highlights, "tone-red")}<p>{reel.explanation}</p></section><section className={`${styles.canvasCode} ${styles.rightCard}`}><div className={styles.codeLabel}><b>✓</b> RIGHT</div>{codeBlock(reel.correctCode, "8", "tone-green")}<p>{reel.correctExplanation}</p></section></div> : reel.layout === "output" ? <div className={styles.outputGrid}><section className={styles.canvasCode}><div className={styles.codeLabel}>SOURCE CODE</div>{codeBlock(reel.code, reel.highlights)}</section><section className={styles.outputPanel}><div className={styles.outputBar}><i/><i/><i/> CONSOLE</div><p>{reel.output}</p></section></div> : <section className={styles.canvasCode}><div className={styles.codeLabel}>SOURCE CODE</div>{codeBlock(reel.code, reel.highlights)}<p>{reel.explanation}</p></section>}
      {reel.layout === "compare" && <div className={styles.cycle}>RENDER <b>→</b> EFFECT <b>→</b> STATE UPDATE <b>→</b> RENDER</div>}
    </div>
    <footer className={styles.canvasFoot}><span>AI DEV <b>·</b> INTERVIEW HUB</span><span>SWIPE TO LEARN <b>↗</b></span></footer>
  </article>;
}

export default function Home() {
  const [reel, setReel] = useState<Reel>(defaults);
  const [dimensions, setDimensions] = useState<"feed" | "story">("feed");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<"wrong" | "correct" | "cycle">("wrong");
  const [zoom, setZoom] = useState(0.36);
  const previewRef = useRef<HTMLDivElement>(null);
  const update = <K extends keyof Reel>(key: K, value: Reel[K]) => setReel((current) => ({ ...current, [key]: value }));
  const selectTemplate = (next: "wrong" | "correct" | "cycle") => {
    setTemplate(next);
    if (next === "wrong") setReel((current) => ({ ...current, layout: "compare", code: wrong, highlights: "6-8" }));
    if (next === "correct") setReel((current) => ({ ...current, layout: "single", code: right, highlights: "8", explanation: defaults.correctExplanation }));
    if (next === "cycle") setReel((current) => ({ ...current, layout: "output", code: wrong, highlights: "6-8", output: defaults.output }));
  };
  const canvasSize = dimensions === "feed" ? { width: 1080, height: 1350 } : { width: 1080, height: 1920 };
  useEffect(() => { const updateZoom = () => { if (previewRef.current) setZoom(Math.min(0.52, (previewRef.current.clientWidth - 48) / 1080)); }; updateZoom(); window.addEventListener("resize", updateZoom); return () => window.removeEventListener("resize", updateZoom); }, []);
  const input = (label: string, key: keyof Reel, multiline = false) => <label className={styles.field}><span>{label}</span><TextField size="small" value={reel[key] as string} onChange={(event) => update(key, event.target.value)} multiline={multiline} minRows={multiline ? 3 : undefined} fullWidth /></label>;
  const exportPng = async () => {
    const node = document.getElementById("export-canvas"); if (!node) return;
    setBusy(true); setMessage("");
    try { await document.fonts.ready; await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); const data = await toPng(node, { width: canvasSize.width, height: canvasSize.height, pixelRatio: 1, cacheBust: true }); const link = document.createElement("a"); link.download = `react-day-${reel.number}-${reel.layout === "compare" ? "wrong-vs-right" : reel.layout === "output" ? "code-output" : "code"}.png`; link.href = data; link.click(); setMessage("PNG exported at 1080 × " + canvasSize.height); }
    catch (err) { setMessage(err instanceof Error ? `Export failed: ${err.message}` : "Export failed. Please try again."); } finally { setBusy(false); }
  };
  const changeLayout = (event: SelectChangeEvent) => update("layout", event.target.value as Layout);
  return <main className={styles.app}><header className={styles.header}><div className={styles.brand}><span className={styles.logo}>R<span>•</span></span><div><strong>React Reel Studio</strong><small>CODE CONTENT, MADE BEAUTIFUL</small></div></div><div className={styles.project}><span className={styles.liveDot}/> Project <b>useEffect fundamentals</b><span className={styles.saved}>Saved locally</span></div><div className={styles.headerActions}><Button className={styles.secondaryButton} onClick={() => setMessage("Preview is live. Edit any field to update it.")}>Preview</Button><Button variant="contained" className={styles.exportButton} onClick={exportPng} disabled={busy}>{busy ? "Exporting…" : "↓  Export PNG"}</Button></div></header>
    <div className={styles.workspace}><aside className={styles.editor}><div className={styles.editorTitle}><div><span className={styles.eyebrow}>CONTENT BUILDER</span><h1>Reel setup</h1></div><span className={styles.step}>01 <i>/ 02</i></span></div><div className={styles.templates}><span>DAY 22 STARTERS</span><div><button className={template === "wrong" ? styles.selectedTemplate : ""} onClick={() => selectTemplate("wrong")}>Wrong code</button><button className={template === "correct" ? styles.selectedTemplate : ""} onClick={() => selectTemplate("correct")}>Correct code</button><button className={template === "cycle" ? styles.selectedTemplate : ""} onClick={() => selectTemplate("cycle")}>Effect cycle</button></div></div><div className={styles.scrollArea}><section className={styles.section}><div className={styles.sectionHeading}><b>01</b><h2>Story details</h2></div><div className={styles.twoCol}>{input("Reel number", "number")}{input("Category", "category")}</div>{input("Title", "title")}{input("Subtitle", "subtitle", true)}</section>
      <section className={styles.section}><div className={styles.sectionHeading}><b>02</b><h2>Code & content</h2></div><div className={styles.twoCol}><label className={styles.field}><span>Language</span><Select size="small" value={reel.language} onChange={(e) => update("language", e.target.value)}><MenuItem value="jsx">JavaScript JSX</MenuItem><MenuItem value="javascript">JavaScript</MenuItem><MenuItem value="typescript">TypeScript</MenuItem><MenuItem value="tsx">TypeScript JSX</MenuItem></Select></label><label className={styles.field}><span>Layout</span><Select size="small" value={reel.layout} onChange={changeLayout}><MenuItem value="single">Single code</MenuItem><MenuItem value="compare">Wrong vs right</MenuItem><MenuItem value="output">Code + output</MenuItem></Select></label></div><label className={styles.field}><span>Code snippet <em>{reel.code.split("\n").length} lines</em></span><TextField className={styles.codeInput} value={reel.code} onChange={(e) => update("code", e.target.value)} multiline minRows={9} fullWidth /></label><div className={styles.twoCol}>{input("Highlight lines", "highlights")}<label className={styles.field}><span>Syntax theme</span><Select size="small" value={reel.theme} onChange={(e) => update("theme", e.target.value)}><MenuItem value="github-dark">GitHub Dark</MenuItem><MenuItem value="nord">Nord</MenuItem><MenuItem value="dracula">Dracula</MenuItem><MenuItem value="vitesse-dark">Vitesse Dark</MenuItem></Select></label></div>{reel.layout === "compare" && <><label className={styles.field}><span>Correct code</span><TextField className={styles.codeInput} value={reel.correctCode} onChange={(e) => update("correctCode", e.target.value)} multiline minRows={7} fullWidth /></label>{input("Correct explanation", "correctExplanation", true)}</>}{reel.layout === "output" && input("Output", "output", true)}{reel.layout !== "output" && input("Explanation", "explanation", true)}</section>
      </div><div className={styles.editorBottom}><div><span className={styles.syncIcon}>↻</span> Changes sync to preview</div><Button variant="contained" className={styles.exportButton} onClick={exportPng} disabled={busy}>{busy ? "Exporting…" : "Export reel  →"}</Button></div></aside>
      <section className={styles.preview} ref={previewRef}><div className={styles.previewTop}><div><span className={styles.eyebrow}>LIVE CANVAS</span><h2>Preview <span className={styles.liveBadge}><i/> LIVE</span></h2></div><div className={styles.preset}><button className={dimensions === "feed" ? styles.activePreset : ""} onClick={() => setDimensions("feed")}>Feed <small>4:5</small></button><button className={dimensions === "story" ? styles.activePreset : ""} onClick={() => setDimensions("story")}>Reel <small>9:16</small></button></div></div><div className={styles.canvasStage}><div className={styles.canvasViewport} style={{ width: canvasSize.width * zoom, height: canvasSize.height * zoom }}><div style={{ width: canvasSize.width, height: canvasSize.height, transform: `scale(${zoom})`, transformOrigin: "top left" }}><ExportCanvas reel={reel} dimensions={dimensions}/></div></div></div><div className={styles.previewBottom}><span><span className={styles.liveDot}/> Live preview <b>·</b> {canvasSize.width} × {canvasSize.height}px</span><span>Actual size · PNG export</span></div>{message && <div className={styles.toast} role="status">{message}<button onClick={() => setMessage("")}>×</button></div>}</section></div></main>;
}
