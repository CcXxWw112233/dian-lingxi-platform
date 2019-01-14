/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, Mention, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import indexStyles from './index.less'
import MentionAssignees from './MentionAssignees'
import { validatePositiveInt } from '../../../../../../utils/verify'

const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const { toString, toContentState } = Mention;

export default class EditFormFour extends React.Component {
  //更新
  updateEdit(data, key) { //更新单个数组单个属性
    const { value } = data
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep  } } = this.props.model
    processEditDatas[processCurrentEditStep][key] = value

    //更新processEditDatasRecords操作解构赋值避免操作污染
    const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    let newAlltypedata = [...alltypedata]
    let obj = {}
    for (let i=0; i < newAlltypedata.length; i++ ) {
      if(newAlltypedata[i]['node_type'] === '4') {
        obj = {...newAlltypedata[i]}
        obj[key] = value
        newAlltypedata[i] = obj
      }
    }
    processEditDatasRecords[processCurrentEditStep] = {
      node_type: '4',
      alltypedata: newAlltypedata
    }
    ///更新processEditDatasRecords操作解构赋值避免操作污染

    this.props.updateDatas({
      processEditDatas,
      processEditDatasRecords
    })
    // for(let i = 0 ; i < processEditDatasRecords.length; i ++ ){
    //   console.log( processEditDatasRecords[i]['alltypedata'][0])
    // }
  }
  //名称
  nameChange(e) {
    this.updateEdit({value: e.target.value}, 'name')
  }
  //描述
  descriptionChange(e) {
    this.updateEdit({value: e.target.value}, 'description')
  }
  //完成类型
  deadlineChange(e) {
    this.updateEdit({value: e.target.value}, 'deadline_type')
  }
  //完成时间
  deadlineDayChange(value) {
    if(!validatePositiveInt(value)){
      return false
    }
    this.updateEdit({value: value.toString()}, 'deadline_value')
  }
  // 是否工作日
  isWorkdayChange(e) {
    this.updateEdit({value: e.target.checked? '1':'0'}, 'is_workday')
  }
  //推进人类型
  assigneeTypeChange(e) {
    this.updateEdit({value: e.target.value}, 'assignee_type')
  }
  ccTypeChange(e) {
    this.updateEdit({value: e.target.value}, 'cc_type')
  }
  //提及
  mentionOnChange(contentState){
    const str = toString(contentState)
    const newStr = str.length > 2 ? str.replace('@','').replace(/@/gim, ',').replace(/\s/gim, '') : str
    this.updateEdit({value: newStr}, 'assignees')
  }
  mentionOnChange2(contentState){
    // const str = toString(contentState)
    // const newStr = str.length > 2 ? str.replace('@','').replace(/@/gim, ',').replace(/\s/gim, '') : str
    // this.updateEdit({value: newStr}, 'recipients')

    //将选择的名称转化成id
    const str = toString(contentState)
    const { datas: { projectDetailInfoData = {} }} = this.props.model
    const users = projectDetailInfoData.data
    //将选择的名称转化成id
    let strNew = str.replace(/\s@/gim,',').replace(/\s*/gim,'').replace(/@/,',')
    let strNewArray = strNew.split(',')
    for(let i = 0; i < strNewArray.length; i++) {
      for(let j = 0; j < users.length; j++) {
        if(strNewArray[i] === users[j]['name']) {
          strNewArray[i] = users[j]['user_id']
          break
        }
      }
    }
    strNew = strNewArray.length ? `${strNewArray.join(',').replace(/,/gim,' @')}` : ''

    const e = toContentState(strNew)
    const a = toString(e)
    const b = a.length > 2 ? a.replace('@','').replace(/@/gim, ',').replace(/\s/gim, '') : a
    this.updateEdit({value: b}, 'recipients')

  }
  //流转类型
  transferModeChange(e) {
    this.updateEdit({value: e.target.value}, 'transfer_mode')
  }
  //可撤回
  enableRevocationChange(e) {
    this.updateEdit({value: e.target.checked? '1':'0'}, 'enable_revocation')
  }
  //是否填写意见
  enableOpinionChange(e) {
    this.updateEdit({value: e.target.checked? '1':'0'}, 'enable_opinion')
  }
  //删除
  deleteProcessStep(){
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep  } } = this.props.model
    if(processEditDatas.length <= 1|| processEditDatasRecords.length <= 1) {
      return false
    }
    if(processEditDatasRecords.length) {
      processEditDatasRecords.splice(processCurrentEditStep, 1)
    }
    if(processEditDatas.length) {
      processEditDatas.splice(processCurrentEditStep, 1)
    }
    this.props.updateDatas({
      processEditDatasRecords,
      processEditDatas,
      processCurrentEditStep: processCurrentEditStep > 1 ? processCurrentEditStep - 1 : 0
    })
  }

  render() {
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep = 0, projectDetailInfoData = {}  } } = this.props.model
    const { name, description, deadline_type, deadline_value, is_workday, assignee_type, assignees, transfer_mode, enable_revocation, enable_opinion, cc_type, recipients } = processEditDatas[processCurrentEditStep]
    //推进人一项
    const users = projectDetailInfoData.data
    let suggestions = []
    for(let i = 0; i < users.length; i++) {
      suggestions.push(users[i].full_name || users[i].email || users[i].mobile)
    }
    let defaultAssignees = assignees ? `@${assignees.replace(/,/gim,' @')}` : ''
    //抄送人
    let suggestions2 = []
    for(let i = 0; i < users.length; i++) {
      suggestions2.push(users[i].full_name || users[i].email || users[i].mobile)
    }
    let defaultRecipients = recipients ? `${recipients.replace(/,/gim,'@ ')}` : ''

    //--------------------
    //抄送人@123 @234’格式的数据， @后面跟的是id。 转化数组，遍历得到id的名字，填入mention
    let defaultRecipientsNew = recipients.replace(/\s@/gim,',').replace(/\s*/gim,'')
    let defaultRecipientsNewArray = defaultRecipientsNew.split(',')
    for(let i = 0; i < defaultRecipientsNewArray.length; i++) {
      for(let j = 0; j < users.length; j++) {
        if(defaultRecipientsNewArray[i] === users[j]['user_id']) {
          defaultRecipientsNewArray[i] = users[j]['name']
          break
        }
      }
    }
    defaultRecipientsNew = defaultRecipientsNewArray.length ? `${defaultRecipientsNewArray.join(',').replace(/,/gim,' @')}` : ''
    //----------------

    return (
      <div className={indexStyles.editFormOut}>
        <div className={indexStyles.editTop}>
          <div className={indexStyles.editTop_left}></div>
          <div className={indexStyles.editTop_right}>
            <div>抄送</div>
            <div>
              通过抄送流程上文来触发的步骤称之为抄送，适用于针对上文流程中的信息进行风险或结果知会的场景使用。
            </div>
          </div>
        </div>
        <div className={indexStyles.editBott}>
          {/*名称*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span  style={{fontSize: 14}}>名称</span><br/>
              <span  style={{fontSize: 12, color: '#8c8c8c'}}>给步骤起个名称</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <Input value={name} placeholder="输入步骤名称" style={{height: 40}} onChange={this.nameChange.bind(this)}/>
            </div>
          </div>
          {/*描述*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span  style={{fontSize: 14}}>描述</span><br/>
              <span style={{fontSize: 12,color: '#8c8c8c'}}>指引如何完成与<br/>明确标准</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <TextArea value={description} style={{height: 72,resize: 'none'}} onChange={this.descriptionChange.bind(this)} placeholder="输入描述"/>
            </div>
          </div>
          {/*完成期限*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>完成期限</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>从发起流程开始<br/>计算</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.deadlineChange.bind(this)} value={deadline_type}>
                <Radio className={indexStyles.ratio} value={'1'}>无限期</Radio>
                <Radio className={indexStyles.ratio}value={'2'}>启动流程时指定</Radio>
                <Radio className={indexStyles.ratio} value={'3'}>固定天数</Radio>
              </RadioGroup>
              {deadline_type === '3'? (
                <div>
                  <InputNumber min={1} value={Number(deadline_value)}  onChange={this.deadlineDayChange.bind(this)} style={{width:70, height: 32,marginRight: 8}}  />天 <Checkbox onChange={this.isWorkdayChange.bind(this)} checked={is_workday === '1'} style={{margin: '8px 8px 0 12px '}}/>只计算工作日
                </div>
                ):('')}
            </div>
          </div>
          {/*推进人*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>推进人</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>由谁来推进流程</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.assigneeTypeChange.bind(this)} value={assignee_type} >
                <Radio className={indexStyles.ratio} value={'1'}>任何人</Radio>
                <Radio className={indexStyles.ratio}value={'2'}>启动流程时指定</Radio>
                <Radio className={indexStyles.ratio} value={'3'}>固定人选</Radio>
              </RadioGroup>
              {assignee_type === '3'? (
                <div>
                  <MentionAssignees {...this.props} defaultAssignees={defaultAssignees} suggestions={suggestions} mentionOnChange={this.mentionOnChange.bind(this)}/>
                  {/*<Mention*/}
                  {/*style={{ width: '100%', height: 70 }}*/}
                  {/*onChange={this.mentionOnChange.bind(this)}*/}
                  {/*defaultValue={toContentState(defaultAssignees)}*/}
                  {/*suggestions={suggestions}*/}
                  {/*/>*/}
                </div>
              ) :('')}

            </div>
          </div>
          {/*抄送人*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>抄送人</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>支持系统内成员与电子邮件地址</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.ccTypeChange.bind(this)} value={cc_type} >
                {/*<Radio className={indexStyles.ratio} value={'1'}>任何人</Radio>*/}
                <Radio className={indexStyles.ratio}value={'1'}>启动流程时指定</Radio>
                <Radio className={indexStyles.ratio} value={'2'}>固定人选</Radio>
              </RadioGroup>
              {cc_type === '2'? (
                <div>
                  {/*<MentionAssignees {...this.props} defaultAssignees={defaultAssignees} suggestions={suggestions} mentionOnChange={this.mentionOnChange.bind(this)}/>*/}
                  <Mention
                    placeholder={'输入“@”选择'}
                    style={{ width: '100%', height: 70 }}
                    onChange={this.mentionOnChange2.bind(this)}
                    // defaultValue={toContentState(defaultRecipients)}
                    defaultValue={toContentState(defaultRecipientsNew)}
                    suggestions={suggestions2}
                  />
                </div>
              ) :('')}

            </div>
          </div>
          {/*流转*/}
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>流转</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>设置流转逻辑</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.transferModeChange.bind(this)} value={transfer_mode}>
                {/*<Radio className={indexStyles.ratio} value={'1'}>自由选择</Radio>*/}
                <Radio className={indexStyles.ratio}value={'2'}>下一步</Radio>
              </RadioGroup>
              <Checkbox value="1"  onChange={this.enableRevocationChange.bind(this)} checked={enable_revocation === '1'} className={indexStyles.checkBox}>可撤回</Checkbox>
              <Checkbox value="2" onChange={this.enableOpinionChange.bind(this)} checked={enable_opinion === '1'} className={indexStyles.checkBox}>须填写意见</Checkbox>
            </div>
          </div>
          {/*删除*/}
          {/*<div style={{textAlign: 'center'}}>*/}
            {/*<Button style={{color: 'red',margin: '0 auto'}} onClick={this.deleteProcessStep.bind(this)}>删除步骤</Button>*/}
          {/*</div>*/}
          <div style={{height: 20}}></div>

        </div>
      </div>
    )
  }
}

