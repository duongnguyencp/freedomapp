import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

type AnimatedNumberProps = {
  value: number;
  formatValue: (value: number) => string;
  style?: StyleProp<TextStyle>;
  duration?: number;
};

// Deliberately plain requestAnimationFrame on the JS thread, not
// Reanimated. `formatValue` is an arbitrary caller-supplied function
// (toLocaleString, string concatenation, etc.) — calling that from a
// Reanimated UI-thread worklet crashes at runtime (worklets can't call
// regular JS-thread functions). Formatting on every frame is JS-thread
// work either way, so there's no real perf loss from skipping the UI
// thread for this one small counter.
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Counts up from the previously shown value to the new one. Reserved for
// the one or two numbers that matter most on a screen (net worth, FI
// progress) — per prompt.md: "Do not animate every number on the screen."
export function AnimatedNumber({ value, formatValue, style, duration = 900 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = displayValue;
    startRef.current = null;

    function step(timestamp: number) {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      setDisplayValue(fromRef.current + (value - fromRef.current) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // Intentionally excludes `displayValue` — re-running on its own change
    // would restart the animation every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <Text style={style}>{formatValue(displayValue)}</Text>;
}
