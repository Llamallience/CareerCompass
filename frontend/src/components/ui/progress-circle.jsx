import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const ProgressCircle = ({
  percentage,
  size = 200,
  strokeWidth = 12,
  showSeparators = true,
  separatorCount = 20,
}) => {
  // Color based on percentage
  const getColor = () => {
    if (percentage >= 80) return "#10b981"; // green
    if (percentage >= 60) return "#3b82f6"; // blue
    if (percentage >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const color = getColor();

  // Calculate separator positions
  const separators = showSeparators
    ? Array.from(
        { length: separatorCount },
        (_, i) => (360 / separatorCount) * i
      )
    : [];

  return (
    <div
      className="relative inline-flex items-center justify-center progress-circle-container"
      style={{ width: size, height: size }}
    >
      {/* Separators background */}
      {showSeparators && (
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {separators.map((angle, i) => {
            const radians = (angle * Math.PI) / 180;
            const radius = size / 2 - strokeWidth / 2;
            const x1 = size / 2 + radius * Math.cos(radians);
            const y1 = size / 2 + radius * Math.sin(radians);
            const x2 = size / 2 + (radius + strokeWidth) * Math.cos(radians);
            const y2 = size / 2 + (radius + strokeWidth) * Math.sin(radians);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      )}

      {/* Progress Circle */}
      <CircularProgressbarWithChildren
        value={percentage}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          strokeLinecap: "round",
          pathTransitionDuration: 1,
          pathColor: color,
          trailColor: "rgba(156, 163, 175, 0.2)",
          backgroundColor: "transparent",
        })}
      >
        {/* Percentage text */}
        <div
          className="flex flex-col items-center justify-center"
          title="Match Score"
        >
          <span
            className="font-bold"
            style={{
              color: color,
              fontSize: size > 120 ? "2.25rem" : "1.5rem",
            }}
          >
            {percentage}%
          </span>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};
