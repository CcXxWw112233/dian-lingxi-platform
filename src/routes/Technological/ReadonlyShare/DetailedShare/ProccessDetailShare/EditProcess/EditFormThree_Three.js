import React from 'react'
import indexStyles from './index.less'
import { Input, Checkbox, Select, DatePicker } from 'antd'
import { timeToTimestamp } from '../../../../../../utils/util'
import moment from 'moment/moment'
import { connect } from 'dva'

const Option = Select.Option
const { MonthPicker, RangePicker } = DatePicker

@connect(mapStateToProps)
export default class EditFormThree_One extends React.Component {
  updateEdit(data, key) {
    const { itemKey } = this.props
    const { processEditDatas = [], processCurrentEditStep = 0 } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    form_data[itemKey][key] = data.value
    this.props.updateEdit({ value: form_data }, 'form_data')
  }
  propertyNameChange(e) {
    this.updateEdit({ value: e.target.value }, 'property_name')
  }
  defaultValueChange(e) {
    this.updateEdit({ value: e.target.value }, 'default_value')
  }
  isRequiredCheck(e) {
    this.updateEdit({ value: e.target.checked ? '1' : '0' }, 'is_required')
  }

  verificationRuleChange(key, value) {
    const { processEditDatas = [], processCurrentEditStep = 0 } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    const { itemKey } = this.props
    const { verification_rule } = form_data[itemKey]
    const ruleArray = verification_rule.replace('_', ',').split(',')
    ruleArray[key] = value
    const newVerificationRule = ruleArray.join(',').replace(',', '_')
    this.updateEdit({ value: newVerificationRule }, 'verification_rule')
  }

  datePickerChange(date, dateString) {
    this.updateEdit(
      { value: timeToTimestamp(dateString).toString() },
      'default_value'
    )
  }
  rangePickerChange(date, dateString) {
    this.updateEdit(
      {
        value: `${timeToTimestamp(dateString[0])},${timeToTimestamp(
          dateString[1]
        )}`
      },
      'default_value'
    )
  }

  deleteItemForm() {
    const {
      processEditDatas = [],
      processCurrentEditStep = 0,
      dispatch
    } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    const { itemKey } = this.props
    let new_processEditDatas = [...processEditDatas]
    let new_form_data = [...form_data]
    new_form_data.splice(itemKey, 1)
    new_processEditDatas[processCurrentEditStep]['form_data'] = new_form_data
    dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        processEditDatas: new_processEditDatas
      }
    })
  }
  render() {
    const { processEditDatas = [], processCurrentEditStep = 0 } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    const { itemKey } = this.props
    const {
      property_name,
      default_value,
      verification_rule,
      val_length,
      is_required
    } = form_data[itemKey]

    //??????
    const ruleArray = verification_rule.replace('_', ',').split(',')
    const mode_0 = ruleArray[0]
    const mode_1 = ruleArray[1]
    //??????
    const timeArray = (default_value && default_value.split(',')) || []
    const startTime = timeArray[0]
    const endTime = timeArray[1]

    return (
      <div className={indexStyles.EditFormThreeOneOut}>
        <div
          className={indexStyles.EditFormThreeOneOut_delete}
          onClick={this.deleteItemForm.bind(this)}
        >
          <div></div>
        </div>
        <div className={indexStyles.EditFormThreeOneOut_form}>
          <div className={indexStyles.EditFormThreeOneOut_form_left}></div>
          <div className={indexStyles.EditFormThreeOneOut_form_right}>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>??????</p>
              <Input
                value={property_name}
                style={{ width: 68, height: 24 }}
                onChange={this.propertyNameChange.bind(this)}
              />
            </div>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>??????</p>
              <Select
                value={mode_0}
                style={{ width: 74 }}
                size={'small'}
                onChange={this.verificationRuleChange.bind(this, 0)}
              >
                <Option value="SINGLE">??????</Option>
                <Option value="MULTI">??????</Option>
              </Select>
            </div>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>?????????</p>
              <Select
                value={mode_1}
                style={{ width: 110 }}
                size={'small'}
                onChange={this.verificationRuleChange.bind(this, 1)}
              >
                <Option value="DATE_TIME">?????? + ??????</Option>
                <Option value="DATE">??????</Option>
              </Select>
            </div>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>?????????</p>
              {mode_0 === 'SINGLE' ? (
                <DatePicker
                  style={{ width: 110, height: 24 }}
                  size={'small'}
                  showTime={mode_1 === 'DATE_TIME'}
                  allowClear={false}
                  format={
                    mode_1 === 'DATE_TIME' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
                  }
                  placeholder=""
                  value={
                    startTime ? moment(new Date(Number(startTime))) : undefined
                  } // [moment(new Date(signUpStartTime)), moment(new Date(signUpEndTime))]
                  onChange={this.datePickerChange.bind(this)}
                />
              ) : (
                <RangePicker
                  size={'small'}
                  style={{ width: 110, height: 24 }}
                  showTime={
                    mode_1 === 'DATE_TIME' ? { format: 'HH:mm' } : false
                  }
                  format={
                    mode_1 === 'DATE_TIME' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
                  }
                  placeholder={[]}
                  value={
                    startTime && endTime
                      ? [
                          moment(new Date(Number(startTime))),
                          moment(new Date(Number(endTime)))
                        ]
                      : undefined
                  }
                  onChange={this.rangePickerChange.bind(this)}
                />
              )}
            </div>
            <div
              className={indexStyles.EditFormThreeOneOutItem}
              style={{ textAlign: 'center' }}
            >
              <p>??????</p>
              <Checkbox
                onChange={this.isRequiredCheck.bind(this)}
                checked={is_required === '1'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps({
  projectDetailProcess: {
    datas: { processEditDatas = [], processCurrentEditStep }
  }
}) {
  return {
    processEditDatas,
    processCurrentEditStep
  }
}
