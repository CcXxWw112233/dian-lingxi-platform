import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col, message } from 'antd'
import CustormModal from '@/components/CustormModal'
import styles from './NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import RenderDetail from './component/renderDetail'
import RenderSimple from './component/renderSimple'
import { getNoticeSettingList, getUsersNoticeSettingList, setNoticeSettingList } from '@/services/technological/notificationSetting'
import {isApiResponseOk} from "@/utils/handleResponseData";

export default class NotificationSettingsModal extends Component {

    constructor(props) {
        super(props) 
        this.state = {
						options: [
							{ label: '浏览器推送', value: 'is_notice_web' },
							{ label: '邮件', value: 'is_notice_mail' },
							{ label: '微信', value: 'is_notice_mp' },
						],
            radio_checked_val: '', // 选择详细提醒还是简要提醒, 默认为detail 详细提醒
            is_detail_none: 'none', // 是否显示还原 默认为none隐藏
						is_simple_none: 'none', // 是否显示还原 默认为none隐藏
						is_click_recover: false, // 是否点击了还原操作
            // 用户设置的接口列表中的数组
            user_setting_options: [], // 用户设置的通知列表
            is_notice_web: '', // 浏览器推送
            is_notice_mail: '', // 邮件推送
            is_notice_mp: '', // 微信公总号
						notice_model: '1', // 详细提醒还是简要提醒
						compare_options: [], // 用来做比较的数组
            // 默认设置列表的数据
            notice_setting_list: [], // 通知设置的列表
						default_options: [], // 默认列表选中的选项
						default_copy_options: [],
           
        }
    }

		// 在这里调用请求
    componentDidMount() {
        this.getInitNoticeSettingList()
    }

    // 获取初始设置列表信息
    getInitNoticeSettingList = () => {
				// 初始化默认调取用户设置的列表
        getUsersNoticeSettingList().then((res) => {
            if (isApiResponseOk(res)) {
                // console.log(res, 'sssss')
                this.setState({
                    is_notice_web: res.data.is_notice_web,
                    is_notice_mail: res.data.is_notice_mail,
										is_notice_mp: res.data.is_notice_mp,
										notice_model: res.data.notice_model,
                    radio_checked_val: res.data.notice_model && res.data.notice_model,
                    user_setting_options: res.data.notice_list_ids,
                    compare_options: [...res.data.notice_list_ids]
                })
            } else {
                message.error(res.message)
            }
				})
				// 初始化默认获取设置的列表
        getNoticeSettingList().then((res) => {
            if (isApiResponseOk(res)) {
                this.setState({
                    notice_setting_list: res.data.notice_list_data,
                    default_options: res.data.default_option,
                    default_copy_options: {...res.data.default_option}
                })
                // 将拿回来的数据进行操作返回
                let { notice_setting_list } = this.state
                notice_setting_list = notice_setting_list.map(item => {
                    let new_item = item
                    new_item = {...item, is_show_down_arrow:true}// 1 代表开启的状态
                    return new_item
                })
                this.setState({
                    notice_setting_list,
                })
                
            } else {
                message.error(res.message)
            }
        })
    }

    // 关闭设置的回调
    onCancel = () => {
        // console.log('ssss', '点击取消')
        this.props.setNotificationSettingsModalVisible()
    }

    // 点击确定的回调
    hideOkModal = () => {
        // console.log('进来了' , 'ssss')
        const { is_notice_web, is_notice_mp, is_notice_mail, radio_checked_val, user_setting_options } = this.state
        const data = { is_notice_web, is_notice_mp, is_notice_mail, notice_model: radio_checked_val, notice_list_ids: user_setting_options }
        console.log(data, 'sssss')
        setNoticeSettingList(data).then((res) => {
            // console.log(res, 'ssss')
        })
        this.props.setNotificationSettingsModalVisible()
    }
    
    /**
     * 详细提醒和简要提醒的回调
     * @param {Object} e 选中的事件对象
     */
    onChange = e => {
			if (e.target.value == '1') {
					this.setState({
							// is_simple_none: 'none',
							// notice_model: '1',
							radio_checked_val: '1',
					})
			} else if (e.target.value == '2') {
					this.setState({
							// is_detail_none: 'none',
							// notice_model: '2',
							radio_checked_val: '2'
					})
			}
		};
		
		// 推送的切换方法
		chgMovemenet = (e) => {
			let val = e.target.value
			console.log(val, 'ssss')
			
		}

    /** 
		 * 这是子组件修改父组件的数据的方法
		 * @param {Object} arr 传递过来的需要更新父组件状态的数组
		 * */ 
    updateParentList = (arr) => {
			// console.log(arr ,' sssssssssssssssssssss')
			// 如何判断当前是用户设置的列表还是默认的列表
        if (arr) { // 如果存在了, 就更新它
            this.setState({
                user_setting_options: arr
            })
        }
    }

    /**
		 * 调用该方法改变state中详细提醒的还原显示
		 * 1. 需要判断新的和旧的长度是否相等
		 * 2. 长度不相等, 显示还原
		 * 3. 长度相等, 判断值是否相等
		 * 4. 值不相等, 显示还原, 值相等, 不显示
		 * @param {Object} optionArr 获取子组件传递过来的数组
		 *  */ 
    chgDisplayBlock = (optionArr) => {
			console.log(optionArr, 'ssss')
			const { compare_options, default_options, is_click_recover, radio_checked_val } = this.state
			// console.log(is_click_recover, 'ssss')
			let temp_options = []
			if (radio_checked_val == '1') {
				 temp_options = default_options['detailed']
			} else if (radio_checked_val == '2') {
				 temp_options = default_options['briefly']
			}
			// console.log(temp_options, 'ssss_3')
			// 这里需要判断是否点击了还原
			let dLength = is_click_recover ? temp_options.length : compare_options.length
			let brr = is_click_recover ? temp_options : compare_options
			// 获取来自子组件修改父组件的数据
			let childLength = optionArr && optionArr.length
			let compare_flag = this.compareDiffArr(optionArr, brr)
			if (dLength != childLength) {// 如果长度不相等, 则有变化, 则显示还原
				if (radio_checked_val == '1') {
					this.setState({
						is_detail_none: 'inline-block'
					})
				} else {
					this.setState({
						is_simple_none: 'inline-block'
					})
				} 
				
			} else { // 长度相等的情况, 还需要判断值是否相等
				if (!compare_flag) {// 如果值不相等, 那么显示
					if (radio_checked_val == '1') {
						this.setState({ 
							is_detail_none: 'inline-block'
						})
					} else {
						this.setState({
							is_simple_none: 'inline-block'
						})
					}
					
				} else {
					if (radio_checked_val == '1') {
						this.setState({
							is_detail_none: 'none'
						})
					} else {
						this.setState({
							is_simple_none: 'none'
						})
					}
				}
			}
    }

    // 对比两个数组的值是否相等的方法
    compareDiffArr(arr, brr) {
        if (!(arr instanceof Array) || !(brr instanceof Array)) return false;
				if (arr.length != brr.length) return false;
				const len = brr.length
				let compare_flag = true
        for(let i = 0; i < len; i++) {
						if (arr.indexOf(brr[i]) == -1 ) { // 表示两个数组的值不相等
							compare_flag =  false
							break;
            } 
				}
				return compare_flag
    }

    // 点击还原的方法
    handleRecover = () => {
			 const { radio_checked_val, default_copy_options, is_detail_none, is_simple_none, default_options, notice_model } = this.state
			//  console.log(radio_checked_val, default_options, 'ssss')
				let tempStr = radio_checked_val == '1' ? 'detailed' : 'briefly'
       if (radio_checked_val == '1') { // 表示是详细提醒的状态
				this.setState({
					is_detail_none: 'none',
					user_setting_options: default_options[tempStr],
					default_copy_options: default_options[tempStr],
				})
				if (is_detail_none == 'none') {
					this.setState({
						is_click_recover: false
					})
				} else if (is_detail_none == 'inline-block') {
				 this.setState({
					 is_click_recover: true,
				 })
				}
       } else { // 表示是简要提醒的状态
				this.setState({
					is_simple_none: 'none',
					user_setting_options: default_options[tempStr],
					default_copy_options: default_options[tempStr],
				})
			 }
			 if (is_simple_none == 'none') {
				this.setState({
					is_click_recover: false
				})
			} else if (is_simple_none == 'inline-block') {
			 this.setState({
				 is_click_recover: true,
			 })
			}
			
    }

    /**
		 * 改变选项的状态
		 * @param {String} id 当前选项对应的id
		 * 对拿到的数据进行塞值
		 */
    chgParentSelectState = (id) => {
			let { notice_setting_list } = this.state  
			notice_setting_list = notice_setting_list && notice_setting_list.map(item => {
					let new_item = item
					if (item.id == id) {
							new_item = {...item, is_show_down_arrow: !item.is_show_down_arrow}
					}
					return new_item
			})
			this.setState({
					notice_setting_list: notice_setting_list
			})  
    }

    // 展示设置的内容
    renderSetOptions() {
        const { radio_checked_val, is_detail_none, is_simple_none, default_options, notice_setting_list, user_setting_options, notice_model} = this.state
				let new_notice_list = [...notice_setting_list] // 将数据中的列表重新解构出来进行数据操作 任务日程与我相关
				let new_all_options = {...default_options} // 将数据中的默认选中的列表重新解构出来进行数据操作
				let new_detail_default_options = notice_model == '1' ? user_setting_options && [...user_setting_options] : default_options['detailed'] // 将数据中的列表重新解构出来进行数据操作 默认选中的选项
				let new_simple_default_options = notice_model == '2' ? user_setting_options && [...user_setting_options] : default_options['briefly']

				// 定义一个数据列表, 将需要的数据传递进去
        const datas = {
            new_notice_list,
						new_detail_default_options,
						new_simple_default_options,
            is_detail_none,
            radio_checked_val,
				}
				// 判断显示是详细组件还是简要组件
        if (radio_checked_val == '1') {
            return <RenderDetail {...datas} ref="renderDetail" 
                        updateParentList={ this.updateParentList } 
                        chgDetailDisplayBlock={ this.chgDisplayBlock } 
                        chgParentSelectState= { this.chgParentSelectState } />
        } else {
            return <RenderSimple {...datas} 
												updateParentList={ this.updateParentList } 
												chgSimpleDisplayBlock={ this.chgDisplayBlock } 
												chgParentSelectState= { this.chgParentSelectState }
											/>
        }
    }

    render() {
        const { notificationSettingsModalVisible } = this.props
				const { options, radio_checked_val, is_detail_none, is_simple_none, is_notice_web, is_notice_mail, is_notice_mp } = this.state

        const settingContain = (
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <p>提醒方式</p>
                    <div className={styles.checkbox}>
											<Checkbox.Group style={{width: '100%'}} >
													<Row>
														{
															options && options.map(item => {
																return (
																	<Col span={8}>
																		<Checkbox onChange={this.chgMovemenet} value={item.value}>{item.label}</Checkbox>
																	</Col>
																)
															})
														}
													</Row>
												</Checkbox.Group>
                    </div>
                </div>
                <div className={styles.contant}>
                    <p>提醒内容</p>
                    <div className={styles.radio}>
                        <Radio.Group onChange={this.onChange} value={radio_checked_val == '1' ? '1' : '2'}>
                            <Radio value="1">
                                详细提醒
                                <span style={{display: is_detail_none}}>&nbsp;(<span onClick={this.handleRecover} className={styles.detail_recover}>还原</span>)</span>
                            </Radio>
                            <Radio value="2">
                                简要提醒
                                <span style={{display:is_simple_none}}>&nbsp;(<span onClick={this.handleRecover} className={styles.simple_recover}>还原</span>)</span>
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
                    onOk={this.hideOkModal}
                    overInner={settingContain}
                    >
                </CustormModal>
            </div>
        )
    }
}
