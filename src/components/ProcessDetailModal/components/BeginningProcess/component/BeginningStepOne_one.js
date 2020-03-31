import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, message } from 'antd'
import indexStyles from '../index.less'
import { validateTel, validateEmail, validatePassword, validateFixedTel, validateIdCard, validateChineseName, validatePostalCode, validateWebsite, validateQQ, validatePositiveInt, validateNegative, validateTwoDecimal, } from '../../../../../utils/verify'

@connect(mapStateToProps)
export default class BeginningStepOne_one extends Component {

  state = {
    verificationIsTrue: true, //是否校验成功
  }

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('forms', forms)
  }

  defaultValueChange(e, verification_rule) {
    const { itemValue } = this.props
    const { val_min_length, val_max_length } = itemValue
    if (e.target.value.trimLR() == '') {
      this.updateEdit({ value: '' }, 'value')
      return
    }
    if (verification_rule == '') {
      if (e.target.value.length < val_min_length) {
        message.warn(`最少不能少于${val_min_length}字`)
      } else if (e.target.value.length > val_min_length && e.target.value.length < val_max_length) {
        this.setState({
          verificationIsTrue: this.validate(verification_rule, e.target.value)
        })
        this.updateEdit({ value: e.target.value }, 'value')
        return
      } else if (e.target.value.length > val_max_length) {
        message.warn(`最多不能超过${val_max_length}字`)
        return
      }
    }
    this.setState({
      verificationIsTrue: this.validate(verification_rule, e.target.value)
    })

    this.updateEdit({ value: e.target.value }, 'value')
  }

  validate(verification_rule, value) {
    let valiResult
    const { itemValue } = this.props
    const { val_min_length, val_max_length } = itemValue
    switch (verification_rule) {
      case '':
        if ( value.length >= val_min_length && value.length <= val_max_length) {
          valiResult = true
        } else {
          valiResult = false
        }
        break;
      case 'mobile':
        valiResult = validateTel(value)
        break;
      case 'tel':
        valiResult = validateFixedTel(value)
        break;
      case 'ID_card':
        valiResult = validateIdCard(value)
        break;
      case 'chinese_name':
        valiResult = validateChineseName(value)
        break;
      case 'url':
        valiResult = validateWebsite(value)
        break;
      case 'qq':
        valiResult = validateQQ(value)
        break;
      case 'postal_code':
        valiResult = validatePostalCode(value)
        break;
      case 'positive_integer':
        valiResult = validatePositiveInt(value)
        break;
      case 'negative':
        valiResult = validateNegative(value)
        break;
      case 'two_decimal_places':
        valiResult = validateTwoDecimal(value)
        break;
      default:
        valiResult = true
        break
    }
    return valiResult
  }

  filterVerificationName = (verification_rule) => {
    let name = '不限格式'
    switch (verification_rule) {
      case '':
        name = ''
        break;
      case 'mobile':
        name = '手机号码'
        break;
      case 'tel':
        name = '座机'
        break;
      case 'ID_card':
        name = '身份证'
        break;
      case 'chinese_name':
        name = '中文名'
        break;
      case 'url':
        name = '网址'
        break;
      case 'qq':
        name = 'qq号码'
        break;
      case 'postal_code':
        name = '邮政编码'
        break;
      case 'positive_integer':
        name = '正整数'
        break;
      case 'negative':
        name = '负数'
        break;
      case 'two_decimal_places':
        name = '精确到两位小数'
        break;
      default:
        name = ''
        break
    }
    return name
  }

  render() {
    const { verificationIsTrue } = this.state
    const { itemValue } = this.props
    const { title, prompt_content, is_required, value, val_min_length, val_max_length, verification_rule } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>
          <span>
            {title}{verification_rule == '' ? '' : <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: '12px' }}>&nbsp;[{this.filterVerificationName(verification_rule)}]</span>}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}
          </span>
          {verification_rule != '' && <span style={{ color: '#F5222D', display: verificationIsTrue ? 'none' : 'block' }}>格式错误，请重新填写！</span>}
        </p>

        <div className={indexStyles.text_fillOut}>
          <Input maxLength={50} style={{ border: verification_rule == '' || verificationIsTrue ? '' : '1px solid #F5222D' }} placeholder={prompt_content} value={value} onChange={(e) => { this.defaultValueChange(e, verification_rule) }}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
