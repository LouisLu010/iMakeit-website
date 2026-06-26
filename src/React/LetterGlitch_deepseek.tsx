import { useRef, useEffect, useState } from "react";

// 预计算颜色转换缓存
const createColorCache = (colors: string[]) => {
  const cache: Record<string, { r: number; g: number; b: number }> = {};
  
  const colorToRgb = (hex: string) => {
    if (cache[hex]) return cache[hex];
    
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    const rgb = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
    
    cache[hex] = rgb;
    return rgb;
  };

  // 预填充缓存
  colors.forEach(colorToRgb);
  
  return colorToRgb;
};

const LetterGlitch = ({
  glitchColors = ["#5e4491", "#A476FF", "#241a38"],
  glitchSpeed = 33,
  centerVignette = false,
  outerVignette = false,
  smooth = true,
}: {
  glitchColors: string[];
  glitchSpeed: number;
  centerVignette: boolean;
  outerVignette: boolean;
  smooth: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      color: string;
      targetColor: string;
      colorProgress: number;
    }[]
  >([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(0);
  const colorToRgb = useRef<(hex: string) => ReturnType<typeof createColorCache>>(() => null);
  const [isReady, setIsReady] = useState(false);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const lettersAndSymbols = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "!", "@", "#", "$", "&", "*", "(", ")", "-", "_", "+", "=", "/", 
    "[", "]", "{", "}", ";", ":", "<", ">", ",", "0", "1", "2", "3", 
    "4", "5", "6", "7", "8", "9"
  ];

  const getRandomChar = () => {
    return lettersAndSymbols[
      Math.floor(Math.random() * lettersAndSymbols.length)
    ];
  };

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) => {
    return `rgb(${
      Math.round(start.r + (end.r - start.r) * factor)
    },${
      Math.round(start.g + (end.g - start.g) * factor)
    },${
      Math.round(start.b + (end.b - start.b) * factor)
    })`;
  };

  const calculateGrid = (width: number, height: number) => {
    return { 
      columns: Math.ceil(width / charWidth),
      rows: Math.ceil(height / charHeight)
    };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawInitialFrame = () => {
    if (!context.current || letters.current.length === 0) return;
    
    const ctx = context.current;
    const { width, height } = canvasRef.current!.getBoundingClientRect();
    
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
    
    setIsReady(true);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawInitialFrame();
  };

  const updateLetters = (updateIndices: number[]) => {
    if (!letters.current || letters.current.length === 0) return;
    
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
    
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;
      
      updateIndices.push(index);
      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };

  const drawLetters = (indices: number[]) => {
    if (!context.current || !indices.length) return;
    
    const ctx = context.current;
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    indices.forEach(index => {
      const letter = letters.current[index];
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      
      ctx.fillStyle = "#070a10";
      ctx.fillRect(x, y, charWidth, charHeight);
      
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const handleSmoothTransitions = (updateIndices: number[]) => {
    let needsRedraw = false;
    
    letters.current.forEach((letter, index) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);
        needsRedraw = true;

        const startRgb = colorToRgb.current(letter.color);
        const endRgb = colorToRgb.current(letter.targetColor);
        
/*         if (startRgb && endRgb) {
          letter.color = interpolateColor(
            startRgb,
            endRgb,
            letter.colorProgress
          );
        } */
        
        updateIndices.push(index);
      }
    });
    
    return needsRedraw;
  };

  const animate = () => {
    const now = performance.now();
    const updateIndices: number[] = [];
    
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters(updateIndices);
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions(updateIndices);
    }

    // 只重绘有变化的字符
    if (updateIndices.length) {
      drawLetters(updateIndices);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

/*   useEffect(() => {
    // 初始化颜色转换器
    colorToRgb.current = createColorCache(glitchColors);
  }, [glitchColors]); */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext("2d");
    resizeCanvas();

    // 延迟启动动画，让初始绘制更快完成
    const startAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastGlitchTime.current = performance.now();
      animate();
    };

    const animationDelay = 300; // 延迟300ms开始动画
    const animationTimer = setTimeout(startAnimation, animationDelay);

    const handleResize = () => {
      cancelAnimationFrame(animationRef.current!);
      resizeCanvas();
      setTimeout(startAnimation, animationDelay);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(animationTimer);
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, [glitchSpeed, smooth]);

  return (
    <div className="relative w-full h-full bg-[#070a10] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full will-change-contents"
      />

      {!isReady && (
        <div className="absolute inset-0 bg-[#070a10] animate-pulse" />
      )}

      {outerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(7,10,16,0)_60%,_rgba(7,10,16,1)_100%)]" />
      )}

      {centerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  );
};

export default LetterGlitch;