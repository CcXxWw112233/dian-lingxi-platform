import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker, Dropdown } from 'antd'
import infoRemindStyle from '../index.less'
import moment from 'moment';
import AvatarList from '@/components/avatarList'
import UserSearchAndSelectMutiple from '@/components/UserSearchAndSelectMutiple'
import globalStyles from '@/globalset/css/globalClassName.less'
const { Option } = Select;

@connect(({informRemind: { triggerList = [], diff_text_term = [], diff_remind_time = [],  historyList, remind_trigger, remind_time_type, remind_edit_type, remind_time_value, setInfoRemindList, message_consumers}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList, remind_trigger, remind_time_type, remind_edit_type, remind_time_value, setInfoRemindList, message_consumers
  }))
export default class RenderAdd extends Component {

  state = {
    is_show_other_select: true, // 是否显示其他的选项框 true 显示
    is_show_date_picker: false, // 是否显示日历日期 默认为 false
  }

  /**
   * @param {String} code 提醒的触发器类型
   * @param {String} type 区别是 xx时还是datetime还是正常的类型
   */
  handleTriggerChg(code, type) {
    const { dispatch, setInfoRemindList = [] } = this.props;
    // 修改自己定义的数据
    let new_setInfoRemindList = [...setInfoRemindList];

    new_setInfoRemindList = new_setInfoRemindList.map(item => {
        let new_item = item
        new_item = {...new_item, remind_trigger: code}
        return new_item
    })

    // 判断不同的type类型对应显示不同的内容
    if (type == 1) {
      this.setState({
        is_show_other_select: true,
        is_show_date_picker: false,
      })
    } else if(type == 2) {
      this.setState({
        is_show_other_select: false,
        is_show_date_picker: false,
      })
    } else {
      this.setState({
        is_show_date_picker: true,
        is_show_other_select: false,
      })
    }
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_setInfoRemindList,
        remind_trigger: code,
        remind_edit_type: type,
      }
    })
  }

  /**
   * 改变不同时间的值
   * @param {String} value 修改的不同的时间值
   */
  onDiffRemindTime(value) {
    const { dispatch, setInfoRemindList = [] } = this.props;
    // 修改自己定义的数据
    let new_setInfoRemindList = [...setInfoRemindList];

    new_setInfoRemindList = new_setInfoRemindList.map(item => {
        let new_item = item
        new_item = {...new_item, remind_time_value: value}
        return new_item
    })
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_setInfoRemindList,
        remind_time_value: value
      }
    })
  }

  /**
   * 改变不同时间字段的文本
   * @param {String} type 不同文本的type类型
   */
  onDiffTextTerm(type) {
    const { dispatch, setInfoRemindList = [] } = this.props;
    // 修改自己定义的数据
    let new_setInfoRemindList = [...setInfoRemindList];

    new_setInfoRemindList = new_setInfoRemindList.map(item => {
        let new_item = item
        new_item = {...new_item, remind_time_type: type}
        return new_item
    })
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_setInfoRemindList,
        remind_time_type: type,
      }
    })
  }

  /**
   * 设置提醒的事件
   */
  handleSetInfoRemind() {
    const { dispatch, setInfoRemindList = [], triggerList = [], message_consumers } = this.props;
    let new_info_list = [...setInfoRemindList]
    new_info_list = new_info_list.map(item => {
      let new_item = item
      new_item = {...new_item, is_edit_status: true, message_consumers: message_consumers}
      return new_item
    })
    // 将添加事件置为false
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_info_list,
        is_add_remind: false,
        remind_trigger: triggerList[0].type_code,
        remind_time_type: 'm',
        remind_time_value: '1',
        remind_edit_type: triggerList[0].remind_edit_type
      }
    })
    dispatch({
      type: 'informRemind/setRemindInformation',
      payload: {

      }
    })

  }

  // 时间戳转换日期格式
  getdate(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y,M,D,H,MIN;
    Y = date.getFullYear();
    M = date.getMonth() < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1;
    D = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate() ;
    H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    MIN = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + "-" + M + "-" + D + " " + H + ":" + MIN
 }

  /**
   * 日期的选择时间
   */
  handleDatePicker(date, dateString ) {
    const { dispatch, setInfoRemindList = [] } = this.props;
    let new_set_info_list = [...setInfoRemindList]
    let userDefindDate = new Date(dateString)
    let time = userDefindDate.valueOf() / 1000 // 转换成时间戳
    new_set_info_list = new_set_info_list.map(item => {
      let new_item = item
      new_item = {...new_item, remind_time_type: 'datetime', remind_time_value: time}
      return new_item
    })
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_set_info_list,
        remind_time_type: 'datetime',
        remind_time_value: time
      }
    })
  }

  /**
   * 成功确定的回调
   */
  handleDatePickerOk(date, value) {
    const { dispatch, setInfoRemindList = [] } = this.props;
    let new_set_info_list = [...setInfoRemindList]
    new_set_info_list = new_set_info_list.map(item => {
      let new_item = item
      new_item = {...new_item, remind_time_type: 'datetime', remind_time_value: value, is_edit_status: true}
      return new_item
    })
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        setInfoRemindList: new_set_info_list,
        remind_time_type: 'datetime',
        remind_time_value: value
      }
    })
  }

  // 用户信息的方法
  multipleUserSelectUserChange (e, message_consumers) {
      const { dispatch, user_remind_info = [] } = this.props;
      let new_user_remind_info = [...user_remind_info] // 通知提醒的用户列表的信息
      let new_message = [] // 传递过来的用户信息
      // console.log('sss', e)
      const { selectedKeys = [] } = e
      new_message = selectedKeys.map(item => {
        for(let val of new_user_remind_info) {
          if(item == val['user_id']) {
            return val
          }
        }
      })
      // 将全局的用户信息做修改
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          message_consumers: new_message
        }
      })
  }


  render() {
      const {
          triggerList = [], diff_text_term = [], diff_remind_time = [], remind_trigger, remind_time_type, remind_time_value,
          user_remind_info = [],message_consumers, rela_id, remind_edit_type
      } = this.props;
      const { is_show_date_picker, is_show_other_select } = this.state;

      const button_disable = () => {
        if(message_consumers && message_consumers.length > 0) {
          if(remind_trigger == 'userdefined' && (!remind_time_value || remind_time_value.length < 10)) {
            return true
          }
          return false
        } else {
          return true
        }
      }

      return (
          <div className={infoRemindStyle.slip}
          >
            <div className={infoRemindStyle.select}>
              {/* 显示某种事件类型的列表--选择框 */}
              <Select
                  defaultValue={remind_trigger}
                  style={{ width: 122, height: 32, marginRight: 16 }}>
                  {
                    triggerList && triggerList.length && triggerList.map(chileItrem => {
                      return (
                        <Option
                          onClick={ () => { this.handleTriggerChg(chileItrem.type_code, chileItrem.remind_edit_type) } }
                          value={chileItrem.type_code}>{chileItrem.type_name}</Option>
                      )
                    })
                  }
              </Select>
              {/* 显示自定义时间 */}
              {
                remind_edit_type == 3 &&
                  <DatePicker
                        showTime={true}
                        defaultValue={ remind_time_value.length <= 2 ? '' : moment(this.getdate(remind_time_value)) }
                        placeholder="请选择日期"
                        format="YYYY-MM-DD HH:mm"
                        onOk={ (value) => { this.handleDatePickerOk(value, remind_time_value) } }
                        onChange={ (date,dateString) => { this.handleDatePicker(date, dateString) } }
                  />
              }
              {/* 显示1-60不同的时间段--选择框 */}
              {
                remind_edit_type == 1 && <Select
                    defaultValue={remind_time_value.length <= 2 ? remind_time_value : 1}
                    style={{ width: 122, height: 32, marginRight: 16 }}>
                  {
                    diff_remind_time.map(childItem => {
                      return (
                        <Option
                          onClick={ () => { this.onDiffRemindTime(childItem.remind_time_value) } }
                          value={childItem.remind_time_value}>{childItem.remind_time_value}</Option>
                      )
                    })
                  }
                </Select>
              }
              {/* 显示 分钟 小时 天数 的列表--选择框 */}
              {
                  remind_edit_type == 1 && <Select
                    defaultValue={remind_time_type == 'datetime' ? 'm' : remind_time_type}
                    style={{ width: 122, height: 32, marginRight: 16 }}>
                  {
                    diff_text_term.map(childItem => {
                      return (
                        <Option
                          onClick={ () => { this.onDiffTextTerm(childItem.remind_time_type) } }
                          value={childItem.remind_time_type}>{childItem.txtVal}</Option>
                      )
                    })
                  }
                </Select>
              }
              {/* 显示用户信息头像 */}
              <div className={infoRemindStyle.user_info}>
                  <Dropdown overlay={
                    <UserSearchAndSelectMutiple
                      listData={user_remind_info} //users为全部用户列表[{user_id: '', name: '',...}, ]
                      keyCode={'user_id'} //值关键字
                      searchName={'name'} //搜索关键字
                      currentSelect = {message_consumers} //selectedUsers为已选择用户列表[{user_id: '', name: '',...}, ]
                      multipleSelectUserChange={(e) => this.multipleUserSelectUserChange(e, message_consumers)} //选择了某一项
                      /> }>
                        {
                          message_consumers && message_consumers.length > 0 ? (
                            <div style={{maxWidth: 60, width: 'auto'}}>
                              <AvatarList
                                size={'small'}
                                users={message_consumers} />
                            </div>
                          ) : (
                            <div className={`${globalStyles.authTheme} ${infoRemindStyle.plus}`}>&#xe70b;</div>
                          )
                        }
                  </Dropdown>
                </div>
            </div>
              <Button
                  disabled={button_disable()}
                  onClick={ () => { this.handleSetInfoRemind() } }
                  className={infoRemindStyle.icon} type="primary">确定</Button>
          </div>
      )
  }
}
