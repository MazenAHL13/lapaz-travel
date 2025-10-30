import { useRef } from "react";
import { Animated } from "react-native";

export function useBounceAnimation(
  config: { toValue?: number; duration?: number } = {}
) {
  const { toValue = 1. } = config;
  const scale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return { scale, bounce };
}