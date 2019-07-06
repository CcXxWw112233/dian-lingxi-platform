import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { triggerList, diff_text_term, diff_remind_time,  historyList}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList
  }))
export default class RenderHistory extends Component {
    
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

    /**
     * 改变不同的时间值
     * @param {String} id 某一条记录的id
     * @param {String} value 改变时间状态的value值
     */
    onDiffRemindTime(id,value) {
      // console.log(id, value, 'lll')
      const { dispatch, historyList = [] } = this.props;
      let new_history_list = [...historyList]
      new_history_list = new_history_list.map(item => {
          let new_item = item
          if(value != new_item.remind_time_value && id == new_item.id) {
              new_item = {...new_item, is_edit_status: true, remind_time_value: value}
          }
          return new_item
      })
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          historyList: new_history_list
        }
      })
    }

    /**
     * 改变不同时间字段的文本
     * @param {String} 某一条记录的id
     * @param {String} 改变时间的文本的类型
     */
    onDiffTextTerm(id, type) {
      const { dispatch, historyList = [] } = this.props;
      let new_history_list = [...historyList]
        new_history_list = new_history_list.map(item => {
            let new_item = item
            if(type != new_item.remind_time_type && id == new_item.id) {
                new_item = {...new_item, is_edit_status: true, remind_time_type: type}
            }
            return new_item
        })
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          historyList: new_history_list
        }
      })
    }

    /**
     * 更新提醒消息的状态
     */
    handleUpdateInfoRemind(id) {
      console.log(id, 'sss')
      const { historyList = [], dispatch } = this.props;
      let new_history_list = [...historyList]
      new_history_list = new_history_list.filter(item => {
        let new_item = item
        if (new_item.id == id) {
         return new_item = {...new_item, is_edit_status: false}
        }
        return new_item
      })
      dispatch({
        type: 'informRemind/updateRemindInformation',
        payload: {
          new_history_list
        }
      })

    }


    render() {
        const {
            triggerList = [], diff_text_term = [], diff_remind_time = [], itemValue = {}
        } = this.props;
        const { remind_trigger, id, remind_time_type, remind_time_value, remind_edit_type, status, is_edit_status } = itemValue
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
                      defaultValue={remind_time_value} 
                      style={{ width: 122, height: 32, marginRight: 16 }}>
                    {
                      diff_remind_time.map(childItem => {
                        return (
                          <Option
                            onClick={() => { this.onDiffRemindTime(id,childItem.remind_time_value) }} 
                            value={childItem.remind_time_value}>{childItem.remind_time_value}</Option>
                        )
                      })
                    }
                  </Select>
                }
                {/* 显示 分钟 小时 天数 的列表--选择框 */}
                {
                   remind_edit_type == 1 && <Select 
                      defaultValue={remind_time_type} 
                      style={{ width: 122, height: 32, marginRight: 16 }}>
                    {
                      diff_text_term.map(childItem => {
                        return (
                          <Option
                            onClick={ () => { this.onDiffTextTerm(id, childItem.remind_time_type) } }
                            value={childItem.remind_time_type}>{childItem.txtVal}</Option>
                        )
                      })
                    }
                  </Select>
                }
              </div>
              {/* 鼠标的hover事件 控制删除小图标的显示隐藏 */}
              {
                 
                is_edit_status ? (
                    <Button 
                      onClick={ () => { this.handleUpdateInfoRemind(id) } }
                      className={infoRemindStyle.icon} type="primary">确定</Button>
                ) : (
                    <div className={`${infoRemindStyle.slip_hover} ${infoRemindStyle.icon}`}>
                        <Tooltip placement="top" title="删除" arrowPointAtCenter>
                            <Icon type="delete" className={infoRemindStyle.del}/>
                        </Tooltip>
                    </div>
                )
                
              }
              {/* 显示不同状态的小图标 */}
              {
                !is_edit_status &&  status == 3 ? (
                      <div>
                          <Tooltip placement="top" title="已失效" arrowPointAtCenter>
                            <Icon type="exclamation-circle" className={`${infoRemindStyle.overdue} ${infoRemindStyle.icon}`} />
                          </Tooltip>
                      </div>
                  ) : (
                    !is_edit_status &&  status == 2 ? (
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
