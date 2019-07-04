// 渲染内容的组件
import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button, DatePicker } from 'antd'
import infoRemindStyle from '../index.less'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

let timer;

@connect(({informRemind = []}) => ({
    informRemind,
}))
export default class RenderContent extends Component {

    state = {
      is_show_other_select: true, // 是否显示其他选择框 默认为 true 显示
      is_show_data_picker: false, // 是否是自定义时间 显示日历框 默认为 false 不显示
      diff_remind_time: [
        { remind_time_value: 1 },
        { remind_time_value: 2 },
        { remind_time_value: 3 },
        { remind_time_value: 4 },
        { remind_time_value: 5 },
        { remind_time_value: 6 },
        { remind_time_value: 7 },
        { remind_time_value: 8 },
        { remind_time_value: 9 },
        { remind_time_value: 10 },
      ], // 1-60不同的时间段
      diff_text_term: [
        { remind_time_type: 'm', txtVal: '分钟' },
        { remind_time_type: 'h', txtVal: '小时' },
        { remind_time_type: 'd', txtVal: '天数' },
      ], // 匹配不同的字段类型
      select_field_type: '', // 选择 小时 分钟 天数的字段类型
      display: 'none', // 控制删除小图标的显示隐藏
    }

    /**
     * 改变选项的类型切换的方法
     * 如果 `remind_edit_type` 为1 就显示后面两项
     * 如果 `remind_edit_type` 为2 | 3  就不显示后面两项
     * 注意 `remind_edit_type` 为3 的时候,需要显示日历来选择时间 并将结果转换成时间戳
     * @param {String} type 类型
     */ 
    handleTriggerChg(type, code) {
      const { dispatch } = this.props;
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
          remind_trigger: code,
        }
      })
    }

    /**
     * 点击确定的事件
     * @param {*} value 
     */
    handleChecked = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'informRemind/setRemindInformation',
        payload: {

        }
      })
    }

    /**
     * handleDatePickerChg 自定义时间的选项
     */
    handleDatePickerChg(value) {
      console.log(value)
    }

    /**
     * 父级的鼠标移入事件 来控制删除图标的显示隐藏
     */
    onMouseParentEnter(pId) {
      const { informRemind } = this.props;
      const { historyList = [] } = informRemind;
      let temp = historyList.filter(item => {
        if (item.id == pId) {
          return true
        }
      })
      console.log(temp)
      if (temp[0].id == pId) {
        this.setState({
          display: 'block'
        })
      }
    }

    /**
     * 父级的鼠标移出事件
     */
    onMouseParentLeave(pId) {
      this.setState({
        display: 'none'
      })
    }

    /**
     * 每一个子级选项的移入事件
     */
    onMouseChildEnter(e) {
      e.stopPropagation()
      this.setState({
        display: 'block'
      })
    }

    // select的onChange事件
    handleChgOption = (e) => {
      this.setState({
        display: 'none'
      })
    }

    // 不同时间的选择
    onDiffRemindTime(value) {
      console.log(value)
      const { dispatch } = this.props;
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          remind_time_value: value
        }
      })
    }

    // 不同的字段选择
    onDiffTextTerm(type) {
      const { dispatch } = this.props;
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          remind_time_type: type,
        }
      })
    }

    // 展示是否存在历史记录的界面
    renderHistory() {
        const { is_show_other_select, is_show_data_picker, diff_text_term, diff_remind_time, display } = this.state;
        const { informRemind } = this.props;
        const { triggerList = [], is_icon_status, defaultTriggerVal, historyList = [], defaultRemindTimeVal, defaultTextTermVal } = informRemind
        console.log(historyList)
        return (
            <div className={infoRemindStyle.content}>
                    {
                      historyList && historyList.length && historyList.map(item => {
                        return (
                          <div id={item.id} className={infoRemindStyle.slip}
                            onMouseEnter={() => { this.onMouseParentEnter(item.id) }}
                            onMouseLeave={() => { this.onMouseParentLeave(item.id) }}
                          >
                            <div className={infoRemindStyle.select}>
                              {/* 显示某种事件类型的列表--选择框 */}
                              <Select
                                  defaultValue={defaultTriggerVal}
                                  onChange={this.handleChgOption}
                                  onMouseEnter={(e) => { this.onMouseChildEnter(e) }}
                                  style={{ width: 122, height: 32, marginRight: 16 }}>
                                  {
                                    triggerList && triggerList.length && triggerList.map(item => {
                                      return ( 
                                        <Option 
                                          onClick={() => { this.handleTriggerChg(item.remind_edit_type) }}
                                          value={item.type_code}>{item.type_name}</Option>
                                      )      
                                    })
                                  }
                              </Select>
                              {/* 显示自定义时间 */}
                              {
                                is_show_data_picker && <DatePicker onChange={ (value) => { this.handleDatePickerChg(value) } } />
                              }
                              {/* 显示1-60不同的时间段--选择框 */}
                              {
                                is_show_other_select && <Select 
                                    onChange={this.handleChgOption} 
                                    onMouseEnter={(e) => { this.onMouseChildEnter(e) }} 
                                    defaultValue={defaultRemindTimeVal} 
                                    style={{ width: 122, height: 32, marginRight: 16 }}>
                                  {
                                    diff_remind_time.map(item => {
                                      return (
                                        <Option
                                          onClick={() => { this.onDiffRemindTime(item.remind_time_value) }} 
                                          value={item.remind_time_value}>{item.remind_time_value}</Option>
                                      )
                                    })
                                  }
                                </Select>
                              }
                              {/* 显示 分钟 小时 天数 的列表--选择框 */}
                              {
                                is_show_other_select && <Select 
                                    onChange={this.handleChgOption}
                                    onMouseEnter={(e) => { this.onMouseChildEnter(e) }} 
                                    defaultValue={defaultTextTermVal} 
                                    style={{ width: 122, height: 32, marginRight: 16 }}>
                                  {
                                    diff_text_term.map(item => {
                                      return (
                                        <Option 
                                          value={item.remind_time_type}>{item.txtVal}</Option>
                                      )
                                    })
                                  }
                                </Select>
                              }
                            </div>
                            {/* 鼠标的移入移出事件 控制删除小图标的显示隐藏 */}
                            <div style={{ display: display }}>
                                <Tooltip placement="top" title="删除" arrowPointAtCenter>
                                    <Icon type="delete" className={infoRemindStyle.del}/>
                                </Tooltip>
                            </div>
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

    // 展示添加的内容样式
    renderAdd() {
      const { is_show_other_select, is_show_data_picker, diff_text_term, diff_remind_time, display } = this.state;
      const { informRemind } = this.props;
      const { is_add_remind, defaultTriggerVal, triggerList = [], } = informRemind;
        return (
          <div className={infoRemindStyle.content}
          >
                  <div className={infoRemindStyle.select}>
                    {/* 显示某种事件类型的列表--选择框 */}
                    <Select
                        defaultValue={defaultTriggerVal}
                        onChange={this.handleChgOption}
                        style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                          triggerList && triggerList.length && triggerList.map(item => {
                            return ( 
                              <Option
                                onClick={() => { this.handleTriggerChg(item.remind_edit_type, item.type_code) }}
                                value={item.type_code}>{item.type_name}</Option>
                            )      
                          })
                        }
                    </Select>
                    {/* 显示自定义时间 */}
                    {
                      is_show_data_picker && <DatePicker onChange={ (value) => { this.handleDatePickerChg(value) } } />
                    }
                    {/* 显示1-60不同的时间段--选择框 */}
                    {
                      is_show_other_select && <Select 
                          onChange={this.handleChgOption} 
                          defaultValue="1" 
                          style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                          diff_remind_time.map(item => {
                            return (
                              <Option
                                onClick={() => { this.onDiffRemindTime(item.remind_time_value) }}  
                                value={item.remind_time_value}>{item.remind_time_value}</Option>
                            )
                          })
                        }
                      </Select>
                    }
                    {/* 显示 分钟 小时 天数 的列表--选择框 */}
                    {
                      is_show_other_select && <Select 
                          onChange={this.handleChgOption}
                          defaultValue="m" 
                          style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                          diff_text_term.map(item => {
                            return (
                              <Option
                                onClick={() => { this.onDiffTextTerm(item.remind_time_type) }} 
                                value={item.remind_time_type}>{item.txtVal}</Option>
                            )
                          })
                        }
                      </Select>
                    }
                  </div>
                  <Button 
                    onClick={this.handleChecked}
                    type="primary">确定</Button>
          </div>
        )
    }

    renderContent() {
        const { informRemind } = this.props;
        const { is_history } = informRemind;
        return is_history ? this.renderHistory() : null
    }

    render() {
        const { informRemind } = this.props;
        const { is_add_remind } = informRemind;
        return (
            <>
                { this.renderContent() }
                { is_add_remind && this.renderAdd() }
                {/* 这个删除小图标应该是每一个列表滑过的时候显示的 */}
                    {/* <div>
                        <Tooltip placement="top" title="删除" arrowPointAtCenter>
                            <Icon type="delete" className={infoRemindStyle.del}/>
                        </Tooltip>
                    </div> */}
            </>
        )
    }
}
