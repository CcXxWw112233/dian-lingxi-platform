import React, { Component } from 'react'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';

@connect(mapStateToProps)
export default class BeginningStepThree_one extends Component {

  constructor(props) {
    super(props)
    this.state = {
      score_items: props.itemValue && props.itemValue.score_items ? JSON.parse(JSON.stringify(props.itemValue.score_items || [])) : [],
      clientWidth: document.getElementById(`ratingItems_${props.itemKey}`) ? document.getElementById(`ratingItems_${props.itemKey}`).clientWidth : 800,
    }
    this.resizeTTY = this.resizeTTY.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeTTY);
  }
  resizeTTY = () => {
    const { itemKey } = this.props
    const clientWidth = document.getElementById(`ratingItems_${itemKey}`) ? document.getElementById(`ratingItems_${itemKey}`).clientWidth - 200 : document.documentElement.clientWidth
    this.setState({
      clientWidth
    })
  }


  updateState = (data, index) => {
    const { value, key, isNotUpdateModelDatas } = data
    const { score_items = [] } = this.state
    let new_data = [...score_items]
    new_data[index][key] = value
    this.setState({
      score_items: new_data
    })
    if (!isNotUpdateModelDatas) {
      this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('score_items', new_data)
    }
  }

  // 分数点击事件
  handleChangeRatingGrade = (e, i) => {
    e && e.stopPropagation()
    const { score_items = [] } = this.state
    let new_data = [...score_items]
    new_data = new_data.map((item, index) => {
      let new_item = { ...item }
      if (i == index) {
        new_item = { ...item, is_click_rating_grade: true }
      } else {
        new_item = { ...item, is_click_rating_grade: false }
      }
      return new_item
    })
    this.setState({
      score_items: new_data
    })
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('score_items', new_data)
    // this.updateState({ value: true, key: 'is_click_rating_grade' }, i)
  }

  // 保留n位小数
  roundFun = (value, n) => {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
  }

  handleChangeRatingGradeValue = (e, i) => {
    e && e.stopPropagation()
    let value = e.target.value
    // if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
    //   console.log(e.target.value,'sssssssssssssssssssss_value')
    //   this.updateState({ value: e.target.value, key: 'max_score', isNotUpdateModelDatas: true }, i)
    // }
    if (value == '' || value.trimLR() == '') {
      this.updateState({ value: '', key: 'value', isNotUpdateModelDatas: true }, i)
      return
    }
    this.updateState({ value: value, key: 'value', isNotUpdateModelDatas: true }, i)
  }

  handleChangeRatingGradeBlur = (e, i) => {
    e && e.stopPropagation()
    let value = e.target.value
    const reg = /^([1-9]\d{0,2}(\.\d{1,2})?|1000)$/
    if (reg.test(value) && value != '' && String(value).trimLR() != '') {
      this.updateState({ value: value, key: 'value' }, i)
      this.updateState({ value: false, key: 'is_click_rating_grade' }, i)
    } else {
      this.updateState({ value: '', key: 'value' }, i)
    }
  }

  whetherShowDiffWidth = () => {
    const { score_items = [] } = this.state
    let flag = false
    for (let i = 0; i < score_items.length; i++) {
      if (i % 4 == 0 || i % 2 == 0) {
        flag = true
        break
      }
    }
    return flag
  }

  renderRatingDetailContent = () => {
    return (
      <div style={{ width: '260px', height: '206px', overflowY: 'auto' }} className={globalStyles.global_vertical_scrollbar}>
        <table border={1} style={{ borderColor: '#E9E9E9' }} width="100%">
          <tr style={{ height: '32px', border: '1px solid #E9E9E9', textAlign: 'center', background: '#FAFAFA', color: 'rgba(0,0,0,0.45)' }}>
            <th style={{ width: '98px' }}>标题</th>
            <th style={{ width: '70px' }}>
              权重占比
            </th>
            <th style={{ width: '58px' }}>
              最高分值
            </th>
          </tr>
          <tr style={{ height: '32px', border: '1px solid #E9E9E9', textAlign: 'center', fontSize: '14px', color: 'rgba(0,0,0,0.65)' }}>
            <td style={{maxWidth: '78px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>lover lover lover lover</td>
            <td>70%</td>
            <td>98.5</td>
          </tr>
        </table>
      </div>
    )
  }

  renderRatingPersonSuggestion = () => {
    const { avatar } = this.props
    return (
      <div>
        <div className={indexStyles.appListWrapper}>
          <div className={indexStyles.app_left}>
            <div className={indexStyles.approve_user} style={{ position: 'relative', marginRight: '16px' }}>
              {/* <div className={indexStyles.defaut_avatar}></div> */}
              {
                avatar ? (
                  <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar} />
                ) : (
                    <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={defaultUserAvatar} />
                  )
              }
            </div>
            <div style={{ position: 'relative' }}>
              <span>{'刘晓华'}</span>
              <span style={{ color: '#1890FF', margin: '0 8px' }}>95.21</span>
              <Popover getPopupContainer={triggerNode => triggerNode.parentNode} placement="rightTop" content={this.renderRatingDetailContent()} title={<div>评分详情</div>}>
                <span style={{ color: '#1890FF', fontSize: '16px', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe7b4;</span>
              </Popover>
              <div style={{ color: 'rgba(0,0,0,0.25)' }}>(未填写意见)</div>
            </div>
          </div>
          <div className={indexStyles.app_right}>2020/04/02 09:20</div>
        </div>
      </div>
    )
  }

  render() {
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData: { data = [], board_id, org_id } } = this.props
    const { enable_weight } = itemValue
    const { score_items = [], clientWidth } = this.state
    let flag = this.whetherShowDiffWidth()
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', marginTop: '16px', padding: '16px 14px' }}>
          <div className={indexStyles.ratingItems}>
            {
              score_items && score_items.map((item, index) => {
                const { title, description, max_score, weight_ratio, is_click_rating_grade, value } = item
                return (
                  <div key={item} className={`${indexStyles.rating_itemsValue} ${flag && score_items.length > 1 ? indexStyles.rating_active_width : indexStyles.rating_normal_width}`}>
                    <p>
                      <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer', display: 'inline-block' }}>
                        <Tooltip title={title} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <span style={{ marginRight: '9px', display: 'inline-block', maxWidth: clientWidth && !(flag && score_items.length > 1) ? clientWidth + 'px' : '130px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', verticalAlign: 'middle' }}>{title}</span>:
                        </Tooltip>
                        {
                          enable_weight == '1' && (
                            <Tooltip overlayStyle={{ minWidth: '116px' }} title={`权重占比: ${weight_ratio}%`} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                              <span className={indexStyles.rating_weight}>&nbsp;&nbsp;{`*${weight_ratio}%`}</span>
                            </Tooltip>
                          )
                        }
                      </span>
                      {
                        description != '' ? (
                          <Popover title={<div style={{ margin: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px', whiteSpace: 'nowrap' }}>{title}</div>} content={<div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', maxWidth: '130px' }}>{description}</div>} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                            <span style={{ color: '#1890FF', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe84a;</span>
                          </Popover>
                        ) : ('')
                      }
                    </p>
                    {
                      is_click_rating_grade ? (
                        <div>
                          <Input autoFocus={true} value={value} onBlur={(e) => { this.handleChangeRatingGradeBlur(e, index) }} onChange={(e) => { this.handleChangeRatingGradeValue(e, index) }} className={indexStyles.rating_input} />
                        </div>
                      ) : (
                          value ? (
                            <div onClick={(e) => { this.handleChangeRatingGrade(e, index) }} className={indexStyles.rating_grade}>
                              <span className={indexStyles.rating_input}>{value}</span>
                            </div>
                          ) : (
                              <div onClick={(e) => { this.handleChangeRatingGrade(e, index) }} className={indexStyles.rating_grade}>
                                <span>最高<span className={indexStyles.rating_grade_value}>{max_score}</span>分</span>
                              </div>
                            )
                        )
                    }

                  </div>
                )
              })
            }
          </div>
          {/* 评分人意见以及分数详情 */}
          <div>
            {this.renderRatingPersonSuggestion()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}