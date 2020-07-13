import React, { Component } from 'react'
import styles from './dragCard.less'
import { task_item_height } from '../../constants'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class DragCard extends Component {
    constructor(props) {
        super(props)
        this.height = 36
        this.top = (task_item_height - 36) / 2
        this.padding_diff = 44
        this.left = -10
        // this.left = -(this.padding_diff / 2)
    }
    render() {
        const { width } = this.props
        return (
            <>
                <div data-targetclassname="specific_example"
                    className={styles.drag_out} style={{ width: width + this.padding_diff, height: this.height, top: this.top, left: this.left }}>

                </div>
                {/* <div className={`${styles.drag_area} ${styles.drag_left} ${globalStyles.authTheme}`}>
                    &#xe7ec;
                </div> */}
                <div data-targetclassname="specific_example"
                    className={`${styles.drag_area} ${styles.drag_right} ${globalStyles.authTheme}`}>
                    &#xe7eb;
                </div>
            </>
        )
    }
}
