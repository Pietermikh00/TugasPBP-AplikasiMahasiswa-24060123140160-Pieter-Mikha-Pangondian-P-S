import React from 'react'
import { Animated, Pressable, Text } from 'react-native'
import { Grad } from '../utils/gradient'
import { useTekanScale } from '../utils/animations'

const FancyButton = ({ teks, onPress, disabled, colors }) => {
  const { scale, onPressIn, onPressOut } = useTekanScale()
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled}>
        <Grad style={{ borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} colors={colors}>
          <Text style={{ color: '#fff', fontWeight: '700', letterSpacing: 0.3, fontFamily: 'sans-serif-medium' }}>{teks}</Text>
        </Grad>
      </Pressable>
    </Animated.View>
  )
}

export default FancyButton