import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'
import moment from 'moment';


@connect(({informRemind: { triggerList = [], diff_text_term = [], diff_remind_time = [],  historyList, remind_trigger, remind_time_type, remind_time_value, setInfoRemindList}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList, remind_trigger, remind_time_type, remind_time_value, setInfoRemindList
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
    const { dispatch, setInfoRemindList = [], triggerList = [] } = this.props;
    dispatch({
      type: 'informRemind/setRemindInformation',
      payload: {
        setInfoRemindList,
      }
    })
    // 将添加事件置为false
    dispatch({
      type: 'informRemind/updateDatas',
      payload: {
        is_add_remind: false,
        remind_trigger: triggerList[0].type_code,
        remind_time_type: 'm',
        remind_time_value: '1',
      }
    })
  }

  // 时间戳转换日期格式
  getdate(timestamp) {
    // console.log(timestamp, 'lll')
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
    handleDatePickerOk(value) {
      console.log(value)
    }


  render() {
      const {
          triggerList = [], diff_text_term = [], diff_remind_time = [], remind_trigger, remind_time_type, remind_time_value,
      } = this.props;
      const { is_show_date_picker, is_show_other_select } = this.state;
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
                is_show_date_picker && 
                  <DatePicker 
                        showTime={true}
                        defaultValue={ remind_time_value == 1 ? '' : moment(this.getdate(remind_time_value)) }
                        placeholder="请选择日期"
                        format="YYYY-MM-DD HH:mm"
                        onOk={ (value) => { this.handleDatePickerOk(value) } }                           
                        onChange={ (date,dateString) => { this.handleDatePicker(date, dateString) } }
                  />
              }
              {/* 显示1-60不同的时间段--选择框 */}
              {
                is_show_other_select && <Select 
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
                  is_show_other_select && <Select 
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
            </div>
              <Button 
                  onClick={ () => { this.handleSetInfoRemind() } }
                  className={infoRemindStyle.icon} type="primary">确定</Button>
          </div>
      )
  }
}
