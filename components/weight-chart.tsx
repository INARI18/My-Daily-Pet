import { Colors, Fonts } from "@/constants/theme";
import { WeightEntry } from "@/services/weights";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

const HEIGHT = 150;
const PAD = { top: 12, right: 12, bottom: 8, left: 36 };

// Minimal line chart: weight over time, no axes library needed.
export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const [width, setWidth] = useState(0);
  if (entries.length < 2) return null;

  const values = entries.map((e) => e.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const first = entries[0].date.getTime();
  const last = entries[entries.length - 1].date.getTime();
  const timeSpan = last - first || 1;

  const x = (d: Date) => PAD.left + ((d.getTime() - first) / timeSpan) * innerW;
  const y = (v: number) => PAD.top + (1 - (v - min) / span) * innerH;
  const points = entries.map((e) => `${x(e.date)},${y(e.value)}`).join(" ");
  const ticks = [max, (max + min) / 2, min];

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <>
          <Svg width={width} height={HEIGHT}>
            {ticks.map((v) => (
              <Line
                key={v}
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(v)}
                y2={y(v)}
                stroke={Colors.border}
                strokeWidth={1}
              />
            ))}
            <Polyline
              points={points}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {entries.map((e) => (
              <Circle
                key={e.id}
                cx={x(e.date)}
                cy={y(e.value)}
                r={4}
                fill={Colors.surface}
                stroke={Colors.accent}
                strokeWidth={2.5}
              />
            ))}
          </Svg>
          {ticks.map((v) => (
            <Text key={v} style={[styles.tick, { top: y(v) - 7 }]}>
              {v.toFixed(1)}
            </Text>
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", height: HEIGHT },
  tick: {
    position: "absolute",
    left: 0,
    width: PAD.left - 6,
    textAlign: "right",
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.textMuted,
  },
});
