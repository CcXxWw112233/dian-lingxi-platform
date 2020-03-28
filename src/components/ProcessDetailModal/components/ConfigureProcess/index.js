import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { Radio, Button, Tooltip } from 'antd'
import ConfigureStepTypeOne from './component/ConfigureStepTypeOne'
import ConfigureStepTypeTwo from './component/ConfigureStepTypeTwo'
import ConfigureStepTypeThree from './component/ConfigureStepTypeThree'
import { processEditDatasItemOneConstant, processEditDatasItemTwoConstant, processEditDatasItemThreeConstant } from '../../constant'
import { connect } from 'dva'
@connect(mapStateToProps)
export default class ConfigureProcess extends Component {

  state = {
    localName: '', // 当前节点步骤的名称
  }

  // 更新对应步骤下的节点内容数据, 即当前操作对象的数据
  updateCorrespondingPrcodessStepWithNodeContent = (data, value) => {
    const { itemValue, processEditDatas = [], itemKey, dispatch } = this.props
    let newProcessEditDatas = [...processEditDatas]
    newProcessEditDatas[itemKey][data] = value
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newProcessEditDatas,
      }
    })
  }

  // 外部点击事件是否取消节点名称输入框
  handleCancelNodeName = (e) => {
    e && e.stopPropagation()
    const { itemValue, itemKey, processEditDatas = [] } = this.props
    const { name } = itemValue
    const { localName } = this.state
    if (localName == name) { // 表示如果当前的名称没有修改的话就不出现输入框
      this.updateCorrespondingPrcodessStepWithNodeContent('is_click_node_name', false)
    }
  }

  // 节点名称点击事件
  handleChangeNodeName = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('is_click_node_name', true)
  }

  // 当前节点的步骤名称
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.updateCorrespondingPrcodessStepWithNodeContent('name', '')
      return
    }
    this.setState({
      localName: val
    })
    this.updateCorrespondingPrcodessStepWithNodeContent('name', val)
    this.updateCorrespondingPrcodessStepWithNodeContent('is_click_node_name', false)
  }
  titleTextAreaChangeClick = (e) => {
    e && e.stopPropagation()
  }


  // 确认的点击事件
  handleConfirmButton = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '1')
    // this.props.dispatch({
    //   type: 'publicProcessDetailModal/updateDatas',
    //   payload: {
    //     processPageFlagStep: '1'
    //   }
    // })
  }

  // 删除的点击事件
  handleDeleteButton = (e) => {
    e && e.stopPropagation()
    const { processEditDatas = [], processCurrentEditStep, dispatch, itemKey } = this.props
    let newProcessEditDatas = null
    if (processEditDatas.length) {
      newProcessEditDatas = JSON.parse(JSON.stringify(processEditDatas))
      newProcessEditDatas.splice(itemKey, 1)

    }
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newProcessEditDatas,
        processCurrentEditStep: processCurrentEditStep >= 1 ? processCurrentEditStep - 1 : 0,
      }
    })
  }

  // 当先选择的节点类型
  handleChangeStepType = (e) => {
    e && e.stopPropagation()
    e && e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
    const { itemKey, itemValue, processEditDatas = [], dispatch } = this.props
    let key = e.target.value
    let newProcessEditDatas = [...processEditDatas]
    let name = { ...newProcessEditDatas[itemKey] }.name || ''
    let nodeObj
    switch (key) {
      case '1':
        nodeObj = Object.assign({}, JSON.parse(JSON.stringify(processEditDatasItemOneConstant)), { name: name })
        break;
      case '2':
        nodeObj = Object.assign({}, JSON.parse(JSON.stringify(processEditDatasItemTwoConstant)), { name: name })
        break
      case '3':
        nodeObj = Object.assign({}, JSON.parse(JSON.stringify(processEditDatasItemThreeConstant)), { name: name })
        break
      default:
        break;
    }
    newProcessEditDatas[itemKey] = nodeObj
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newProcessEditDatas,
      }
    })
  }

  // 渲染不同种Button确认按钮的提示文案
  renderDiffButtonTooltipsText = () => {
    let confirmButtonText = ''
    let confirmButtonDisabled
    const { itemValue } = this.props
    const { node_type, name, forms = [], assignee_type, assignees, cc_type, recipients } = itemValue
    let newAssignees = assignees ? assignees.split(',') : []
    let newRecipients = recipients ? recipients.split(',') : []
    switch (node_type) {
      case '1':
        if (cc_type == '0' || cc_type == '') { // 没有选择抄送人的时候
          if (assignee_type == '1') { // 表示的是任何人
            if (!name && !(forms && forms.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一个表项'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length)) {
              confirmButtonText = '请输入步骤名称'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length)) {
              confirmButtonText = '至少添加一个表项'
              confirmButtonDisabled = true
            }
          } else if (assignee_type == '2') { // 表示的是指定人员
            if (!name && !(forms && forms.length) && !(newAssignees && newAssignees.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一个表项以及至少添加一位填写人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && (newAssignees && newAssignees.length)) {
              confirmButtonText = '请输入步骤名称'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && (newAssignees && newAssignees.length)) {
              confirmButtonText = '至少添加一个表项'
              confirmButtonDisabled = true
            } else if (name && (forms && forms.length) && !(newAssignees && newAssignees.length)) {
              confirmButtonText = '至少添加一位填写人'
              confirmButtonDisabled = true
            } else if (!name && !(forms && forms.length) && (newAssignees && newAssignees.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一个表项'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && !(newAssignees && newAssignees.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一位填写人'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && !(newAssignees && newAssignees.length)) {
              confirmButtonText = '至少添加一个表项以及至少添加一位填写人'
              confirmButtonDisabled = true
            }
          }
        } else if (cc_type == '1') { // 表示选择了抄送人
          if (assignee_type == '1') { // 表示的是任何人
            if (!name && !(forms && forms.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一个表项和至少选择一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一个表项'
              confirmButtonDisabled = true
            } else if (name && (forms && forms.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && !(forms && forms.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一个表项'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一位抄送人'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一个表项以及至少添加一位抄送人'
              confirmButtonDisabled = true
            }
          } else if (assignee_type == '2') {
            if (!name && !(forms && forms.length) && !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一个表项以及至少添加一位填写人和至少一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && (newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请至少添加一个表项以及至少添加一位填写人和至少一位抄送人'
              confirmButtonDisabled = true
            } else if (name && (forms && forms.length) && !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一位填写人和至少一位抄送人'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一个表项和至少一位抄送人'
              confirmButtonDisabled = true
            } else if (name && (forms && forms.length) && (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一位抄送人'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && (newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一个表项'
              confirmButtonDisabled = true
            } else if (name && (forms && forms.length) && !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一位填写人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一位填写人以及至少一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称以及至少添加一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称以及至少添加一位填写人'
              confirmButtonDisabled = true
            } else if (!name && !(forms && forms.length) && (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一个表项以及至少一位抄送人'
              confirmButtonDisabled = true
            } else if (!name && !(forms && forms.length) && !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称、至少添加一个表项以及至少一位填写人'
              confirmButtonDisabled = true
            } else if (!name && !(forms && forms.length) && (newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称和至少添加一个表项'
              confirmButtonDisabled = true
            } else if (!name && (forms && forms.length) && (newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '请输入步骤名称'
              confirmButtonDisabled = true
            } else if (name && !(forms && forms.length) && !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
              confirmButtonText = '至少添加一个表项以及至少一位填写人'
              confirmButtonDisabled = true
            }
          }
        }
        break;
      case '2':
        if (cc_type == '0' || cc_type == '') { // 表示没有选择抄送人
          if (!name && !(newAssignees && newAssignees.length)) {
            confirmButtonText = '请输入步骤名称和至少添加一位审批人'
            confirmButtonDisabled = true
          } else if (!name && (newAssignees && newAssignees.length)) {
            confirmButtonText = '请输入步骤名称'
            confirmButtonDisabled = true
          } else if (name && !(newAssignees && newAssignees.length)) {
            confirmButtonText = '至少添加一位审批人'
            confirmButtonDisabled = true
          }
        } else if (cc_type == '1') { // 表示选择了抄送人
          if (!name &&  !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
            confirmButtonText = '请输入步骤名称、至少添加一位审批人以及至少添加一位抄送人'
            confirmButtonDisabled = true
          } else if (name &&  !(newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
            confirmButtonText = '至少添加一位审批人和至少添加一位抄送人'
            confirmButtonDisabled = true
          } else if (!name &&  (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
            confirmButtonText = '请输入步骤名称以及至少添加一位抄送人'
            confirmButtonDisabled = true
          } else if (!name &&  !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
            confirmButtonText = '请输入步骤名称以及至少添加一位审批人'
            confirmButtonDisabled = true
          } else if (!name &&  (newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
            confirmButtonText = '请输入步骤名称'
            confirmButtonDisabled = true
          } else if (name && !(newAssignees && newAssignees.length) && (newRecipients && newRecipients.length)) {
            confirmButtonText = '至少添加一位审批人'
            confirmButtonDisabled = true
          } else if (name && (newAssignees && newAssignees.length) && !(newRecipients && newRecipients.length)) {
            confirmButtonText = '至少添加一位抄送人'
            confirmButtonDisabled = true
          }
        }
        break
      case '3':
        break
      default:
        // confirmButtonText = '确认'
        confirmButtonDisabled = true
        break;
    }
    return { confirmButtonText, confirmButtonDisabled }
  }

  renderDiffStepTypeContent = () => {
    const { itemValue, itemKey } = this.props
    const { node_type } = itemValue
    let container = <div></div>
    switch (node_type) {
      case '1': // 表示资料收集
        container = <ConfigureStepTypeOne itemValue={itemValue} itemKey={itemKey} />
        break;
      case '2': // 表示审批
        container = <ConfigureStepTypeTwo itemValue={itemValue} itemKey={itemKey} />
        break
      case '3': // 表示抄送
        // container = <ConfigureStepTypeThree itemValue={itemValue} itemKey={itemKey} />
        break
      default:
        container = <div></div>
        break;
    }
    return container
  }

  renderContent = () => {
    const { itemKey, itemValue, processEditDatasRecords = [], processCurrentEditStep, processEditDatas = [] } = this.props
    const { name, node_type, description, is_click_node_name } = itemValue
    // let node_amount = this.props && this.props.processInfo && this.props.processInfo.node_amount
    let stylLine, stylCircle
    // if (this.props.processInfo.completed_amount >= itemKey + 1) { //0 1    1  2 | 1 3 | 1 4
    //   stylLine = indexStyles.line
    //   stylCircle = indexStyles.circle
    // } else if (this.props.processInfo.completed_amount == itemKey) {
    //   stylLine = indexStyles.doingLine
    //   stylCircle = indexStyles.doingCircle
    // } else {
    //   stylLine = indexStyles.hasnotCompetedLine
    //   stylCircle = indexStyles.hasnotCompetedCircle
    // }

    let check_line
    if (node_type == '1') {
      check_line = indexStyles.data_collection
    } else if (node_type == '2') {
      check_line = indexStyles.examine_approve
    } else if (node_type == '3') {
      check_line = indexStyles.make_copy
    } else {
      check_line = indexStyles.normal_check
    }
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '48px' }} onClick={(e) => { this.handleCancelNodeName(e) }}>
        <div className={indexStyles.doingLine}></div>
        <div className={indexStyles.doingCircle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              {
                name && !is_click_node_name ? (
                  <div onClick={(e) => { this.handleChangeNodeName(e) }} className={`${indexStyles.node_name} ${indexStyles.pub_hover}`}>
                    {name}
                  </div>
                ) : (
                    <NameChangeInput
                      autosize
                      onBlur={this.titleTextAreaChangeBlur}
                      onPressEnter={this.titleTextAreaChangeBlur}
                      onClick={this.titleTextAreaChangeClick}
                      autoFocus={true}
                      goldName={name}
                      placeholder={'步骤名称(必填)'}
                      maxLength={50}
                      nodeName={'input'}
                      style={{ display: 'block', fontSize: 16, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                    />
                  )
              }
            </div>
            <div style={{ paddingLeft: '14px', paddingRight: '14px', position: 'relative' }}>
              {/* 步骤类型 */}
              <div style={{ paddingBottom: '14px', borderBottom: '1px #e8e8e8' }} onClick={(e) => { e && e.stopPropagation() }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }} className={globalStyles.authTheme}>&#xe7f4; &nbsp;步骤类型 :&nbsp;&nbsp;&nbsp;</span>
                <Radio.Group onChange={this.handleChangeStepType} value={node_type}>
                  <Radio value="1">资料收集</Radio>
                  {
                    itemKey != '0' && (
                      <>
                        <Radio value="2">审批</Radio>
                        {/* <Radio value="3">抄送</Radio> */}
                      </>
                    )
                  }
                </Radio.Group>
              </div>
              <div className={`${check_line} ${indexStyles.check_line}`}></div>
              {/* 根据点击的不同步骤类型显示的不同配置内容 */}
              {this.renderDiffStepTypeContent()}
            </div>
            {/* 删除 | 确认 */}
            <div className={indexStyles.step_btn}>
              <Button onClick={this.handleDeleteButton} style={{ color: itemKey != '0' && '#FF7875' }} disabled={itemKey == '0' ? true : false}>删除</Button>
              <Tooltip placement="top" title={this.renderDiffButtonTooltipsText().confirmButtonText}><Button key={itemValue} disabled={this.renderDiffButtonTooltipsText().confirmButtonDisabled} onClick={this.handleConfirmButton} type="primary">确认</Button></Tooltip>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={indexStyles.configureProcessOut_1}>
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
