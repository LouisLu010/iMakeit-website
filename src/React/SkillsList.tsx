import React, { useState } from "react";

// 与下方 skills 的 key 一一对应，修掉原模板图标 key 不匹配导致图标不显示的 Bug
const CategoryIcons: Record<string, React.ReactElement> = {
  机器人: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-[var(--sec)]"
    >
      {/* 机器人头 */}
      <rect x="5" y="7" width="14" height="11" rx="2.5" />
      <path d="M12 3.5v3.5" />
      <circle cx="12" cy="3" r="1.2" />
      <circle cx="9" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.5 15.5h5" />
      {/* 天线/身体 */}
      <path d="M3 11v3M21 11v3" />
      <path d="M5 18v2M19 18v2" />
    </svg>
  ),
  无人机航拍: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-[var(--sec)]"
    >
      {/* 四旋翼无人机俯视 */}
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <circle cx="4" cy="4" r="2" />
      <circle cx="20" cy="4" r="2" />
      <circle cx="4" cy="20" r="2" />
      <circle cx="20" cy="20" r="2" />
      <path d="M5.5 5.5l3 3M18.5 5.5l-3 3M5.5 18.5l3-3M18.5 18.5l-3-3" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  业余无线电: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-[var(--sec)]"
    >
      {/* 信号塔 + 电波 */}
      <path d="M12 21l4-13M12 21L8 8" />
      <path d="M9.5 8h5" />
      <path d="M10.3 4.5h3.4" />
      <path d="M5.5 8a8 8 0 0 1 13 0" />
      <path d="M8 11a4 4 0 0 1 8 0" />
    </svg>
  ),
  "3D 打印": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-[var(--sec)]"
    >
      {/* 3D 打印机 + 打印平台 */}
      <path d="M5 5h14" />
      <path d="M7 5v5h10V5" />
      <path d="M9 10h6" />
      <path d="M12 10v3" />
      <rect x="9" y="13" width="6" height="3" rx="0.5" />
      <path d="M6 19h12" />
      <path d="M4 16l2 3h12l2-3" />
      <path d="M4 5v11M20 5v11" />
    </svg>
  ),
};

const SkillsList = () => {
  const [openItem, setOpenItem] = useState<string | null>("机器人");

  const skills: Record<string, string[]> = {
    机器人: [
      "废柴机器人大赛 —— 从零搭建，把想法造成会动的家伙",
      "学长（雪豹）手把手教学，零基础也能上手",
      "机械结构 · 电路 · 控制程序一条龙",
    ],
    无人机航拍: [
      "运动会、重要活动承担航拍任务",
      "专业学长教学，保证你大场面不掉链子",
      "飞行操控 · 镜头运镜 · 后期剪辑",
    ],
    业余无线电: [
      "业余无线电入门培训",
      "通信实操与电波测试",
      "筹办中的校内通信比赛",
    ],
    "3D 打印": [
      "从建模到切片，完整体验数字制造流程",
      "打印机器人零件、外壳和创意小物件",
      "调参 · 维护 · 材料选择一起上手",
    ],
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <div className="text-left pt-3 md:pt-9">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[var(--sec)] font-mono text-sm tracking-widest">
          // WHAT_WE_DO
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[var(--sec)] to-transparent opacity-40" />
      </div>
      <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6">
        我们在做什么
      </h3>
      <ul className="space-y-4 mt-4 text-lg">
        {Object.entries(skills).map(([category, items], idx) => {
          const isOpen = openItem === category;
          return (
            <li key={category} className="w-full">
              <div
                onClick={() => toggleItem(category)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleItem(category);
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                className={`md:w-[420px] w-full rounded-2xl text-left transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isOpen
                    ? "border-[var(--sec)] bg-[#0c1822] shadow-[0_0_24px_-6px_rgba(0,229,255,0.5)]"
                    : "border-[var(--white-icon-tr)] bg-[#0b1119c] hover:border-[var(--sec-dim)]"
                }`}
              >
                <div className="flex items-center gap-3 p-4">
                  <span className="text-[var(--sec)] font-mono text-xs opacity-60">
                    0{idx + 1}
                  </span>
                  <span className="shrink-0">{CategoryIcons[category]}</span>
                  <div className="flex items-center gap-2 flex-grow justify-between">
                    <span className="block text-[var(--white)] text-lg">
                      {category}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 text-[var(--sec)] transform transition-transform flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                    </svg>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 px-4 ${
                    isOpen ? "max-h-[500px] pb-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-2 text-[var(--white-icon)] text-sm border-t border-[var(--white-icon-tr)] pt-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-0.5">▹</span>
                        <li>{item}</li>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SkillsList;
