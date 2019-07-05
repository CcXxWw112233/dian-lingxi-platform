import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { triggerList, diff_text_term, diff_remind_time,  historyList}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList
  }))
export default class RenderHistory extends Component {

    state = {
        is_show_other_select: this.props.is_show_other_select,
        is_show_data_picker: this.props.is_show_data_picker,
    }
    

    handleTriggerChg(id,type, code) {
        console.log(id, type, code, 'lll')
        const { dispatch, historyList = [] } = this.props;
        let new_history_list = [...historyList]
        new_history_list = new_history_list.map(item => {
            let new_item = item
            if(id == new_item.id) {
                new_item = {...new_item, remind_trigger: code, is_edit_status: true, remind_edit_type: type}
            }
            return new_item
        })
        if (type == 1) {
          this.setState({
            is_show_other_select: true,
            is_show_data_picker: false,
          })
        } else if (type == 2) {
          this.setState({
            is_show_other_select: false,
            is_show_data_picker: false,
          })
        } else if (type == 3) {
          this.setState({
            is_show_other_select: false,
            is_show_data_picker: true,
          })
        }
        dispatch({
          type: 'informRemind/updateDatas',
          payload: {
            historyList: new_history_list,
            currentId: id,
            // is_edit_status: 1, // 更改编辑的状态
            // is_icon_status: 4, // 更改小图标的状态
            // remind_trigger: code, // 更改选项Option的类型
          }
        })
    }

    render() {
        const {
            triggerList = [], diff_text_term = [], diff_remind_time = [], itemValue = {}
        } = this.props;
        const { remind_trigger, id, remind_time_type, remind_time_value, remind_edit_type, status,  is_icon_status, is_edit_status } = itemValue
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
                            onClick={this.handleTriggerChg.bind(this,id,chileItrem.remind_edit_type, chileItrem.type_code)}
                            value={chileItrem.type_code}>{chileItrem.type_name}</Option>
                        )      
                      })
                    }
                </Select>
                {/* 显示自定义时间 */}
                {
                  remind_edit_type == 3 && <DatePicker />
                }
                {/* 显示1-60不同的时间段--选择框 */}
                {
                  remind_edit_type == 1 && <Select 
                      onChange={this.handleChgOption} 
                      defaultValue={remind_time_value} 
                      style={{ width: 122, height: 32, marginRight: 16 }}>
                    {
                      diff_remind_time.map(childItem => {
                        return (
                          <Option
                            onClick={() => { this.onDiffRemindTime(childItem.remind_time_value) }} 
                            value={childItem.remind_time_value}>{childItem.remind_time_value}</Option>
                        )
                      })
                    }
                  </Select>
                }
                {/* 显示 分钟 小时 天数 的列表--选择框 */}
                {
                   remind_edit_type == 1 && <Select 
                      onChange={this.handleChgOption}
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
              {/* 鼠标的hover事件 控制删除小图标的显示隐藏 */}
              {
                is_edit_status == 0 ? (
                  <div className={`${infoRemindStyle.slip_hover} ${infoRemindStyle.icon}`}>
                      <Tooltip placement="top" title="删除" arrowPointAtCenter>
                          <Icon type="delete" className={infoRemindStyle.del}/>
                      </Tooltip>
                  </div>
                ) : (
                    is_edit_status? (
                        <Button className={infoRemindStyle.icon} type="primary">确定</Button>
                    ) : (
                      <div className={`${infoRemindStyle.slip_hover} ${infoRemindStyle.icon}`}>
                          <Tooltip placement="top" title="删除" arrowPointAtCenter>
                              <Icon type="delete" className={infoRemindStyle.del}/>
                          </Tooltip>
                      </div>
                    )
                )
              }
              {/* 显示不同状态的小图标 */}
              {
                  status == 3 ? (
                      <div>
                          <Tooltip placement="top" title="已失效" arrowPointAtCenter>
                            <Icon type="exclamation-circle" className={`${infoRemindStyle.overdue} ${infoRemindStyle.icon}`} />
                          </Tooltip>
                      </div>
                  ) : (
                      status == 2 ? (
                          <div>
                              <Tooltip placement="top" title="已提醒" arrowPointAtCenter>
                                <Icon type="check-circle" className={`${infoRemindStyle.checked} ${infoRemindStyle.icon}`}/>
                              </Tooltip>
                          </div>
                      ) : (
                          null
                      )
                  )
              }
              
            </div>
        )
    }
}
