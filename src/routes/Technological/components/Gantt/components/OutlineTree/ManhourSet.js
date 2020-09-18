import React from 'react'
import styles from './index.less'
import { InputNumber } from 'antd'

export default function ManhourSet(props) {
  const { nodeValue = {}, value, onChange } = props
  const { plan_time_span = 0, start_time, due_time } = nodeValue
  const disabled = !start_time && !due_time && Number(plan_time_span) != 0
  console.log('nodeValue', nodeValue)
  return (
    <div className={styles.manhourSetWrapper}>
      <InputNumber
        disabled={disabled}
        size="large"
        min={0}
        max={999}
        defaultValue={0}
        value={value}
        onChange={onChange}
      />
      <span style={{ marginLeft: '16px' }}>天</span>
    </div>
  )
}
