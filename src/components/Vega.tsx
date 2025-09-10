/* eslint-disable @typescript-eslint/no-explicit-any */
import { VegaEmbed } from "react-vega";
import React, { useEffect, useRef, useState } from "react";
import type { VisualizationSpec, EmbedOptions } from "vega-embed";

// 定义响应式断点
interface BreakpointConfig {
  maxWidth: number;
  config: {
    height?: number;
  };
}

interface VegaProps {
  spec: VisualizationSpec | string;
  options?: EmbedOptions;
  className?: string;
  responsive?: boolean;
  breakpoints?: BreakpointConfig[];
}

// 默认断点配置
const DEFAULT_BREAKPOINTS: BreakpointConfig[] = [
  {
    maxWidth: 768,
    config: {
      height: 240,
    },
  },
  {
    maxWidth: 1024,
    config: {
      height: 300,
    },
  },
  {
    maxWidth: Infinity,
    config: {
      height: 400,
    },
  },
];

const Vega: React.FC<VegaProps> = ({
  spec,
  options,
  className = "",
  responsive = true,
  breakpoints = DEFAULT_BREAKPOINTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentConfig, setCurrentConfig] = useState<{ height: number }>({
    height: 400,
  });

  // 合并默认选项和用户提供的选项
  const embedOptions: EmbedOptions = {
    mode: "vega-lite",
    renderer: "canvas",
    ...options,
  };

  // 响应式处理
  useEffect(() => {
    if (!responsive) return;

    const updateConfig = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // 找到匹配的断点配置
      const breakpoint =
        breakpoints.find((bp) => containerWidth <= bp.maxWidth) ||
        breakpoints[breakpoints.length - 1];

      setCurrentConfig({
        height: breakpoint.config.height || 400,
      });
    };

    // 初始化配置
    updateConfig();

    // 监听窗口大小变化
    window.addEventListener("resize", updateConfig);

    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", updateConfig);
    };
  }, [responsive, breakpoints]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <VegaEmbed
        spec={
          typeof spec !== "object"
            ? spec
            : {
                autosize: {
                  type: "fit",
                  contains: "padding",
                  resize: true,
                },
                ...spec,
                width: "container" as any,
                ...(responsive ? currentConfig : {}),
              }
        }
        options={embedOptions}
      />
    </div>
  );
};

export default Vega;
