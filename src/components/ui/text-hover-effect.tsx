"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Props = {
  text: string;
  duration?: number;
  className?: string;
  /** element whose bounds control hover/activation (e.g., the <footer/>) */
  targetRef: React.RefObject<HTMLElement>;
};

export function TextHoverEffect({ text, duration = 0.18, className, targetRef }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState<{ cx: string; cy: string }>({
    cx: "50%",
    cy: "50%",
  });

  useEffect(() => {
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (!targetRef?.current || !svgRef.current) return;

      const bounds = targetRef.current.getBoundingClientRect();
      const inside =
        e.clientX >= bounds.left &&
        e.clientX <= bounds.right &&
        e.clientY >= bounds.top &&
        e.clientY <= bounds.bottom;

      setHovered(inside);

      // Animate the gradient handle smoothly with rAF
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const svgRect = svgRef.current!.getBoundingClientRect();
        const cx = ((e.clientX - svgRect.left) / svgRect.width) * 100;
        const cy = ((e.clientY - svgRect.top) / svgRect.height) * 100;
        setMaskPosition({
          cx: `${Math.max(0, Math.min(100, cx))}%`,
          cy: `${Math.max(0, Math.min(100, cy))}%`,
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [targetRef]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none block h-full w-full"
      viewBox="0 0 1000 220"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* soft glow */}
        <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* multicolor gradient used for stroke */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* moving mask that follows the cursor */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="24%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* base outline (subtle) */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 180ms ease-out" }}
      >
        {text}
      </text>

      {/* gradient stroke revealed by mask, with glow */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className={className}
        fill="none"
        stroke="url(#textGradient)"
        strokeWidth="2.5"
        mask="url(#textMask)"
        filter="url(#outerGlow)"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 180ms ease-out" }}
      >
        {text}
      </text>
    </svg>
  );
}
