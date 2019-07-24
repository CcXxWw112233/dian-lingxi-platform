import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import CustormModal from '@/components/CustormModal'
import styles from './NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import RenderDetail from './component/renderDetail'
import RenderSimple from './component/renderSimple'

export default class NotificationSettingsModal extends Component {

    state = {
        projectOptions: [], // 项目的选项
        radio_checked_val: 'detail', // 选择详细提醒还是简要提醒, 默认为detail 详细提醒
        is_detail_none: 'none', // 是否显示还原 默认为none隐藏
        is_simple_none: 'none', // 是否显示还原 默认为none隐藏
    }

    // 关闭设置的回调
    onCancel = () => {
        this.props.setNotificationSettingsModalVisible()
    }

    /**
     * 详细提醒和简要提醒的回调
     * @param {Object} e 选中的事件对象
     */
    onChange = e => {
        // console.log('radio checked', e.target.value);
        this.setState({
            radio_checked_val: e.target.value,
        });
        if (e.target.value == 'detail') {
            this.setState({
                is_simple_none: 'none'
            })
        } else if (e.target.value == 'simple') {
            this.setState({
                is_detail_none: 'none'
            })
        }
    };

    // 调用该方法改变state中详细提醒的还原显示
    chgDetailDisplayBlock = () => {
        this.setState({
            is_detail_none: 'inline-block'
        })
    }

    // 调用该方法改变state中详细提醒的还原隐藏
    chgDetailDisplayNone = () => {
        this.setState({
            is_detail_none: 'none'
        })
    }

    // 点击详细提醒的还原
    handleDetailRecover = () => {
        console.log(this.refs, 'sss')
       this.refs.renderDetail.recoverDefault()
       this.setState({
        is_detail_none: 'none'
       })
    }


    

    // 展示设置的内容
    renderSetOptions() {
        const { radio_checked_val, is_detail_none, is_simple_none } = this.state
        const projectOptions = [
            { value: 'board.create', label: '新建项目', id: 'board.create', checked: false },
            { value: 'board.update.description', label: '编辑项目信息', id: 'board.update.description', checked: true },
            { value: 'board.update.user.add', label: '项目成员变更', id: 'board.update.user.add', checked: true },
            { value: 'board.delete', label: '项目结束', id: 'board.delete', checked: true },
            { value: 'board.lcb', label: '制定里程碑', id: 'board.create', checked: false },
        ]
        let defaultProjectValueArr = []

        projectOptions.filter(item => {
            if (item.checked) {
                let newVal = item.value
                defaultProjectValueArr.push(newVal)
                return defaultProjectValueArr
            }
        })

        const datas = {
            projectOptions,
            defaultProjectValueArr,
            is_detail_none,
        }
        if (radio_checked_val == 'detail') {
            return <RenderDetail {...datas} ref="renderDetail" chgDetailDisplayBlock={this.chgDetailDisplayBlock} chgDetailDisplayNone={this.chgDetailDisplayNone} handleDetailRecover={this.handleDetailRecover}  />
        } else {
            return <RenderSimple {...datas} />
        }
    }

    render() {

        const { notificationSettingsModalVisible } = this.props
        const { radio_checked_val, is_detail_none, is_simple_none } = this.state
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
        const { wechat } = userInfo

        const settingContain = (
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <p>提醒方式</p>
                    <div className={styles.checkbox}>
                        <Checkbox defaultChecked={true}>浏览器推送</Checkbox>
                        <Checkbox>邮件</Checkbox>
                        <Checkbox defaultChecked={ wechat ? true : false}>微信</Checkbox>
                    </div>
                </div>
                <div className={styles.contant}>
                    <p>提醒内容</p>
                    <div className={styles.radio}>
                        <Radio.Group onChange={this.onChange} defaultValue={radio_checked_val}>
                            <Radio value="detail">
                                详细提醒
                                <span style={{display: is_detail_none}}>&nbsp;(<span onClick={this.handleDetailRecover} className={styles.detail_recover}>还原</span>)</span>
                            </Radio>
                            <Radio value="simple">
                                简要提醒
                                <span style={{display:is_simple_none}}>&nbsp;(<span className={styles.simple_recover}>还原</span>)</span>
                            </Radio>
                        </Radio.Group>
                    </div>
                    <div className={styles.set_options}>
                        { this.renderSetOptions() }
                    </div>
                </div>
            </div>
        )
        

        return (
            <div>
                <CustormModal
                    title={<div style={{textAlign:'center', fontSize: 16, fontWeight: 500, color: '#000'}}>通知设置</div>}
                    visible={notificationSettingsModalVisible}
                    width={472}
                    zIndex={1006}
                    maskClosable={false}
                    destroyOnClose={true}
                    style={{textAlign: 'center'}}
                    onCancel={this.onCancel}
                    overInner={settingContain}
                    >
                </CustormModal>
            </div>
        )
    }
}
