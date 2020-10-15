import React, { useState, useMemo } from 'react'
import styles from './index.less'
// 将hex颜色转成rgb
function hexToRgba(hex, opacity) {
  var RGBA =
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')'
  return {
    red: parseInt('0x' + hex.slice(1, 3)),
    green: parseInt('0x' + hex.slice(3, 5)),
    blue: parseInt('0x' + hex.slice(5, 7)),
    rgba: RGBA
  }
}
// 将rgb颜色转成hex
function colorRGB2Hex(color) {
  var rgb = color.split(',')
  var r = parseInt(rgb[0].split('(')[1])
  var g = parseInt(rgb[1])
  var b = parseInt(rgb[2].split(')')[0])

  var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  return hex
}
export default function ChooseColor(props) {
  const [activeColor, setColor] = useState(props.color)
  let colors = [
    'rgba(226, 229, 236, 1)',
    'rgba(255, 233, 72, 1)',
    'rgba(255, 193, 32, 1)',
    'rgba(255, 135, 59, 1)',
    'rgba(158, 166, 194, 1)',
    'rgba(175, 255, 136, 1)',
    'rgba(80, 164, 39, 1)',
    'rgba(255, 78, 59, 1)',
    'rgba(71, 74, 91, 1)',
    'rgba(106, 154, 255, 1)',
    'rgba(51, 112, 21, 1)',
    'rgba(144, 19, 254, 1)',
    'rgba(0, 0, 0, 1)',
    'rgba(65, 112, 232, 1)'
  ]
  useMemo(() => {
    if (
      !props.needHex &&
      props.color &&
      props.color.indexOf('#') !== -1 &&
      props.color.length === 7
    ) {
      setColor(hexToRgba(props.color, 1).rgba)
    } else if (props.color) {
      setColor(props.color)
    }
  }, [props.color])
  const setActiveColor = val => {
    // setColor(val)
    console.log(props)
    if (props.needHex) {
      props.onChange && props.onChange(val, val)
    } else props.onChange && props.onChange(val, colorRGB2Hex(val))
  }
  const defaultColor = props.colors || colors
  return (
    <div className={styles.ChooseColor}>
      {defaultColor.map((item, index) => {
        return (
          <div className={styles.color_flexBox} key={index}>
            <span
              className={`${styles.color_item} ${
                activeColor === item ? styles.activeColor : ''
              }`}
              onClick={setActiveColor.bind(this, item)}
              key={index}
              style={{ background: item }}
            />
          </div>
        )
      })}
    </div>
  )
}
