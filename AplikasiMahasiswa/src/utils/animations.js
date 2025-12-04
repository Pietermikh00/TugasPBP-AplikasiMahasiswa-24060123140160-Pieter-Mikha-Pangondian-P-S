import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const useAnimMasuk = (durasi = 350, delay = 0) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(12)).current
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: durasi, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: durasi, delay, useNativeDriver: true }),
    ]).start()
  }, [opacity, translateY, durasi, delay])
  return { opacity, translateY }
}

export const useTekanScale = () => {
  const scale = useRef(new Animated.Value(1)).current
  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
  return { scale, onPressIn, onPressOut }
}