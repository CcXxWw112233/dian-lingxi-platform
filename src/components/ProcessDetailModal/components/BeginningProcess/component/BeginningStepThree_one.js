import React, { Component } from 'react'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { isObjectValueEqual } from '../../../../../utils/util'
import { validatePositiveInt } from '../../../../../utils/verify'

@connect(mapStateToProps)
export default class BeginningStepThree_one extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scoreList: props.itemValue && props.itemValue.scoreList ? JSON.parse(JSON.stringify(props.itemValue.scoreList || [])) : [],
    }
  }

  updateState = (data, index) => {
    const { value, key, isNotUpdateModelDatas } = data
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    new_data[index][key] = value
    this.setState({
      scoreList: new_data
    })
    if (!isNotUpdateModelDatas) {
      this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('scoreList', new_data)
    }
  }

  // 分数点击事件
  handleChangeRatingGrade = (e, i) => {
    e && e.stopPropagation()
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    new_data = new_data.map((item, index) => {
      let new_item = {...item}
      if (i == index) {
        new_item = {...item, is_click_rating_grade: true}
      } else {
        new_item = {...item, is_click_rating_grade: false}
      }
      return new_item
    })
    this.setState({
      scoreList: new_data
    })
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('scoreList', new_data)
    // this.updateState({ value: true, key: 'is_click_rating_grade' }, i)
  }

  // 保留n位小数
  roundFun = (value, n) => {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
  }

  handleChangeRatingGradeValue = (e,i) => {
    e && e.stopPropagation()
    let value = e.target.value
    // if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
    //   console.log(e.target.value,'sssssssssssssssssssss_value')
    //   this.updateState({ value: e.target.value, key: 'grade_value', isNotUpdateModelDatas: true }, i)
    // }
    if (value == '' || value.trimLR() == '') {
      this.updateState({ value: '', key: 'grade_value', isNotUpdateModelDatas: true }, i)
      return
    }
    this.updateState({ value: value, key: 'grade_value', isNotUpdateModelDatas: true }, i)
  }

  handleChangeRatingGradeBlur = (e, i) => {
    e && e.stopPropagation()
    let value = e.target.value
    const reg = /^([1-9]\d{0,2}(\.\d{1,2})?|1000)$/
    if (reg.test(value) && value != '' && String(value).trimLR() != '') {
      this.updateState({ value: value, key: 'grade_value' }, i)
      this.updateState({ value: false, key: 'is_click_rating_grade' }, i)
    } else {
      this.updateState({ value: '', key: 'grade_value' }, i)
    }
  }

  whetherShowDiffWidth = () => {
    const { scoreList = [] } = this.state
    let flag = false
    for (let i = 0; i < scoreList.length; i++) {
      if (i % 4 == 0 || i % 2 == 0) {
        flag = true
        break
      }
    }
    return flag
  }

  render() {
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData: { data = [], board_id, org_id } } = this.props
    const { weight_coefficient } = itemValue
    const { scoreList = [] } = this.state
    let flag = this.whetherShowDiffWidth()
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', marginTop: '16px', padding: '16px 14px' }}>
          <div className={indexStyles.ratingItems}>
            {
              scoreList && scoreList.map((item, index) => {
                const { title, description, grade_value, weight_value, is_click_rating_grade } = item
                return (
                  <div key={item} className={`${indexStyles.rating_itemsValue} ${flag && scoreList.length > 1 ? indexStyles.rating_active_width : indexStyles.rating_normal_width}`}>
                    <p>
                      <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer' }}>
                        <Tooltip title={title} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <span style={{ marginRight: '9px' }}>{title}:</span>
                        </Tooltip>
                        {
                          weight_coefficient == '1' && (
                            <Tooltip overlayStyle={{ minWidth: '116px' }} title={`权重占比: ${weight_value}%`} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                              <span className={indexStyles.rating_weight}>{`*${weight_value}%`}</span>
                            </Tooltip>
                          )
                        }
                      </span>
                      {
                        description != '' ? (
                          <Popover title={title} content={<div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', width: '260px' }}>{description}</div>} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                            <span style={{ color: '#1890FF', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe785;</span>
                          </Popover>
                        ) : ('')
                      }
                    </p>
                    {
                      is_click_rating_grade ? (
                        <div>
                          <Input autoFocus={true} value={grade_value} onBlur={(e) => { this.handleChangeRatingGradeBlur(e, index) }} onChange={(e) => { this.handleChangeRatingGradeValue(e, index) }} className={indexStyles.rating_input} />
                        </div>
                      ) : (
                          <div onClick={(e) => { this.handleChangeRatingGrade(e, index) }} className={indexStyles.rating_grade}>
                            <span>最高<span className={indexStyles.rating_grade_value}>{grade_value}</span>分</span>
                          </div>
                        )
                    }

                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}