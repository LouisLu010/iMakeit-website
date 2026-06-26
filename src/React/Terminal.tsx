import { useEffect, useState, useRef } from "react";

const LINES = [
  { text: "> ssh imakeit@club", cls: "text-[#00e5ff]" },
  { text: "Connected.", cls: "text-[#5eff8b]" },
  { text: "> cat /etc/motto", cls: "text-[#00e5ff]" },
  { text: '"Think. Build. Break."', cls: "text-[#b8f7ff]" },
  { text: "> ls projects/", cls: "text-[#00e5ff]" },
  { text: "waste-bot  paper-plane", cls: "text-[#5eff8b]" },
  { text: "ham-radio  3d-print", cls: "text-[#5eff8b]" },
  { text: "> ", cls: "text-[#00e5ff]" },
];

const Terminal = ({
  glitchColors = ["#00e5ff", "#0bb6cf", "#5eff8b"],
  glitchSpeed = 55,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}: {
  glitchColors: string[];
  glitchSpeed: number;
  centerVignette: boolean;
  outerVignette: boolean;
  smooth: boolean;
}) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (lineIdx >= LINES.length) {
        setVisibleLines(LINES.length - 1);
        setCurrentChar(LINES[LINES.length - 1].text.length);
        setDone(true);
        return;
      }

      const cur = LINES[lineIdx];
      if (charIdx < cur.text.length) {
        charIdx++;
        setCurrentChar(charIdx);
        setVisibleLines(lineIdx);
        timerRef.current = setTimeout(tick, glitchSpeed);
      } else {
        lineIdx++;
        charIdx = 0;
        setCurrentChar(0);
        setVisibleLines(lineIdx);
        timerRef.current = setTimeout(tick, glitchSpeed * 1.5);
      }
    };

    timerRef.current = setTimeout(tick, 300);

    cursorRef.current = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, [glitchSpeed]);

  return (
    <div className="relative w-full h-full bg-[#070a10] overflow-hidden rounded-lg font-mono text-sm md:text-lg select-none" style={{ whiteSpace: "pre-wrap" }}>
      {/* 标题栏 */}
      <div className="flex items-center h-8 md:h-9 bg-[#111822] px-3 md:px-4 gap-2">
        <span className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="text-xs md:text-sm text-white/20 ml-2">Terminal</span>
      </div>

      {/* 终端内容 */}
      <div className="p-3 md:p-5 space-y-0.5 leading-relaxed">
        {LINES.map((line, i) => {
          if (i > visibleLines) return null;
          if (i < visibleLines) return <div key={i} className={line.cls}>{line.text}</div>;
          // 当前行：显示到 currentChar
          const text = line.text.slice(0, currentChar);
          return (
            <div key={i} className={line.cls}>
              <span>{text}</span>
              {done && (
                <span
                  className={`inline-block w-[0.6em] h-[1.1em] bg-[#00e5ff] ml-0.5 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Terminal;
