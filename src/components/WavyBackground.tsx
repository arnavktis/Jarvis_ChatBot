"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = [
    "#0ea5e9",
    "#22d3ee",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ],
  waveWidth = 100,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const isInView = useInView(pathRef, { once: true, margin: "-10%" });

  const svgWidth = 1000;
  const svgHeight = 300;
  const waveAmplitude = 30;

  const offsetX = useMotionValue(0);
  const springConfig = {
    damping: 40,
    stiffness: 30,
    mass: 2,
  };
  const spring = useSpring(offsetX, springConfig);

  useEffect(() => {
    if (isInView) {
      offsetX.set(waveWidth);
    }
  }, [isInView, waveWidth, offsetX]);

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center overflow-hidden rounded-md",
        containerClassName
      )}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        className={cn("absolute z-0 w-full h-full", className)}
        {...props}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            {colors.map((color, index) => (
              <stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={`M0 ${svgHeight} V${svgHeight - waveAmplitude} Q${svgWidth / 4} ${svgHeight - 2 * waveAmplitude} ${svgWidth / 2} ${svgHeight - waveAmplitude} T${svgWidth} ${svgHeight - waveAmplitude} V${svgHeight}Z`}
          fill="url(#gradient)"
          opacity={waveOpacity}
        >
          <animate
            attributeName="d"
            dur={speed === "fast" ? "10s" : "20s"}
            repeatCount="indefinite"
            values={`
              M0 ${svgHeight} V${svgHeight - waveAmplitude} Q${svgWidth / 4} ${svgHeight - 2 * waveAmplitude} ${svgWidth / 2} ${svgHeight - waveAmplitude} T${svgWidth} ${svgHeight - waveAmplitude} V${svgHeight}Z;
              M0 ${svgHeight} V${svgHeight - waveAmplitude} Q${svgWidth / 4} ${svgHeight} ${svgWidth / 2} ${svgHeight - waveAmplitude} T${svgWidth} ${svgHeight - waveAmplitude} V${svgHeight}Z;
              M0 ${svgHeight} V${svgHeight - waveAmplitude} Q${svgWidth / 4} ${svgHeight - 2 * waveAmplitude} ${svgWidth / 2} ${svgHeight - waveAmplitude} T${svgWidth} ${svgHeight - waveAmplitude} V${svgHeight}Z
            `}
          />
        </path>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
};