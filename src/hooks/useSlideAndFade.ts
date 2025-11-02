import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useSlideAndFade({
  initialOpacity = 0,
  initialTranslateY = 20,
  duration = 300,
  delay = 0,
} = {}) {
    const opacity = useRef(new Animated.Value(initialOpacity)).current;
    const translateY = useRef(new Animated.Value(initialTranslateY)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration,
                delay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            ]).start();
        }, [opacity, translateY, duration, delay]);

        return { opacity, transform: [{ translateY }] };
        }
        