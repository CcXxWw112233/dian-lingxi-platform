import React, { Component } from 'react'
import styles from './dragCard.less'
import { task_item_height } from '../../constants'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class DragCard extends Component {
  constructor(props) {
    super(props)
    this.height = 30
    this.top = (task_item_height - this.height) / 2
    this.padding_diff = 44
    this.left = -10
    // this.left = -(this.padding_diff / 2)
  }
  render() {
    const {
      width,
      id,
      drag_else_over_in,
      is_outline_view,
      operationChild = [],
      children
    } = this.props
    return (
      <>
        <div
          data-targetclassname="specific_example"
          data-rely_top={id}
          className={styles.drag_out}
          style={{
            width: width + this.padding_diff - 10 + operationChild.length * 22,
            height: this.height - 2,
            top: this.top - 2,
            left: this.left + 5,
            opacity: drag_else_over_in ? '0.6' : '1'
          }}
        >
          <div className={styles.opration}>{children}</div>
        </div>
        {/* <div className={`${styles.drag_area} ${styles.drag_left} ${globalStyles.authTheme}`}>
                    &#xe7ec;
                </div> */}
        <div
          className={`${styles.backMask} ${styles.backMask_1}`}
          data-targetclassname="specific_example"
          data-rely_right={id}
          data-rely_top={id}
        ></div>
        <div
          data-targetclassname="specific_example"
          data-rely_right={id}
          data-rely_top={id}
          className={`${styles.drag_area} ${styles.drag_right} ${globalStyles.authTheme}`}
          // style={{ top: '-1px' }}
        >
          &#xe61f;
        </div>
      </>
    )
  }
}
