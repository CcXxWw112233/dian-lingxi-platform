/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, Mention, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,Tooltip } from 'antd';
import indexStyles from './index.less'
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const { toString, toContentState } = Mention;

export default class EditFormFive extends React.Component {
  state={
    ratioValue: 1
  }
  ratioOnChange(e) {
    this.setState({
      ratioValue: e.target.value
    })
  }
  mentionOnSelect(e) {

  }
  mentionOnChange(contentState){
    console.log(toString(contentState));
  }
  checkBoxOnChange() {}
  render() {
    return (
      <div className={indexStyles.editFormOut}>
        <div className={indexStyles.editTop}>
          <div className={indexStyles.editTop_left}></div>
          <div className={indexStyles.editTop_right}>
            <div>审批</div>
            <div>
              通过审批结果来触发的步骤称之为审批，适用于针对上文流程中的信息进行风险确认的场景使用。
            </div>
          </div>
        </div>
        <div className={indexStyles.editBott}>
          <div className={indexStyles.editBottItem}>
             <div className={indexStyles.editBottItem_left}>
               <span  style={{fontSize: 14}}>名称</span><br/>
               <span  style={{fontSize: 12, color: '#8c8c8c'}}>给步骤起个名称</span>
             </div>
             <div className={indexStyles.editBottItem_right}>
               <Input placeholder="输入步骤名称" style={{height: 40}}/>
             </div>
           </div>
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span  style={{fontSize: 14}}>描述</span><br/>
              <span style={{fontSize: 12,color: '#8c8c8c'}}>指引如何完成与<br/>明确标准</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <TextArea style={{height: 72,resize: 'none'}} placeholder="输入描述"/>

            </div>
          </div>
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>审批模式</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>针对多审批人时<br/>的通过标准设定</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.ratioOnChange.bind(this)} value={this.state.ratioValue}>
                <Radio value={1}>串签</Radio>
                <Tooltip title="依照审批人设置顺序推进审批。">
                  <span style={{cursor:'pointer',marginTop:0,marginLeft:-8,marginRight:20,lineHeight: '18px',textAlign: 'center',display: 'inline-block', borderRadius: 20,height: 18,width: 18,color: '#ffffff',backgroundColor: '#e5e5e5'}}>?</span>
                </Tooltip>
                <Radio value={2}>并签</Radio>
                <Tooltip title="所有审批人同时开展审批。">
                  <span style={{cursor:'pointer',marginTop:0,marginLeft:-8,marginRight:20,lineHeight: '18px',textAlign: 'center',display: 'inline-block', borderRadius: 20,height: 18,width: 18,color: '#ffffff',backgroundColor: '#e5e5e5'}}>?</span>
                </Tooltip>
                <Radio value={3}>汇签</Radio>
                <Input  style={{width:60}}/>  &nbsp; %  通过
                <Tooltip title="审批过程不公开其他审批人的意见，通过率达到设定的标准后触发流转，随后再公开所有审批意见。">
                  <span style={{cursor:'pointer',marginTop:0,marginLeft:6,marginRight:20,lineHeight: '18px',textAlign: 'center',display: 'inline-block', borderRadius: 20,height: 18,width: 18,color: '#ffffff',backgroundColor: '#e5e5e5'}}>?</span>
                </Tooltip>
              </RadioGroup>
            </div>
          </div>

          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>完成期限</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>从发起流程开始<br/>计算</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.ratioOnChange.bind(this)} value={this.state.ratioValue}>
                <Radio className={indexStyles.ratio} value={1}>无限期</Radio>
                <Radio className={indexStyles.ratio}value={2}>启动流程时指定</Radio>
                <Radio className={indexStyles.ratio} value={3}>固定天数</Radio>
              </RadioGroup>
              <div>
                <Input style={{width:70, height: 32,marginRight: 8}}/>天 <Checkbox style={{margin: '8px 8px 0 12px '}}/>只计算工作日
              </div>
            </div>
          </div>
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>审批人</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>由谁来推进流程</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.ratioOnChange.bind(this)} value={this.state.ratioValue}>
                <Radio className={indexStyles.ratio} value={1}>任何人</Radio>
                <Radio className={indexStyles.ratio}value={2}>启动流程时指定</Radio>
                <Radio className={indexStyles.ratio} value={3}>固定人选</Radio>
              </RadioGroup>
              <div>
                <Mention
                  style={{ width: '100%', height: 70 }}
                  onChange={this.mentionOnChange.bind(this)}
                  defaultValue={toContentState('@afc163')}
                  suggestions={['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご']}
                  onSelect={this.mentionOnSelect.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className={indexStyles.editBottItem}>
            <div className={indexStyles.editBottItem_left}>
              <span>流转</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>设置流转逻辑</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <RadioGroup onChange={this.ratioOnChange.bind(this)} value={this.state.ratioValue}>
                <Radio className={indexStyles.ratio} value={1}>自由选择</Radio>
                <Radio className={indexStyles.ratio}value={2}>下一步</Radio>
              </RadioGroup>
              <Checkbox.Group style={{ width: '100%' }} onChange={this.checkBoxOnChange.bind(this)}>
                <Checkbox value="1" className={indexStyles.checkBox}>可撤回</Checkbox>
                <Checkbox value="2" className={indexStyles.checkBox}>须填写意见</Checkbox>
              </Checkbox.Group>,
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button style={{color: 'red',margin: '0 auto'}}>删除步骤</Button>
          </div>
        </div>
      </div>
    )
  }
}

