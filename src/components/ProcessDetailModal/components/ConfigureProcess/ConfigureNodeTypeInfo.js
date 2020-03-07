import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { Radio } from 'antd'
import ConfigureStepTypeOne from './component/ConfigureStepTypeOne'
import { processEditDatasItemOneConstant, processEditDatasRecordsItemOneConstant } from '../../constant'
import ConfigureGuide from './ConfigureGuide'
export default class ConfigureNodeTypeInfoOne extends Component {

  state = {

  }

  // 当先选择的节点类型
  handleChangeStepType = (e) => {
    let key = e.target.value
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        node_type: key
      }
    })
  }

  // 添加步骤
  handleAddEditStep = () => {
    const { processEditDatasRecords = [], processEditDatas = [], dispatch } = this.props
    const nodeObj = JSON.parse(JSON.stringify(processEditDatasItemOneConstant))
    const recordItemobjs = JSON.parse(JSON.stringify(processEditDatasRecordsItemOneConstant))

    // if (!this.verrificationForm(processEditDatas)) {
    //   return false
    // }
    processEditDatasRecords.push(recordItemobjs)
    processEditDatas.push(nodeObj)
    new Promise((resolve) => {
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          node_type: '6'
        }
      })
      resolve()
    }).then(res => {
      //正常操作
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processEditDatasRecords,
          processEditDatas,
          processCurrentEditStep: (Number(processEditDatasRecords.length) - 1).toString(),
          node_type: '1'
        }
      })

    })
  }

  renderDiffStepTypeContent = () => {
    const { node_type } = this.props
    let container = <div></div>
    switch (node_type) {
      case '1': // 表示资料收集
        container = <ConfigureStepTypeOne {...this.props} />
        break;

      default:
        container = <div></div>
        break;
    }
    return container
  }

  renderDefaultProcess = () => {

    return (
      <>
        <div className={indexStyles.add_node} onClick={this.handleAddEditStep}>
          <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
          <ConfigureGuide />
        </div>
      </>
    )
  }

  renderContent = ({ itemKey, itemValue }) => {
    const { processEditDatasRecords = [], node_type, processCurrentEditStep } = this.props
    let node_amount = this.props && this.props.processInfo && this.props.processInfo.node_amount
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
    const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    return (
      <div style={{ display: 'flex', marginBottom: '45px' }}>
        {/* {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>} */}
        <div className={indexStyles.doingLine}></div>
        <div className={indexStyles.doingCircle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <NameChangeInput
                autosize
                // onBlur={this.titleTextAreaChangeBlur}
                // onClick={this.setTitleEdit}
                // setIsEdit={this.setTitleEdit}
                autoFocus={true}
                goldName={''}
                placeholder={'步骤名称(必填)'}
                maxLength={101}
                nodeName={'textarea'}
                style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
              />
            </div>
            <div style={{ paddingLeft: '14px', paddingRight: '14px', position: 'relative' }}>
              {/* 步骤类型 */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }} className={globalStyles.authTheme}>&#xe7f4; &nbsp;步骤类型 :&nbsp;&nbsp;&nbsp;</span>
                <Radio.Group onChange={this.handleChangeStepType} value={this.props.node_type}>
                  {
                    alltypedata.map(item => {
                      return (
                        <Radio key={item.node_type} value={item.node_type}>{item.name}</Radio>
                      )
                    })
                  }
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
        {
          processEditDatas.map((item, key) => {
            return (
              this.renderContent({ itemKey: key, itemValue: item })
            )
          })
        }
        {this.renderDefaultProcess()}
      </div>
    )
  }
}
