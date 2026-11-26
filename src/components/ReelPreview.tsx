"use client";

import { useEffect, useRef, useState } from "react";
import type { ReelDraft } from "../types/reel";
import ReelCanvas from "./ReelCanvas";
import styles from "../app/page.module.css";

export type ExportSize = "feed" | "story";
type Props = {
  reel: ReelDraft;
  size: ExportSize;
  onSizeChange: (size: ExportSize) => void;
  message: string;
  onDismissMessage: () => void;
};

export default function ReelPreview({
  reel,
  size,
  onSizeChange,
  message,
  onDismissMessage,
}: Props) {
  const previewRef = useRef<HTMLElement>(null);
  const [zoom, setZoom] = useState(0.36);
  const canvasSize =
    size === "feed"
      ? { width: 1080, height: 1350 }
      : { width: 1080, height: 1920 };

  useEffect(() => {
    const updateZoom = () => {
      if (previewRef.current)
        setZoom(Math.min(0.52, (previewRef.current.clientWidth - 48) / 1080));
    };
    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  return (
    <section className={styles.preview} ref={previewRef}>
      <div className={styles.previewTop}>
        <div>
          <span className={styles.eyebrow}>LIVE CANVAS</span>
          <h2>
            Preview{" "}
            <span className={styles.liveBadge}>
              <i /> LIVE
            </span>
          </h2>
        </div>
        <div className={styles.preset}>
          <button
            className={size === "feed" ? styles.activePreset : ""}
            onClick={() => onSizeChange("feed")}
          >
            Feed <small>4:5</small>
          </button>
          <button
            className={size === "story" ? styles.activePreset : ""}
            onClick={() => onSizeChange("story")}
          >
            Reel <small>9:16</small>
          </button>
        </div>
      </div>
      <div className={styles.canvasStage}>
        <div
          className={styles.canvasViewport}
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
          }}
        >
          <div
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            <ReelCanvas reel={reel} dimensions={size} />
          </div>
        </div>
      </div>
      <div className={styles.previewBottom}>
        <span>
          <span className={styles.liveDot} /> Live preview <b>·</b>{" "}
          {canvasSize.width} × {canvasSize.height}px
        </span>
        <span>Actual size · PNG export</span>
      </div>
      {message && (
        <div className={styles.toast} role="status">
          {message}
          <button onClick={onDismissMessage}>×</button>
        </div>
      )}
    </section>
  );
}
