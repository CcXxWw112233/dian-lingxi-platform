import React from 'react'
import indexStyles from './index.less'
import { Icon, Button, message } from 'antd'
import EditFormOne from './EditFormOne'
import EditFormTwo from './EditFormTwo'
import EditFormThree from './EditFormThree'
import EditFormFour from './EditFormFour'
import EditFormFive from './EditFormFive'
import SaveTemplate from './SaveTemplate'
import { processEditDatasConstant, processEditDatasRecordsConstant, processEditDatasItemOneConstant, processEditDatasRecordsItemOneConstant } from '../constant'
import {MESSAGE_DURATION_TIME} from "../../../../../../globalset/js/constant";


export default class EditProcess extends React.Component {
  state = {
    saveTemplateModalVisible: false
  }
  nodeTypeClick(node_type) {
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep  } } = this.props.model
    if(processCurrentEditStep===0 && node_type === '5') {
      message.warn('流程节点第一步不能为审批类型')
      return false
    }
    const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    processEditDatasRecords[processCurrentEditStep] = {
      'node_type': node_type,
      'alltypedata': alltypedata
    }
    for (let val of processEditDatasRecords[processCurrentEditStep]['alltypedata']) {
      if(val['node_type'] === node_type) {
        processEditDatas[processCurrentEditStep] = val
      }
    }

    this.props.updateDatas({
      processEditDatas,
      processEditDatasRecords,
      node_type,
    })
  }
  verrificationForm(processEditDatas) { //校验表单
    const currentData = processEditDatas[processEditDatas.length - 1]
    if(!currentData['name']){
      message.warn('请输入当前节点步骤名称', MESSAGE_DURATION_TIME)
      return false
    }
    if(currentData['assignee_type'] === '3'){
      if(!currentData['assignees']) {
        message.warn('推进人未选择固定人', MESSAGE_DURATION_TIME)
        return false
      }
    }
    if(currentData['node_type'] === '4' && currentData['cc_type'] === '2'){ //抄送
      if(!currentData['recipients']) {
        message.warn('未选择固定抄送人', MESSAGE_DURATION_TIME)
        return false
      }
    }
    return true
  }
  addNode(node_type) { //添加每一项默认里程碑开始，当前步数跳到最新
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep = 0  } } = this.props.model
    const nodeObj = JSON.parse(JSON.stringify(processEditDatasItemOneConstant))
    const recordItemobjs = JSON.parse(JSON.stringify(processEditDatasRecordsItemOneConstant))

    if(!this.verrificationForm(processEditDatas)) {
      return false
    }
    processEditDatasRecords.push(recordItemobjs)
    processEditDatas.push(nodeObj)
    new Promise((resolve) => {
      this.props.updateDatas({ //为了适应mention组件defaultValue在切换的时候不变
        node_type: '6'
      })
      resolve()
    }).then(res => {
      //正常操作
      this.props.updateDatas({
        processEditDatasRecords,
        processEditDatas,
        processCurrentEditStep: processEditDatasRecords.length - 1,
        node_type: '1'
      })
    })
  }

  currentEditStepClick(data) {
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep = 0  } } = this.props.model
    const { value, key } = data
    const { node_type } = value

    if(!this.verrificationForm(processEditDatas)) {
      return false
    }

    new Promise((resolve) => {
      this.props.updateDatas({ //为了适应mention组件defaultValue在切换的时候不变
        node_type: '6'
      })
      resolve()
    }).then(res => {
      //正常操作
      this.props.updateDatas({
        processCurrentEditStep: key,
        node_type
      })
    })
    // this.props.updateDatas({
    //   processCurrentEditStep: key,
    //   node_type
    // })
  }

  setSaveTemplateModalVisible() {
    const { datas: { processEditDatas } } = this.props.model
    if(!this.verrificationForm(processEditDatas)) {
      return false
    }
    this.setState({
      saveTemplateModalVisible: !this.state.saveTemplateModalVisible
    })
  }
  quitEdit() {
    this.props.updateDatas({
      processPageFlagStep: '1',
      node_type: '1', //节点类型
      processCurrentEditStep: 0, //编辑第几步，默认 0
      processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
      processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)) //每一步的每一个类型，记录，数组的全部数据step * type
    })
  }
  directStart(){
    const { datas: { projectDetailInfoData = {}, processEditDatas } } = this.props.model
    if(!this.verrificationForm(processEditDatas)) {
      return false
    }
    const { board_id } = projectDetailInfoData
    this.props.directStartSaveTemplate({
      board_id,
      is_retain: '0',
      node_data: processEditDatas,
      type: '1',
      template_no: '',
    })
  }

  render() {
    const { datas: { node_type = '1', processEditDatas = [], processCurrentEditStep = 0, } } = this.props.model

    const filterForm = (node_type) => {
      let containner = ''
      switch (node_type) {
        case '1':
          containner = (
            <EditFormOne {...this.props} />
          )
          break
        case '2':
          containner = (
            <EditFormTwo {...this.props} />
          )
          break
        case '3':
          containner = (
            <EditFormThree {...this.props} />
          )
          break
        case '4':
          containner = (
            <EditFormFour{...this.props} />
          )
          break
        case '5':
          containner = (
            <EditFormFive {...this.props} />
          )
          break
        default:
           containner = ''
          break
      }
      return containner
    }

    return (
      <div className={indexStyles.editProcessOut}>
        <div className={indexStyles.editProcessLeft}>
          <div className={indexStyles.title}>
            流程步骤：
          </div>
          {/*itemSelect*/}
          {processEditDatas.map((value, key) => {
            return (
              <div key={key} className={processCurrentEditStep === key? indexStyles.itemSelect :indexStyles.item} onClick={this.currentEditStepClick.bind(this, {value, key})}>
                <div className={indexStyles.itemLeft}>{key+1}</div>
                <div className={indexStyles.itemRight}>{value.name}</div>
              </div>
            )
          })}
          <div className={indexStyles.addItem} onClick={this.addNode.bind(this, node_type)}>
            <Icon type="plus-circle-o" />
          </div>
        </div>
        <div className={indexStyles.editProcessMiddle}>
          <div className={indexStyles.title}>
            <div className={indexStyles.left}>步骤类型：</div>
            <div className={indexStyles.right}>
              <div className={node_type === '1' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '1')}>里程碑</div>
              <div className={node_type === '2' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '2')}>上传</div>
              <div className={node_type === '3' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '3')}>填写</div>
              <div className={node_type === '4' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '4')}>抄送</div>
              <div className={node_type === '5' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '5')}>审批</div>
            </div>
          </div>
          <div className={indexStyles.editFormCard}>
            {filterForm(node_type)}
          </div>
        </div>
        <div className={indexStyles.editProcessRight}>
          <div></div>
          <Button type={'primary'}style={{marginTop: 36}} onClick={this.setSaveTemplateModalVisible.bind(this)}>保存模板</Button>
          <Button style={{marginTop: 14}} onClick={this.directStart.bind(this)}>直接启动</Button>
          <Button  style={{marginTop: 14, color: 'red'}} onClick={this.quitEdit.bind(this)}>退出编辑</Button>
        </div>
        <SaveTemplate {...this.props} setSaveTemplateModalVisible={this.setSaveTemplateModalVisible.bind(this)} saveTemplateModalVisible = {this.state.saveTemplateModalVisible}/>

      </div>
    )
  }
}
