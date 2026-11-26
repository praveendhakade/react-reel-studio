export type ReelLayout = "single" | "compare" | "output";
export type ReelTemplate = "wrong" | "correct" | "cycle";

export type ReelDraft = {
  number: string;
  title: string;
  subtitle: string;
  category: string;
  language: string;
  code: string;
  explanation: string;
  highlights: string;
  theme: string;
  layout: ReelLayout;
  correctCode: string;
  correctHighlights: string;
  correctExplanation: string;
  output: string;
};

export function createBlankDraft(layout: ReelLayout): ReelDraft {
  return {
    number: "",
    title: "",
    subtitle: "",
    category: "",
    language: "tsx",
    code: "",
    explanation: "",
    highlights: "",
    theme: "github-dark",
    layout,
    correctCode: "",
    correctHighlights: "",
    correctExplanation: "",
    output: "",
  };
}
