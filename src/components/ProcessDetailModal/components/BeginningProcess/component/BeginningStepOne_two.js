import React, { Component } from 'react'
import { Select } from 'antd'
import indexStyles from '../index.less'
import { connect } from 'dva'
@connect(mapStateToProps)
export default class BeginningStepOne_two extends Component {

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent({ value: forms }, 'forms')
  }

  defaultValueChange(value) {
    let newValue = value
    if (typeof value === 'object'){
      newValue = value.join(',')
    }
    this.updateEdit({value: newValue}, 'value')
  }

  render() {
    const { itemValue } = this.props
    const { title, prompt_content, is_required, options = [], value, is_multiple_choice } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>
          <span>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</span>
        </p>
        <div className={indexStyles.text_fillOut}>
          <Select 
            mode={is_multiple_choice === '1' ? 'multiple' : ''}
            value={is_multiple_choice === '1'? value.split(',').filter(d=>d):value} 
            style={{width: '100%'}} placeholder={prompt_content}
            onChange={this.defaultValueChange.bind(this)}
          >
            {
              options.map(item => {
                return (
                  <Option value={item.id}>{item.label_name}</Option>
                )
              })
            }
          </Select>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}