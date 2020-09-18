import React, { useState, useMemo } from 'react'
import styles from './baselineitem.less'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import { connect } from 'dva'
import { ceil_height } from '../../constants'

function BaseLineItem(props) {
  let [itemStyle, setItemStyle] = useState({})
  useMemo(() => {
    let data = props.data
    // console.log(props.data)
    let style = {
      width: data.width,
      height: data.height,
      top: props.top,
      left: data.left,
      marginTop: 12
    }
    setItemStyle(style)
  }, [props.data])
  // 基线的基础数据
  // const data = props.data;
  const gantt_view_mode = props.gantt_view_mode
  // 甘特图中对应的数据
  const ganttData = props.ganttData

  return (
    <div
      className={styles.baselineitem_box}
      style={{
        top: itemStyle.top,
        left: itemStyle.left,
        marginTop: itemStyle.marginTop
      }}
    >
      {props.type === '1' ? (
        <div className={styles.milepost}>
          {!ganttData.parent_id ? (
            <div
              className={`${styles.parentMilepost} ${styles[gantt_view_mode]}`}
            >
              <span
                className={styles.milepostLine}
                style={{
                  height: (ganttData.expand_length - 0.5) * ceil_height
                }}
              ></span>
              <div className={`${styles.icons} ${globalStyles.authTheme}`}>
                &#xe6a0;
              </div>
            </div>
          ) : (
            <div
              className={`${styles.subMilepost} ${
                gantt_view_mode === 'month' ? styles.hasLeft : ''
              }`}
            ></div>
          )}
        </div>
      ) : props.type === '2' ? (
        <div
          className={styles.task}
          style={{ width: itemStyle.width, height: itemStyle.height }}
        ></div>
      ) : (
        <div className={styles.process}></div>
      )}
    </div>
  )
}

export default connect()(BaseLineItem)
