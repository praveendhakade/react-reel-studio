import type { ReelDraft } from "../types/reel";
import CodePanel from "./CodePanel";
import styles from "../app/page.module.css";

export default function ReelCanvas({
  reel,
  dimensions,
}: {
  reel: ReelDraft;
  dimensions: "feed" | "story";
}) {
  const codePanel = (code: string, highlights: string, tone?: string) => (
    <CodePanel
      code={code}
      language={reel.language}
      highlights={highlights}
      tone={tone}
      theme={reel.theme}
    />
  );
  return (
    <article
      id="export-canvas"
      className={`${styles.canvas} ${dimensions === "story" ? styles.story : styles.feed}`}
    >
      <div className={styles.canvasGlow} />
      <header className={styles.canvasHead}>
        <span className={styles.canvasMark}>
          R<span>•</span>
        </span>
        <span>REACT REEL STUDIO</span>
        {reel.number && <span className={styles.day}>DAY {reel.number}</span>}
      </header>
      <div className={styles.canvasContent}>
        {reel.category && (
          <div className={styles.category}>
            <i />
            {reel.category.toUpperCase()}
          </div>
        )}
        <h1>
          {reel.title || (
            <span className={styles.canvasPlaceholder}>Your reel title</span>
          )}
        </h1>
        {reel.subtitle && (
          <p className={styles.canvasSubtitle}>{reel.subtitle}</p>
        )}
        {reel.layout === "compare" ? (
          <div className={styles.compareGrid}>
            <section className={`${styles.canvasCode} ${styles.wrongCard}`}>
              <div className={styles.codeLabel}>
                <b>×</b> WRONG
              </div>
              {codePanel(reel.code, reel.highlights, "tone-red")}
              {reel.explanation && <p>{reel.explanation}</p>}
            </section>
            <section className={`${styles.canvasCode} ${styles.rightCard}`}>
              <div className={styles.codeLabel}>
                <b>✓</b> RIGHT
              </div>
              {codePanel(
                reel.correctCode,
                reel.correctHighlights,
                "tone-green",
              )}
              {reel.correctExplanation && <p>{reel.correctExplanation}</p>}
            </section>
          </div>
        ) : reel.layout === "output" ? (
          <div className={styles.outputGrid}>
            <section className={styles.canvasCode}>
              <div className={styles.codeLabel}>SOURCE CODE</div>
              {codePanel(reel.code, reel.highlights)}
            </section>
            <section className={styles.outputPanel}>
              <div className={styles.outputBar}>
                <i />
                <i />
                <i /> CONSOLE
              </div>
              <p>{reel.output || "Add expected output in the editor."}</p>
            </section>
          </div>
        ) : (
          <section className={styles.canvasCode}>
            <div className={styles.codeLabel}>SOURCE CODE</div>
            {codePanel(reel.code, reel.highlights)}
            {reel.explanation && <p>{reel.explanation}</p>}
          </section>
        )}
      </div>
      <footer className={styles.canvasFoot}>
        <span>
          AI DEV <b>·</b> INTERVIEW HUB
        </span>
        <span>
          SWIPE TO LEARN <b>↗</b>
        </span>
      </footer>
    </article>
  );
}
