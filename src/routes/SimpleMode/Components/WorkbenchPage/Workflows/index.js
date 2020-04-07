import React, { Component } from 'react'
import Templates from './Templates'
import FlowInstances from './FlowInstances'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'

export default class index extends Component {
    render() {
        const workbenchBoxContentElementInfo = document.getElementById('container_workbenchBoxContent');
        let contentHeight = workbenchBoxContentElementInfo ? workbenchBoxContentElementInfo.offsetHeight : 0;
        return (
            <div className={styles.main_out}
                style={contentHeight > 0 ? { height: contentHeight + 'px' } : {}}>
                <div className={styles.main}>
                    <div className={styles.main_top}></div>
                    <div className={styles.main_contain}>
                        <div className={styles.contain_left}>
                            <Templates />
                        </div>
                        <div className={styles.contain_right}>
                            <FlowInstances />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
