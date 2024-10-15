import { CSSProperties } from "react";
import { WordInfo } from "../lib/videos";

export default function Word({
  wordInfo,
  focus,
}: {
  wordInfo: WordInfo;
  focus: boolean;
}) {
  const format: CSSProperties = wordInfo.skip
    ? {
        textDecoration: "line-through",
        backgroundColor: "lightgray",
        color: "gray",
      }
    : focus
    ? {
        textDecoration: "underline",
        textDecorationColor: "lightblue",
        textDecorationThickness: "3px",
        textUnderlineOffset: "4px",
      }
    : {
        textDecoration: "none",
        backgroundColor: "lightblue",
      };

  return (
    <span
      id={wordInfo.index.toString()}
      key={wordInfo.index}
      style={{
        whiteSpace: "nowrap",
        marginRight: "5px",
        ...format,
      }}
    >
      {`[${Math.trunc(wordInfo.end - wordInfo.start)}s]`}
    </span>
  );
}
