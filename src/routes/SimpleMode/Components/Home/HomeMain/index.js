import React, { Component } from 'react'
import PropTypes from 'prop-types'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import MainBoard from './MainBoard'
export default class index extends Component {
    static propTypes = {
        prop: PropTypes
    }



    render() {
        return (
            <div className={styles.main_wapper}>
                <div className={styles.main_lf_wapper}>
                    <MainBoard ></MainBoard>
                </div>

                <div className={styles.main_rt_Wapper}>

                </div>
            </div>
        )
    }
}
// global_ellipsis