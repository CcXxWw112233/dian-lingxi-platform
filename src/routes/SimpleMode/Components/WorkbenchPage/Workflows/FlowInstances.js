import React, { Component } from 'react'
import styles from './index.less'
import { Radio, Button } from 'antd'

export default class FlowInstances extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todo_state: '1'
        }
    }
    handleSizeChange = (e) => {
        this.setState({ todo_state: e.target.value });
    }
    render() {
        const { todo_state } = this.state
        return (
            <>
                <div className={styles.flows_top}>
                    <div className={styles.flows_top_title}>
                        流程列表
                    </div>
                    <div className={styles.flows_top_operate}>
                        <Radio.Group value={todo_state} onChange={this.handleSizeChange}>
                            <Radio.Button value="1">进行中</Radio.Button>
                            <Radio.Button value="2">已中止</Radio.Button>
                            <Radio.Button value="3">已完成</Radio.Button>
                            <Radio.Button value="0">未开始</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <div className={styles.flows_bott}>

                </div>
            </>
        )
    }
}
