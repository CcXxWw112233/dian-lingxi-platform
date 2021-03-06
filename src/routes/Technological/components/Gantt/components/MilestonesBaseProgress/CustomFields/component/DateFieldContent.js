import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, DatePicker, Checkbox } from 'antd'
import { categoryIcon } from '@/routes/organizationManager/CustomFields/handleOperateModal'
import { connect } from 'dva'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  isObjectValueEqual,
  timeToTimestamp,
  timestampFormat
} from '@/utils/util'
import moment from 'moment'
@connect()
export default class DateFieldContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemValue: props.itemValue,
      itemKey: props.itemKey
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isObjectValueEqual(this.props.itemValue, nextProps.itemValue)) return
    this.setState({
      itemValue: nextProps.itemValue,
      itemKey: nextProps.itemKey
    })
  }

  getFormatter = code => {
    let formatterDatePicker = ''
    let showTime = ''
    let formatterValue = ''
    switch (code) {
      case 'YM':
        formatterDatePicker = 'YYYY-MM'
        formatterValue = 'yyyy-MM'
        showTime = false
        break
      case 'YMD':
        formatterDatePicker = 'YYYY-MM-DD'
        formatterValue = 'yyyy-MM-dd'
        showTime = false
        break
      case 'YMDH':
        formatterDatePicker = 'YYYY-MM-DD HH'
        formatterValue = 'yyyy-MM-dd hh'
        showTime = { format: 'HH' }
        break
      case 'YMDHM':
        formatterDatePicker = 'YYYY-MM-DD HH:mm'
        formatterValue = 'yyyy-MM-dd hh:mm'
        showTime = { format: 'HH:mm' }
        break
      case 'YMDHMS':
        formatterDatePicker = 'YYYY-MM-DD HH:mm:ss'
        formatterValue = 'yyyy-MM-dd hh:mm:ss'
        showTime = { format: 'HH:mm:ss' }
        break
      default:
        break
    }
    return { formatterDatePicker, formatterValue, showTime }
  }

  startDatePickerChange = timeString => {
    if (this.props.disabled) return this.props.handleUpdateModelDatas({})
    const {
      itemValue: { id }
    } = this.state
    this.props.handleUpdateModelDatas &&
      this.props.handleUpdateModelDatas({
        data: { id, field_value: timeToTimestamp(timeString) },
        type: 'update'
      })

    // console.log(timeToTimestamp(timeString));
    // console.log(timestampFormat(String(timeToTimestamp(timeString)),'yyyy-MM'));
    // this.props
    //   .dispatch({
    //     type: 'organizationManager/setRelationCustomField',
    //     payload: {
    //       id: id,
    //       field_value: timeToTimestamp(timeString)
    //     }
    //   })
    //   .then(res => {
    //     if (isApiResponseOk(res)) {
    //       this.props.handleUpdateModelDatas &&
    //         this.props.handleUpdateModelDatas({
    //           data: res.data,
    //           type: 'update'
    //         })
    //     }
    //   })
  }
  render() {
    const { itemValue, itemKey } = this.state
    const {
      field_id,
      field_value,
      id,
      field_content: {
        name,
        field_type,
        field_set: { date_field_code }
      }
    } = itemValue
    let value =
      field_value &&
      timestampFormat(
        String(field_value),
        this.getFormatter(date_field_code).formatterValue
      )
    const { onlyShowPopoverContent } = this.props
    return (
      <div
        key={id}
        className={`${
          commonStyles.custom_field_item_wrapper
        } ${onlyShowPopoverContent &&
          commonStyles.custom_field_item_wrapper_1}`}
      >
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <div className={`${commonStyles.check_box}`}>
              <Checkbox />
            </div>
            <div
              className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}
            >
              {categoryIcon(field_type).icon}
            </div>
            <div className={commonStyles.field_name} title={name}>
              {name}
            </div>
          </div>
          <div
            id={`custom_field_value_${id}`}
            className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}
          >
            <div className={commonStyles.common_select}>
              <span
                style={{
                  position: 'relative',
                  zIndex: 0,
                  minWidth: '80px',
                  display: 'inline-block',
                  color: value ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)'
                }}
              >
                {value || '????????????'}
                <DatePicker
                  // disabledDate={this.disabledStartTime.bind(this)}
                  // onOk={this.startDatePickerChange.bind(this)}
                  value={
                    value ? moment(new Date(Number(field_value))) : undefined
                  }
                  onChange={this.startDatePickerChange.bind(this)}
                  getCalendarContainer={() =>
                    document.getElementById(`custom_field_value_${id}`)
                  }
                  // placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '????????????'}
                  format={
                    this.getFormatter(date_field_code).formatterDatePicker
                  }
                  showTime={this.getFormatter(date_field_code).showTime}
                  style={{
                    opacity: 0,
                    height: '100%',
                    background: '#000000',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%'
                  }}
                />
              </span>
            </div>
          </div>
          <div className={` ${commonStyles.clear}`}>??????</div>
        </div>
      </div>
    )
  }
}
