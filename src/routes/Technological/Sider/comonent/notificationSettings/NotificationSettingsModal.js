import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col, message } from 'antd'
import CustormModal from '@/components/CustormModal'
import styles from './NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import RenderDetail from './component/renderDetail'
import RenderSimple from './component/renderSimple'
import { getNoticeSettingList } from '@/services/technological/notificationSetting'
import {isApiResponseOk} from "@/utils/handleResponseData";

export default class NotificationSettingsModal extends Component {

    state = {
        projectOptions: [], // 项目的选项
        radio_checked_val: 'detail', // 选择详细提醒还是简要提醒, 默认为detail 详细提醒
        is_detail_none: 'none', // 是否显示还原 默认为none隐藏
        is_simple_none: 'none', // 是否显示还原 默认为none隐藏
        notice_setting_list: [], // 通知设置的列表
        default_options: [], // 默认列表选中的选项
    }

    componentDidMount() {
        this.getInitNoticeSettingList()
    }   

    // 获取初始设置列表信息
    getInitNoticeSettingList = () => {
        getNoticeSettingList().then((res) => {
            if (isApiResponseOk(res)) {
                this.setState({
                    notice_setting_list: res.data.notice_list_data,
                    default_options: res.data.default_option
                })
            } else {
                message.error(res.message)
            }
        })
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
        // console.log(this.refs, 'sss')
       this.refs.renderDetail.recoverDefault()
       this.setState({
        is_detail_none: 'none'
       })
    }

    // 展示设置的内容
    renderSetOptions() {
        const { radio_checked_val, is_detail_none, is_simple_none, notice_setting_list, default_options} = this.state
        let projectOptions, taskOptions, processOptions, fileOptions, aboutOptions;
        notice_setting_list.map(item => {
            if (item.id == 1) { // 代表项目的选项
               return projectOptions = [...item.child_data]
            } else if (item.id == 7) { // 代表任务/日程的选项
               return taskOptions = [...item.child_data]
            } else if (item.id == 16) { // 代表流程的选项
               return processOptions = [...item.child_data]
            } else if (item.id == 22) { // 代表文件的选项
               return fileOptions = [...item.child_data]
            } else if (item.id == 27) { // 代表关于我的选项
               return aboutOptions = [...item.child_data]
            }
        })
        let defaultProjectValueArr = [];
        let defaultTaskValueArr = [];
        let defaultProcessValueArr = []; 
        let defaultFileValueArr = []; 
        let defaultAboutValueArr = []; // 定义一个默认的项目选中的数组
        // 将默认项目选中的选项取出来
        projectOptions && projectOptions.map(item => {
            for (let val of default_options.detailed) {
                if (item.id == val) {
                    defaultProjectValueArr.push(val)
                }
            }
            return defaultProjectValueArr
        })

        // 将默认任务/日程选中的选项取出来
        taskOptions && taskOptions.map(item => {
            for (let val of default_options.detailed) {
                if (item.id == val) {
                    defaultTaskValueArr.push(val)
                }
            }
            return defaultTaskValueArr
        })

        const datas = {
            projectOptions,
            taskOptions, 
            processOptions, 
            fileOptions, 
            aboutOptions,
            defaultProjectValueArr,
            defaultTaskValueArr,
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
                    width={596}
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
