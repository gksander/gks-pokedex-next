import * as React from "react";
import { getPokemonDetails } from "../utils/data-wranglers";

type PokeStatChartProps = {
  stats: ReturnType<typeof getPokemonDetails>["stats"];
  color: string;
  bgColor: string;
};

export const PokeStatChart: React.FC<PokeStatChartProps> = ({
  stats,
  color,
  bgColor,
}) => {
  const innerPath = (() => {
    const points = stats.map((stat, i) => {
      const r = R * Math.min(parseInt(stat.base, 10) / 255, 1);
      const x = r * Math.cos((i / N) * 2 * PI);
      const y = -r * Math.sin((i / N) * 2 * PI);
      return [x, y];
    });

    return [
      `M ${points[0][0]} ${points[0][1]}`,
      ...points.map(([x, y]) => `L ${x} ${y}`),
      "Z",
    ].join(",");
  })();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`-${PADDED_R} -${PADDED_R} ${2 * PADDED_R} ${2 * PADDED_R}`}
    >
      {linePairs.map(([[x1, y1], [x2, y2]]) => (
        <line
          key={x1 + y1}
          className="stroke-current"
          {...{ x1, y1, x2, y2 }}
        />
      ))}
      <path d={outerPath} className="stroke-current" fill="transparent" />
      <path
        d={innerPath}
        fill={color}
        stroke={bgColor}
        fillOpacity={0.9}
        strokeWidth={2}
      />
      {stats.map((stat, i) => (
        <text
          key={i}
          textAnchor={i === 0 ? "end" : i === 3 ? "start" : "middle"}
          fontSize={8}
          x={getX(i)}
          y={getY(i)}
        >
          {stat.name}
        </text>
      ))}
    </svg>
  );
};

const R = 50;
const PADDED_R = 1.02 * R;
const N = 6;
const PI = Math.PI;
const points = Array.from({ length: N })
  .map((_, i) => i)
  .map((i) => [
    R * Math.cos((i / N) * 2 * PI),
    -R * Math.sin((i / N) * 2 * PI),
  ]);

const linePairs = [
  [points[0], points[3]],
  [points[1], points[4]],
  [points[2], points[5]],
];
const outerPath = [
  `M ${points[0][0]} ${points[0][1]}`,
  ...points.map((point) => `L ${point[0]} ${point[1]}`),
  `Z`,
].join(",");

const getX = (i: number) => R * Math.cos((i / N) * 2 * PI);
const getY = (i: number) => -R * Math.sin((i / N) * 2 * PI);
