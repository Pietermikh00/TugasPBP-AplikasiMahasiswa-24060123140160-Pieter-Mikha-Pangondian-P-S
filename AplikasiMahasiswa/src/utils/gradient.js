import React from 'react'
import { View } from 'react-native'

let LG
try {
  LG = require('react-native-linear-gradient').default
} catch (e) {
  LG = null
}

export const Grad = ({ style, children, colors = ['#0A84FF', '#0056D2'], start = { x: 0, y: 0 }, end = { x: 1, y: 1 } }) => {
  if (LG) {
    return <LG style={style} colors={colors} start={start} end={end}>{children}</LG>
  }
  return <View style={[style, { backgroundColor: colors[0] }]}>{children}</View>
}