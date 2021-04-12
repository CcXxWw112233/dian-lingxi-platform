import { Calendar, Input, Radio, Select } from 'antd'
import React from 'react'
import styles from './index.less'
import moment from 'moment'

/** 日历计划功能组件 */
export default class CalendarPlan extends React.Component {
  constructor(props) {
    super(props)
    /** 定义的年份mode */
    this.modeYear = 'year'
    /** 定义的月份mode */
    this.modeMonth = 'month'
    /** 最小的年份范围 */
    this.minYearNumber = 10
    /** 最大的年份范围 */
    this.maxYearNumber = 9
    this.state = {
      /** 日历模式 */
      mode: this.modeMonth,
      /** 设定的默认日历日期 */
      calendarValue: moment(),
      /** 选中的年 */
      selectedYear: moment().year(),
      /** 选中的月 */
      selectedMonth: moment().month() + 1,
      /** 选中的日 */
      selectedDay: moment().date()
    }
    /** 月份列表 */
    this.monthList = (() =>
      new Array(12).fill(0).map((_, i) => {
        return {
          label: i + 1 + '月',
          key: i + 1
        }
      }))()
    /** 年份列表 */
    this.years = (() => {
      /** 当前年份 */
      const nowY = moment().year()
      /** 最小的年份 */
      const minY = nowY - this.minYearNumber
      /** 最大的年份 */
      const maxY = nowY + this.maxYearNumber
      /** 最小年份合集 */
      const minYears = []
      /** 最大年份合集 */
      const maxYears = []
      for (let index = nowY; index >= minY; index--) {
        minYears.unshift(index)
      }
      for (let index = nowY + 1; index <= maxY; index++) {
        maxYears.push(index)
      }
      return [...new Set([...minYears, ...maxYears])]
    })()
  }

  /** 日历切换事件
   * @param {moment.Moment} value 时间
   * @param {'month' | 'year'} mode 模式
   */
  onPanelChange = (value, mode) => {
    console.log(value, mode)
  }

  /** 添加一个0 */
  addZero = number => {
    return +number < 10 ? '0' + number : number
  }

  /** 点击了日期时间，更新选中的日历
   * @param {moment.Moment} date 选中的日历
   */
  handleDate = date => {
    const day = date.date()
    this.setState({
      calendarValue: date,
      selectedYear: date.year(),
      selectedMonth: date.month() + 1,
      selectedDay: day
    })
  }

  /** 日历模式切换
   * @param {Event} e
   */
  handleModeChange = e => {
    const value = e.target.value
    this.setState({
      mode: value
    })
  }

  /** 月份更新
   * @param {number} value 选择的月份
   */
  handleChangeMonth = value => {
    const timeString = `${this.state.selectedYear}${this.addZero(
      value
    )}${this.addZero(this.state.selectedDay)}`
    const date = moment(timeString, 'YYYYMMDD')
    this.setState({
      calendarValue: date,
      selectedMonth: value
    })
  }

  /** 年份更新
   * @param {number} value 选择的年份
   */
  handleChangeYear = value => {
    const timeString = `${value}${this.addZero(
      this.state.selectedMonth
    )}${this.addZero(this.state.selectedDay)}`
    const date = moment(timeString, 'YYYYMMDD')
    this.setState({
      calendarValue: date,
      selectedYear: value
    })
  }

  render() {
    const { workbenchBoxContent_height } = this.props
    return (
      <div
        className={styles.container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.heander_search}>
          <div className={styles.serach_forms}>
            <Input style={{ width: 200, marginRight: 10 }} placeholder="分组" />
            <Input style={{ width: 200, marginRight: 10 }} placeholder="星际" />
            <Input style={{ width: 200, marginRight: 10 }} placeholder="区域" />
            <Input style={{ width: 200, marginRight: 10 }} placeholder="搜索" />
          </div>
          <div className={styles.calendarSelection}>
            <Select
              defaultValue={this.state.selectedYear}
              style={{ marginRight: 10 }}
              value={this.state.selectedYear}
              onChange={this.handleChangeYear}
            >
              {this.years.map(item => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}年
                  </Select.Option>
                )
              })}
            </Select>
            <Select
              defaultValue={this.state.selectedMonth}
              style={{ marginRight: 10 }}
              value={this.state.selectedMonth}
              onChange={this.handleChangeMonth}
            >
              {this.monthList.map(item => {
                return (
                  <Select.Option value={item.key} key={item.key}>
                    {item.label}
                  </Select.Option>
                )
              })}
            </Select>
            <Radio.Group
              value={this.state.mode}
              onChange={this.handleModeChange}
            >
              <Radio.Button value={this.modeMonth}>月</Radio.Button>
              <Radio.Button value={this.modeYear}>年</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.content_left_tree}></div>
          <div className={styles.content_calendar}>
            <Calendar
              className={styles.calendar}
              onPanelChange={this.onPanelChange}
              mode={this.state.mode}
              value={this.state.calendarValue}
              onSelect={this.handleDate}
            />
          </div>
        </div>
      </div>
    )
  }
}
