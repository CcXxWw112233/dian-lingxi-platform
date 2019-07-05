import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'


@connect((informRemind = {}) => ({
    informRemind,
}))
export default class RenderHistory extends Component {

    state = {
        is_show_other_select: this.props.is_show_other_select,
        is_show_data_picker: this.props.is_show_data_picker,
    }

    // 显示 不同状态的Icon图标
    renderDiffIconStatus() {
      const { is_icon_status } = this.props;
       switch (is_icon_status) {
           case 1: // 显示正常
               return null;
                
            case 2: // 已完成
                return (
                    <div>
                        <Tooltip placement="top" title="已提醒" arrowPointAtCenter>
                          <Icon type="check-circle" className={infoRemindStyle.checked}/>
                        </Tooltip>
                    </div>
                );
            case 3: // 表示异常
                return (
                    <div>
                        <Tooltip placement="top" title="已失效" arrowPointAtCenter>
                          <Icon type="exclamation-circle" className={infoRemindStyle.overdue} />
                        </Tooltip>
                    </div>
                );
            case 4: // 表示正常
                return null;
       } 
    }
    

    render() {
        // console.log(this.props)
        const { is_show_other_select, is_show_data_picker, } = this.state;
        const {
            triggerList = [], diff_text_term = [], diff_remind_time = [], historyList = [], is_edit_status, currentId,
            handleTriggerChg
        } = this.props;
        return (
            <div className={infoRemindStyle.content}>
                    {
                      historyList && historyList.length && historyList.map(item => {
                        return (
                          <div id={item.id} className={infoRemindStyle.slip}
                          >
                            <div className={infoRemindStyle.select}>
                              {/* 显示某种事件类型的列表--选择框 */}
                              <Select
                                  defaultValue={item.remind_trigger}
                                  style={{ width: 122, height: 32, marginRight: 16 }}>
                                  {
                                    triggerList && triggerList.length && triggerList.map(chileItrem => {
                                      return ( 
                                        <Option 
                                          onClick={handleTriggerChg.bind(this,item.id,chileItrem.remind_edit_type, chileItrem.type_code)}
                                          value={chileItrem.type_code}>{chileItrem.type_name}</Option>
                                      )      
                                    })
                                  }
                              </Select>
                              {/* 显示自定义时间 */}
                              {
                                is_show_data_picker && item.remind_edit_type == 3 && <DatePicker />
                              }
                              {/* 显示1-60不同的时间段--选择框 */}
                              {
                                is_show_other_select && item.remind_edit_type == 1 && <Select 
                                    onChange={this.handleChgOption} 
                                    defaultValue={item.remind_time_value} 
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
                                is_show_other_select && item.remind_edit_type == 1 && <Select 
                                    onChange={this.handleChgOption}
                                    defaultValue={item.remind_time_type} 
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
                            {/* 鼠标的移入移出事件 控制删除小图标的显示隐藏 */}
                            {
                              is_edit_status == 0 ? (
                                <div className={infoRemindStyle.slip_hover}>
                                    <Tooltip placement="top" title="删除" arrowPointAtCenter>
                                        <Icon type="delete" className={infoRemindStyle.del}/>
                                    </Tooltip>
                                </div>
                              ) : (
                                  currentId == item.id ? (
                                      <Button type="primary">确定</Button>
                                  ) : (
                                    <div className={infoRemindStyle.slip_hover}>
                                        <Tooltip placement="top" title="删除" arrowPointAtCenter>
                                            <Icon type="delete" className={infoRemindStyle.del}/>
                                        </Tooltip>
                                    </div>
                                  )
                              )
                            }
                            {/* 显示不同状态的小图标 */}
                            {
                                item.status == 3 ? (
                                    <div>
                                        <Tooltip placement="top" title="已失效" arrowPointAtCenter>
                                          <Icon type="exclamation-circle" className={infoRemindStyle.overdue} />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    item.status == 1 || item.status == 4 ? (
                                        null
                                    ) : (
                                        <div>
                                            <Tooltip placement="top" title="已提醒" arrowPointAtCenter>
                                              <Icon type="check-circle" className={infoRemindStyle.checked}/>
                                            </Tooltip>
                                        </div>
                                    )
                                )
                            }
                            
                          </div>
                        )
                      })
                    }
                    
                    
                    {/* 根据不同的字段来显示不同的状态图标以及不同的选择框状态 */}
                    {/* {
                       is_icon_status && is_icon_status != 1 ? (// 表示不正常
                        <div>
                          <Tooltip placement="top" title="已失效" arrowPointAtCenter>
                            <Icon type="exclamation-circle" className={infoRemindStyle.overdue} />
                          </Tooltip>
                        </div>
                        ) : ( // 表示正常
                        <div>
                          <Tooltip placement="top" title="已提醒" arrowPointAtCenter>
                            <Icon type="check-circle" className={infoRemindStyle.checked}/>
                          </Tooltip>
                        </div>
                        )
                    } */}
            </div>
        )
    }
}
