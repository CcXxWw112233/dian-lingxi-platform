import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import styles from '../NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import CommonOptions from './CommonOptions'

export default class renderDetail extends Component {

    state = {
        show_project_down_arrow: true, //展示项目向下的箭头 默认为true 显示
        new_default_project_arr: this.props.defaultProjectValueArr, // 默认选中项目的选项
    }


    // 项目的点击事件 改变箭头的状态
    handleProject = () => {
    }

    // 点击还原事件
    recoverDefault = () => {
        
    }

    /**
     * 项目的选项改变事件
     * 我需要去给一个判断类型是追加还是删除
     * @param {Object} value 选中的value选项
     */
    chgProjectOptions = (value) => {
    }

    render() {
        const { show_project_down_arrow, show_task_down_arrow, new_default_project_arr, new_default_task_arr } = this.state
        const { projectOptions, taskOptions, notice_setting_list } = this.props
        
        return (
            <div>
                {
                    notice_setting_list && notice_setting_list.map(item => {
                        return (
                           <CommonOptions itemVal={item} />
                        )
                    })
                }
            </div>
        )
    }
}
