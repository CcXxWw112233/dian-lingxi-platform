import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { triggerList, diff_text_term, diff_remind_time,  historyList, remind_trigger, remind_time_type, remind_time_value}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList, remind_trigger, remind_time_type, remind_time_value
  }))
export default class RenderAdd extends Component {

     /**
     *  改变选项的类型切换的方法
     * 如果 `remind_edit_type` 为1 就显示后面两项
     * 如果 `remind_edit_type` 为2 | 3  就不显示后面两项
     * 注意 `remind_edit_type` 为3 的时候,需要显示日历来选择时间 并将结果转换成时间戳
     * @param {String} type 类型
     * @param {String} id 当前对象的id
     * @param {String} type 区分type类型 为1 能显示后面两项，为2|3 不能显示 为3的时候显示日期
     * @param {String} code 
     */
    handleTriggerChg(id,type, code) {
        // console.log(id, type, code, 'lll')
        const { dispatch, historyList = [] } = this.props;
        // 想要改变historyList中的某一条信息, 所以需要将它解构出来
        let new_history_list = [...historyList]
        new_history_list = new_history_list.map(item => {
            let new_item = item
            if(id == new_item.id) {
                new_item = {...new_item, remind_trigger: code, is_edit_status: true, remind_edit_type: type}
            }
            return new_item
        })
        dispatch({
          type: 'informRemind/updateDatas',
          payload: {
            historyList: new_history_list,
          }
        })
    }


    render() {
        const {
            triggerList = [], diff_text_term = [], diff_remind_time = [], remind_trigger, remind_time_type, remind_time_value
        } = this.props;
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
                            onClick={ () => { this.handleTriggerChg() } }
                            value={chileItrem.type_code}>{chileItrem.type_name}</Option>
                        )      
                      })
                    }
                </Select>
                {/* 显示自定义时间 */}
                {
                //   remind_edit_type == 3 && <DatePicker />
                }
                {/* 显示1-60不同的时间段--选择框 */}
                {
                  <Select 
                      defaultValue={remind_time_value} 
                      style={{ width: 122, height: 32, marginRight: 16 }}>
                    {
                      diff_remind_time.map(childItem => {
                        return (
                          <Option
                            value={childItem.remind_time_value}>{childItem.remind_time_value}</Option>
                        )
                      })
                    }
                  </Select>
                }
                {/* 显示 分钟 小时 天数 的列表--选择框 */}
                {
                   <Select 
                      defaultValue={remind_time_type} 
                      style={{ width: 122, height: 32, marginRight: 16 }}>
                    {
                      diff_text_term.map(childItem => {
                        return (
                          <Option
                            value={childItem.remind_time_type}>{childItem.txtVal}</Option>
                        )
                      })
                    }
                  </Select>
                }
              </div>
                <Button 
                    // onClick={ () => { this.handleUpdateInfoRemind(id) } }
                    className={infoRemindStyle.icon} type="primary">确定</Button>
                
              
            </div>
        )
    }
}
