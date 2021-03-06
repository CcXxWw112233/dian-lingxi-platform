import React from 'react'
import indexStyles from './index.less'
import { Input, Checkbox, Select, InputNumber } from 'antd'
import { connect } from 'dva'

const Option = Select.Option

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
  valLengthChange(value) {
    this.updateEdit({ value: value.toString() }, 'val_length')
  }
  isRequiredCheck(e) {
    this.updateEdit({ value: e.target.checked ? '1' : '0' }, 'is_required')
  }
  verificationRuleChange(value) {
    this.updateEdit({ value: value }, 'verification_rule')
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
              <p>????????????</p>
              <Input
                value={default_value}
                style={{ width: 144, height: 24 }}
                onChange={this.defaultValueChange.bind(this)}
              />
            </div>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>????????????</p>
              <Select
                value={verification_rule}
                style={{ width: 106 }}
                size={'small'}
                onChange={this.verificationRuleChange.bind(this)}
              >
                <Option value="">???????????????</Option>
                <Option value="mobile">????????????</Option>
                <Option value="tel">??????</Option>
                <Option value="ID_card">???????????????</Option>
                <Option value="chinese_name">????????????2-6????????????</Option>
                <Option value="url">??????</Option>
                <Option value="qq">QQ???</Option>
                <Option value="postal_code">????????????</Option>
                <Option value="positive_integer">?????????</Option>
                <Option value="negative">??????</Option>
                <Option value="two_decimal_places">?????????????????????</Option>
              </Select>
            </div>
            <div className={indexStyles.EditFormThreeOneOutItem}>
              <p>??????</p>
              <InputNumber
                min={1}
                value={Number(val_length)}
                onChange={this.valLengthChange.bind(this)}
                size={'small'}
                style={{ width: 46 }}
              />
              {/*<Input style={{width: 36, height: 24}}/>*/}
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
    datas: { processEditDatas = [], processCurrentEditStep = 0 }
  }
}) {
  return {
    processEditDatas,
    processCurrentEditStep
  }
}
