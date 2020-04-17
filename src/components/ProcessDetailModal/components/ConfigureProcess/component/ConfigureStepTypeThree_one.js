import React, { Component } from 'react'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { isObjectValueEqual } from '../../../../../utils/util'

@connect(mapStateToProps)
export default class ConfigureStepTypeThree_one extends Component {

  constructor(props) {
    super(props)
    this.state = {
      localScoreList: props.itemValue && props.itemValue.scoreList ? JSON.parse(JSON.stringify(props.itemValue.scoreList || [])) : [],
      scoreList: props.itemValue && props.itemValue.scoreList ? JSON.parse(JSON.stringify(props.itemValue.scoreList || [])) : [],
      is_add_description: false, // 是否是在添加说明 false 表示不在 true表示进入说明状态
      currentSelectItemIndex: '', // 当前选中的元素下标
      currentSelectItemDescription: '', // 当前选择的元素的描述内容
    }
  }

  initData = () => {
    this.setState({
      is_add_description: false, // 是否是在添加说明 false 表示不在 true表示进入说明状态
      currentSelectItemIndex: '', // 当前选中的元素下标
      currentSelectItemDescription: '', // 当前选择的元素的描述内容
    })
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
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_data }, 'scoreList')
    }
  }

  // 是否开启权重
  handleWeightChange = (checked) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: checked ? '1' : '0' }, 'weight_coefficient')
  }

  titleResize = (key) => {
    if (!this.refs && !this.refs[`autoTitleTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    this.refs[`autoTitleTextArea_${key}`].style.height = '38px';

    // 如果高度不够，再重新设置
    if (this.refs[`autoTitleTextArea_${key}`].scrollHeight >= this.refs[`autoTitleTextArea_${key}`].offsetHeight) {
      this.refs[`autoTitleTextArea_${key}`].style.height = this.refs[`autoTitleTextArea_${key}`].scrollHeight + 'px'
    }
  }

  gradeResize = (key) => {
    if (!this.refs && !this.refs[`autoGradeTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    this.refs[`autoGradeTextArea_${key}`].style.height = '38px';

    // 如果高度不够，再重新设置
    if (this.refs[`autoGradeTextArea_${key}`].scrollHeight >= this.refs[`autoGradeTextArea_${key}`].offsetHeight) {
      this.refs[`autoGradeTextArea_${key}`].style.height = this.refs[`autoGradeTextArea_${key}`].scrollHeight + 'px'
    }
  }

  weightResize = (key) => {
    if (!this.refs && !this.refs[`autoWeightTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    this.refs[`autoWeightTextArea_${key}`].style.height = '38px';

    // 如果高度不够，再重新设置
    if (this.refs[`autoWeightTextArea_${key}`].scrollHeight >= this.refs[`autoWeightTextArea_${key}`].offsetHeight) {
      this.refs[`autoWeightTextArea_${key}`].style.height = this.refs[`autoWeightTextArea_${key}`].scrollHeight + 'px'
    }
  }

  // 表示是标题的输入变化
  handleAutoTitleTextArea = (e, key, i) => {
    let val = e.target.value
    if (val.trimLR() == '') {
      this.updateState({ value: '', key: 'title' }, i)
      return
    }
    this.updateState({ value: val, key: 'title' }, i)
    if (this.refs && this.refs[`autoTitleTextArea_${key}`]) {
      this.titleResize(key)
    }
  }

  // 表示是输入分值的内容变化
  handleAutoGradeTextArea = (e, key, i) => {
    let val
    if (isNaN(e.target.value)) {
      val = ''
    } else {
      if (e.target.value > 1000) {
        val = ''
      } else {
        val = e.target.value
      }
    }
    this.updateState({ value: val, key: 'grade_value' }, i)
    if (this.refs && this.refs[`autoGradeTextArea_${key}`]) {
      this.gradeResize(key)
    }
  }

  // 表示是输入权重的内容变化
  handleChangeAutoWeightTextArea = (e, key, i) => {
    let val
    if (isNaN(e.target.value)) {
      val = ''
    } else {
      val = e.target.value
    }
    this.updateState({ value: val, key: 'weight_value' }, i)
    if (this.refs && this.refs[`autoWeightTextArea_${key}`]) {
      this.weightResize(key)
    }
  }

  handleAddTableItems = (e) => {
    e && e.stopPropagation()
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    let obj = {
      "key": new_data.length.toString(),
      "title": "评分项",
      "weight_value": '100',
      "grade_value": '100',
      "description": '',
    }
    new_data.push(obj)
    this.setState({
      scoreList: new_data
    })
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_data }, 'scoreList')
  }

  handleChangeMenuItem = (e, index) => {
    const { key, domEvent } = e
    domEvent.stopPropagation()
    switch (key) {
      case '1': // 表示添加说明
        this.handleAddDescription(index)
        break;
      case '2': // 表示删除此项
        this.handleDeleteItem(index)
        break
      default:
        break;
    }
  }

  // 添加说明
  handleAddDescription = (key) => {
    this.setState({
      is_add_description: true,
      currentSelectItemIndex: key, // 表示当前选中的元素下标
    })
  }

  // 添加说明change事件
  handleChangeDescription = (e) => {
    e && e.stopPropagation()
    const { currentSelectItemIndex } = this.state
    if (e.target.value.trimLR() == '') {
      this.updateState({ value: '', key: 'description', isNotUpdateModelDatas: true }, currentSelectItemIndex)
      this.setState({
        currentSelectItemDescription: ''
      })
      return
    }
    this.setState({
      currentSelectItemDescription: e.target.value
    })
    this.updateState({ value: e.target.value, key: 'description', isNotUpdateModelDatas: true }, currentSelectItemIndex)
  }

  // 确认更新描述事件
  handleConfirmDescription = (e) => {
    e && e.stopPropagation()
    const { currentSelectItemIndex, currentSelectItemDescription } = this.state
    this.updateState({ value: currentSelectItemDescription, key: 'description' }, currentSelectItemIndex)
    // 更新一个字段表示更新了
    this.updateState({ value: true, key: 'is_update_description' }, currentSelectItemIndex)
    this.setState({
      is_add_description: false
    })
  }

  // 取消更新描述事件
  handleCancleDescription = (e) => {
    e && e.stopPropagation()
    const { currentSelectItemIndex, scoreList = [] } = this.state
    let gold_update = (scoreList.find((item, index) => index == currentSelectItemIndex) || {}).is_update_description || ''
    if (gold_update) {
      let gold_description = (scoreList.find((item, index) => index == currentSelectItemIndex) || {}).description || ''
      this.updateState({ value: gold_description != '' ? gold_description : '', key: 'description' }, currentSelectItemIndex)
    } else {
      this.updateState({ value: '', key: 'description' }, currentSelectItemIndex)
    }

    this.setState({
      is_add_description: false
    })
  }

  // 删除选项
  handleDeleteItem = (index) => {
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    for (var i = 0; i < new_data.length; i++) {
      if (i == index) {
        new_data.splice(index, 1); // 将使后面的元素依次前移，数组长度减1
        i--; // 如果不减，将漏掉一个元素
        break
      }
    }
    this.setState({
      scoreList: new_data
    })
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_data }, 'scoreList')
  }

  renderMoreSelect = (index) => {
    const { scoreList = [] } = this.state
    let flag = scoreList && scoreList.length > '1'
    return (
      <Menu onClick={(e) => { this.handleChangeMenuItem(e, index) }}>
        <Menu.Item key="1">添加说明</Menu.Item>
        {
          flag && (
            <Menu.Item key="2">删除此项</Menu.Item>
          )
        }
      </Menu>
    )
  }

  // 渲染默认的table表格, 即没有开启权重评分
  renderDefaultTableContent = () => {
    const { scoreList = [] } = this.state
    return (
      <table className={indexStyles.popover_tableContent} border={1} style={{ borderColor: '#E9E9E9' }} width="100%">
        <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center', background: '#FAFAFA' }}>
          <th style={{ width: '260px' }}>标题</th>
          <th>
            最高分值
            <div style={{ color: 'rgba(0,0,0,0.25)', fontSize: '12px' }}>(最高1000分)</div>
          </th>
        </tr>
        {
          scoreList && scoreList.map((item, index) => {
            const { key, grade_value, title } = item
            return (
              <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
                <td style={{ width: '170px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea maxLength={200} value={title} onChange={(e) => { this.handleAutoTitleTextArea(e, key, index) }} ref={`autoTitleTextArea_${key}`} />
                </td>
                <td style={{ position: 'relative', width: '90px' }}>
                  {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
                  <textarea value={grade_value} onChange={(e) => { this.handleAutoGradeTextArea(e, key, index) }} ref={`autoGradeTextArea_${key}`} />
                  <Dropdown overlay={this.renderMoreSelect(index)} getPopupContainer={triggerNode => triggerNode.parentNode} trigger={['click']}>
                    <div className={indexStyles.rating_moreBox}>
                      <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
                    </div>
                  </Dropdown>

                </td>
              </tr>
            )
          })
        }
      </table>
    )
  }

  // 渲染具有权重的表格
  renderWeightTableContent = () => {
    const { scoreList = [] } = this.state
    return (
      <table className={indexStyles.popover_tableContent} border={1} style={{ borderColor: '#E9E9E9' }} width="100%">
        <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center', background: '#FAFAFA' }}>
          <th style={{ width: '170px' }}>标题</th>
          <th style={{ width: '90px' }}>
            权重占比%
            <div style={{ color: '#F5222D', fontSize: '12px' }}>{this.whetherTheAllWeightValueGreaterThanHundred() ? '(总和不能超过100%)' : ''}</div>
          </th>
          <th style={{ width: '90px' }}>
            最高分值
            <div style={{ color: 'rgba(0,0,0,0.25)', fontSize: '12px' }}>(最高1000分)</div>
          </th>
        </tr>
        {
          scoreList && scoreList.map((item, index) => {
            const { key, title, grade_value, weight_value } = item
            return (
              <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
                <td style={{ width: '170px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea maxLength={200} value={title} onChange={(e) => { this.handleAutoTitleTextArea(e, key, index) }} ref={`autoTitleTextArea_${key}`} />
                </td>
                <td style={{ width: '90px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea value={weight_value} onChange={(e) => { this.handleChangeAutoWeightTextArea(e, key, index) }} ref={`autoWeightTextArea_${key}`} />
                </td>
                <td style={{ position: 'relative', width: '90px' }}>
                  {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
                  <textarea value={grade_value} onChange={(e) => { this.handleAutoGradeTextArea(e, key, index) }} ref={`autoGradeTextArea_${key}`} />
                  <Dropdown overlay={this.renderMoreSelect(index)} getPopupContainer={triggerNode => triggerNode.parentNode} trigger={['click']}>
                    <div className={indexStyles.rating_moreBox}>
                      <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
                    </div>
                  </Dropdown>

                </td>
              </tr>
            )
          })
        }

      </table>
    )
  }

  // 判断是否有内容为空 true 表示存在内容为空
  whetherIsEmptyContent = () => {
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    let flag
    new_data.find(item => {
      if (item.title == '' || item.grade_value == '' || item.weight_value == '') {
        flag = true
      }
    })
    return flag
  }

  // 判断所有内容的权重是否大于100 true 表示大于100 禁用
  whetherTheAllWeightValueGreaterThanHundred = () => {
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    let flag
    let compare_value = 100
    let total_value = new_data.reduce((acc, curr) => {

      let weight_value = curr.weight_value
      acc += Number(weight_value)
      return acc
    }, 0)
    if (total_value > compare_value) {
      flag = true
    }
    return flag
  }

  renderConfigurationScore = () => {
    const { itemValue: { weight_coefficient }, itemKey } = this.props
    const { localScoreList = [], scoreList = [] } = this.state
    let disabledFlag = isObjectValueEqual(localScoreList, scoreList) || this.whetherIsEmptyContent() || (weight_coefficient == '1' && this.whetherTheAllWeightValueGreaterThanHundred())
    return (
      <div className={indexStyles.popover_content}>
        <div style={{ minHeight: '352px' }} className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
            <span>评分内容：</span>
            <span style={{ display: 'inline-block' }}>
              <span style={{ verticalAlign: 'middle', position: 'relative' }}>
                权重评分
                <Tooltip autoAdjustOverflow={false} overlayStyle={{minWidth: '228px'}} title="2个以上评分时可以开启权重评分，设置评分值所在总分值中的占比（总占比之和须等于100%）" placement="top" getPopupContainer={() => document.getElementById(`popoverContainer_${itemKey}`)}>
                  <span style={{ fontSize: '16px', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe845;&nbsp;&nbsp;</span>
                </Tooltip>
                :&nbsp;&nbsp;&nbsp;
              </span>
              <span><Switch size="small" onChange={this.handleWeightChange} checked={weight_coefficient == '1'} /></span>
            </span>
          </div>
          {weight_coefficient == '1' ? this.renderWeightTableContent() : this.renderDefaultTableContent()}
          {/* {this.renderDefaultTableContent()} */}
          {/* {this.renderWeightTableContent()} */}
          <Button onClick={this.handleAddTableItems} className={indexStyles.rating_button}>
            <span className={globalStyles.authTheme}>&#xe782;</span>
            <span>添加评分</span>
          </Button>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button disabled={disabledFlag} type="primary" style={{ width: '100%' }}>确定</Button>
        </div>
      </div>
    )
  }

  renderAddDescription = () => {
    const { scoreList = [], currentSelectItemIndex } = this.state
    let gold_description = (scoreList.find((item, index) => index == currentSelectItemIndex) || {}).description || ''
    return (
      <div className={indexStyles.popover_content} style={{ textAlign: 'center' }}>
        <Input.TextArea
          className={globalStyles.global_vertical_scrollbar}
          style={{ resize: 'none', width: '352px', minHeight: '332px' }}
          placeholder="添加说明"
          value={gold_description}
          onChange={this.handleChangeDescription}
          maxLength={200}
        />
        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <Button onClick={this.handleCancleDescription} style={{ height: '32px', marginRight: '8px', border: '1px solid rgba(24,144,255,1)', color: '#1890FF' }}>取消</Button>
          <Button onClick={this.handleConfirmDescription} disabled={gold_description == ''} type="primary" style={{ height: '32px' }}>确认</Button>
        </div>
      </div>
    )
  }

  renderAddDescriptionTitle = () => {
    const { scoreList = [], currentSelectItemIndex } = this.state
    let gold_title = (scoreList.find((item, index) => index == currentSelectItemIndex) || {}).title || ''
    return (
      <div className={indexStyles.popover_title} style={{ display: 'flex' }}>
        <span onClick={this.handleCancleDescription} className={`${indexStyles.back_icon} ${globalStyles.authTheme}`}>&#xe7ec;</span>
        <span style={{ flex: '1' }}>{gold_title}</span>
      </div>
    )
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
    const { scoreList = [], is_add_description } = this.state
    let flag = this.whetherShowDiffWidth()
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
          <div className={indexStyles.ratingItems}>
            {
              scoreList && scoreList.map((item, index) => {
                const { title, description, grade_value, weight_value } = item
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
                    <div className={indexStyles.rating_grade}>
                      <span>最高<span className={indexStyles.rating_grade_value}>{grade_value}</span>分</span>
                    </div>
                  </div>
                )
              })
            }
            <div>
              <div id={`popoverContainer_${itemKey}`} onClick={(e) => e.stopPropagation()} className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
                <Popover
                  // key={`${itemKey}-${itemValue}`}
                  title={is_add_description ? this.renderAddDescriptionTitle() : <div className={indexStyles.popover_title}>配置评分</div>}
                  trigger="click"
                  // visible={this.state.popoverVisible}
                  onClick={(e) => e.stopPropagation()}
                  content={is_add_description ? this.renderAddDescription() : this.renderConfigurationScore()}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placement={'bottomRight'}
                  zIndex={1010}
                  className={indexStyles.popoverWrapper}
                  autoAdjustOverflow={false}
                // onVisibleChange={this.onVisibleChange}
                >
                  <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
                    <span style={{ color: '#1890FF' }} className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe78e;</span>
                  </span>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}