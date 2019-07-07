import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { triggerList, diff_text_term, diff_remind_time,  historyList, remind_trigger, remind_time_type, remind_time_value}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList, remind_trigger, remind_time_type, remind_time_value
  }))
export default class RenderAdd extends Component {

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
