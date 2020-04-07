import React, { Component } from 'react'
import styles from './index.less'
import { Radio, Button } from 'antd'

export default class FlowInstances extends Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 'Large'
        }
    }
    handleSizeChange = (e) => {
        this.setState({ size: e.target.value });
    }
    render() {
        return (
            <>
                <div className={styles.flows_top}>
                    <div className={styles.flows_top_title}>
                        流程列表
                    </div>
                    <div className={styles.flows_top_operate}>
                        <Radio.Group value={this.state.size} onChange={this.handleSizeChange}>
                            <Radio.Button value="large">Large</Radio.Button>
                            <Radio.Button value="default">Default</Radio.Button>
                            <Radio.Button value="small">Small</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <div className={styles.flows_bott}>

                </div>
            </>
        )
    }
}
