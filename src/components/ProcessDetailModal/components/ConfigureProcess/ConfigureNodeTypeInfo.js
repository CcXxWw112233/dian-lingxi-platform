import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { Radio } from 'antd'
import ConfigureStepTypeOne from './component/ConfigureStepTypeOne'
import ConfigureStepTypeTwo from './component/ConfigureStepTypeTwo'
import ConfigureStepTypeThree from './component/ConfigureStepTypeThree'
import { connect } from 'dva'
@connect(mapStateToProps)
export default class ConfigureNodeTypeInfoOne extends Component {

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
    console.log('进来了','sssssssssssssssssssssssssss_外部点击事件')
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
    this.updateCorrespondingPrcodessStepWithNodeContent('is_click_node_name',true)
  }

  // 当前节点的步骤名称
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.updateCorrespondingPrcodessStepWithNodeContent('name','')
      return
    }
    this.setState({
      localName: val
    })
    this.updateCorrespondingPrcodessStepWithNodeContent('name',val)
    this.updateCorrespondingPrcodessStepWithNodeContent('is_click_node_name', false)
  }
  titleTextAreaChangeClick = (e) => {
    e && e.stopPropagation()
  }


  // 当先选择的节点类型
  handleChangeStepType = (e) => {
    e && e.stopPropagation()
    let key = e.target.value
    this.updateCorrespondingPrcodessStepWithNodeContent('node_type', key)
  }

  renderDiffStepTypeContent = () => {
    const { itemValue, itemKey } = this.props
    const { node_type } = itemValue
    let container = <div></div>
    switch (node_type) {
      case '1': // 表示资料收集
        container = <ConfigureStepTypeOne itemValue={itemValue} itemKey={itemKey}/>
        break;
      case '2': // 表示审批
        container = <ConfigureStepTypeTwo itemValue={itemValue} itemKey={itemKey}/>
        break
      case '3': // 表示抄送
        container = <ConfigureStepTypeThree itemValue={itemValue} itemKey={itemKey}/>
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
    let juge = {
      bordered: false
    }
    // const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '45px' }} onClick={(e) => {this.handleCancelNodeName(e)}}>
        {/* {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>} */}
        <div className={indexStyles.doingLine}></div>
        <div className={indexStyles.doingCircle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              {
                name && !is_click_node_name ? (
                  <div onClick={(e) => {this.handleChangeNodeName(e)}} className={`${indexStyles.node_name} ${indexStyles.pub_hover}`}>
                    {name}
                  </div>
                ) : (
                  <NameChangeInput
                    autosize
                    onBlur={this.titleTextAreaChangeBlur}
                    onPressEnter={this.titleTextAreaChangeBlur}
                    onClick={this.titleTextAreaChangeClick}
                    autoFocus={true}
                    goldName={''}
                    placeholder={'步骤名称(必填)'}
                    maxLength={101}
                    nodeName={'input'}
                    style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                  />
                )
              }
            </div>
            <div style={{ paddingLeft: '14px', paddingRight: '14px', position: 'relative' }}>
              {/* 步骤类型 */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }} className={globalStyles.authTheme}>&#xe7f4; &nbsp;步骤类型 :&nbsp;&nbsp;&nbsp;</span>
                <Radio.Group onChange={this.handleChangeStepType} value={node_type}>
                  <Radio value="1">资料收集</Radio>
                  <Radio value="2">审批</Radio>
                  <Radio value="3">抄送</Radio>
                </Radio.Group>
              </div>
              <div className={`${check_line} ${indexStyles.check_line}`}></div>
              {/* 根据点击的不同步骤类型显示的不同配置内容 */}
              {this.renderDiffStepTypeContent()}
            </div>
            {/* <span className={indexStyles.dynamicTime}></span> */}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { processEditDatas = [] } = this.props
    return (
      <div className={indexStyles.configureProcessOut_1}>
        {/* {
          processEditDatas.map((item, key) => {
            return (
              this.renderContent({ itemKey: key, itemValue: item })
            )
          })
        } */}
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return {  processEditDatas }
}
