import React, { Component } from 'react'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class ConfigureStepTypeThree_one extends Component {

  constructor(props) {
    super(props)
    this.state = {
      localItemValue: props.itemValue ? JSON.parse(JSON.stringify(props.itemValue || {})) : {},
      scoreList: props.itemValue && props.itemValue.scoreList ? JSON.parse(JSON.stringify(props.itemValue.scoreList || [])) : []
    }
  }

  // 是否开启权重
  handleWeightChange = (checked) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: checked ? '1' : '0' }, 'weight_coefficient')
  }

  titleResize = (key) => {
    if (!this.refs && !this.refs[`autoTitleTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs[`autoTitleTextArea_${key}`].style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs[`autoTitleTextArea_${key}`].scrollHeight >= this.refs[`autoTitleTextArea_${key}`].offsetHeight) {
      this.refs[`autoTitleTextArea_${key}`].style.height = this.refs[`autoTitleTextArea_${key}`].scrollHeight + 'px'
    }
  }

  gradeResize = (key) => {
    if (!this.refs && !this.refs[`autoGradeTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.autoTitleTextArea.style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs[`autoGradeTextArea_${key}`].scrollHeight >= this.refs[`autoGradeTextArea_${key}`].offsetHeight) {
      this.refs[`autoGradeTextArea_${key}`].style.height = this.refs[`autoGradeTextArea_${key}`].scrollHeight + 'px'
    }
  }

  weightResize = (key) => {
    if (!this.refs && !this.refs[`autoWeightTextArea_${key}`]) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.autoTitleTextArea.style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs[`autoWeightTextArea_${key}`].scrollHeight >= this.refs[`autoWeightTextArea_${key}`].offsetHeight) {
      this.refs[`autoWeightTextArea_${key}`].style.height = this.refs[`autoWeightTextArea_${key}`].scrollHeight + 'px'
    }
  }

  handleChangeAutoTextArea = (e, key) => {
    e && e.stopPropagation()
    // console.log(this.refs, 'ssssssssssssssssssssss_thi.refs')
    // console.log(e.target.value, 'sssssssssssssssssssssssss_value')
    // if (e.keyCode >=48 && e.keyCode <= 57) {
    //   console.log(e.target.value,'ssssssssssssssssssssss_value')
    // }
    // 表示执行的是title的文本框
    if (this.refs && this.refs[`autoTitleTextArea_${key}`]) {
      this.titleResize(key)
    }
    // 表示执行的是 分值文本框
    if (this.refs && this.refs[`autoGradeTextArea_${key}`]) {
      this.gradeResize(key)
    }

    if (this.refs && this.refs[`autoWeightTextArea_${key}`]) {
      this.weightResize(key)
    }

    // let height = parseInt(getComputedStyle(e.target).height.slice(0, -2), 10);
    // return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.myTA.style.height = 'auto';  

    //如果高度不够，再重新设置
    // if(this.refs.myTA.scrollHeight >= this.refs.myTA.offsetHeight){
    //     this.refs.myTA.style.height = this.refs.myTA.scrollHeight + 'px'
    // }
  }

  handleAddTableItems = (e) => {
    e && e.stopPropagation()
    const { scoreList = [] } = this.state
    let new_data = [...scoreList]
    let obj = {
      "key": new_data.length.toString(),
      "title": "评分项",
      "weight_value": '',
      "grade_value": '',
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
      is_add_description: true
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
          <th>最高分值</th>
        </tr>
        {
          scoreList && scoreList.map((item, index) => {
            const { key } = item
            return (
              <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
                <td style={{ width: '170px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea value={item.title} onChange={(e) => { this.handleChangeAutoTextArea(e, key) }} ref={`autoTitleTextArea_${key}`} />
                </td>
                <td style={{ position: 'relative', width: '90px' }}>
                  {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
                  <textarea onChange={(e) => { this.handleChangeAutoTextArea(e, key) }} ref={`autoGradeTextArea_${key}`} />
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
        {/* <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
          <th style={{ width: '260px' }}>
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoTitleTextArea" />
          </th>
          <th style={{ position: 'relative' }}>
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoGradeTextArea" />
            <div className={indexStyles.rating_moreBox}>
              <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
            </div>
          </th>
        </tr> */}
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
          <th style={{ width: '90px' }}>权重占比%</th>
          <th style={{ width: '90px' }}>最高分值</th>
        </tr>
        {
          scoreList && scoreList.map((item, index) => {
            const { key } = item
            return (
              <tr style={{ height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
                <td style={{ width: '170px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea value={item.title} onChange={(e) => { this.handleChangeAutoTextArea(e, key) }} ref={`autoTitleTextArea_${key}`} />
                </td>
                <td style={{ width: '90px' }}>
                  {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
                  <textarea onChange={(e) => { this.handleChangeAutoTextArea(e, key) }} ref={`autoWeightTextArea_${key}`} />
                </td>
                <td style={{ position: 'relative', width: '90px' }}>
                  {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
                  <textarea onChange={(e) => { this.handleChangeAutoTextArea(e, key) }} ref={`autoGradeTextArea_${key}`} />
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


  renderContent = () => {
    const { itemValue: { weight_coefficient } } = this.props
    return (
      <div className={indexStyles.popover_content}>
        <div style={{ minHeight: '352px' }} className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
            <span>评分内容：</span>
            <span style={{ display: 'inline-block' }}>
              <span style={{ verticalAlign: 'middle' }}>权重评分 <span style={{ fontSize: '16px' }} className={globalStyles.authTheme}>&#xe845;&nbsp;&nbsp;</span>:&nbsp;&nbsp;&nbsp;</span>
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
          <Button type="primary" style={{ width: '100%' }}>确定</Button>
        </div>
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
    const { scoreList = [] } = this.state
    let flag = this.whetherShowDiffWidth()
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
          <div className={indexStyles.ratingItems}>
            {
              scoreList && scoreList.map((item, index) => {
                return (
                  <div key={item} className={`${indexStyles.rating_itemsValue} ${flag && scoreList.length > 1 ? indexStyles.rating_active_width : indexStyles.rating_normal_width}`}>
                    <p>
                      <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer' }}>
                        <Tooltip title="评分项" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <span style={{ marginRight: '9px' }}>评分项:</span>
                        </Tooltip>
                        <Tooltip overlayStyle={{ minWidth: '110px' }} title="权重占比: 90%" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <span className={indexStyles.rating_weight}>*90%</span>
                        </Tooltip>
                      </span>
                      <span className={globalStyles.authTheme}>&#xe785;</span>
                    </p>
                    <div className={indexStyles.rating_grade}>
                      <span>最高<span className={indexStyles.rating_grade_value}>100</span>分</span>
                    </div>
                  </div>
                )
              })
            }
            {/* <div className={`${indexStyles.rating_itemsValue} ${flag ? indexStyles.rating_active_width : indexStyles.rating_normal_width}`}>
              <p>
                <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer' }}>
                  <Tooltip title="评分项" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span style={{ marginRight: '9px' }}>评分项:</span>
                  </Tooltip>
                  <Tooltip overlayStyle={{ minWidth: '110px' }} title="权重占比: 90%" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span className={indexStyles.rating_weight}>*90%</span>
                  </Tooltip>
                </span>
                <span className={globalStyles.authTheme}>&#xe785;</span>
              </p>
              <div className={indexStyles.rating_grade}>
                <span>最高<span className={indexStyles.rating_grade_value}>100</span>分</span>
              </div>
            </div> */}
            <div>
              <div onClick={(e) => e.stopPropagation()} className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
                <Popover
                  // key={`${itemKey}-${itemValue}`}
                  title={<div className={indexStyles.popover_title}>配置评分</div>}
                  trigger="click"
                  // visible={this.state.popoverVisible}
                  onClick={(e) => e.stopPropagation()}
                  content={this.renderContent()}
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