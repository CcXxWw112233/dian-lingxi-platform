import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import styles from '../NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'

export default class renderDetail extends Component {

    state = {
        show_project_down_arrow: true, //展示向下的箭头 默认为true 显示
        new_default_project_arr: this.props.defaultProjectValueArr, // 默认选中项目的选项
    }

    // 项目的点击事件 改变箭头的状态
    handleProject = () => {
        const { show_project_down_arrow } = this.state
        this.setState({
            show_project_down_arrow: !show_project_down_arrow
        })
    }

    // 点击还原事件
    recoverDefault = () => {
        console.log('sss', '进来了？？？')
        this.setState({
            new_default_project_arr: this.props.defaultProjectValueArr, // 默认选中项目的选项
        }, () => {
            this.handleProject()
        })
    }

    /**
     * 项目的选项改变事件
     * @param {Object} value 选中的value选项
     */
    chgProjectOptions = value => {
        // console.log(value, 'sss')
        const { defaultProjectValueArr, is_detail_none } = this.props
        this.setState({
            new_default_project_arr: value
        }, () => {
            for(var i = 0; i < defaultProjectValueArr.length; i++) {
                value.find(item => {
                    if (defaultProjectValueArr.indexOf(item) == -1) {
                        this.props.chgDetailDisplayBlock()
                    } else {
                        this.props.chgDetailDisplayNone()
                    }
                })
            }
        })
        
    }

    render() {
        const { show_project_down_arrow, new_default_project_arr } = this.state
        const { projectOptions } = this.props
        return (
            <div>
                <div className={styles.project}>
                    <div onClick={ () => { this.handleProject() } }>
                        {
                            show_project_down_arrow ? (
                                <span className={`${glabalStyles.authTheme}`}>&#xe7ee;</span>
                            ) : (
                                <span className={`${glabalStyles.authTheme}`}>&#xe7eb;</span>
                            )
                        }
                        <span>项目</span>
                    </div>
                    <div className={styles.projectContain}>
                        {
                            show_project_down_arrow && (
                                <Checkbox.Group onChange={this.chgProjectOptions} defaultValue={new_default_project_arr}>
                                    <Row>
                                        {
                                            projectOptions.map(item => {
                                                return (
                                                    <Col style={{marginBottom: 8}} span={8}>
                                                        <Checkbox value={item.value}>{item.label}</Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                        
                                    </Row>
                                </Checkbox.Group>
                            )
                        }
                    </div>
                </div>
                <div className={styles.task}>
                    <span className={`${glabalStyles.authTheme}`}>&#xe7eb;</span>
                    <span>任务/日程</span>
                </div>
                <div className={styles.process}>
                    <span className={`${glabalStyles.authTheme}`}>&#xe7eb;</span>
                    <span>流程</span>
                </div>
                <div className={styles.file}>
                    <span className={`${glabalStyles.authTheme}`}>&#xe7eb;</span>
                    <span>文档</span>
                </div>
            </div>
        )
    }
}
