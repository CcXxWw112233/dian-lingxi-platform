/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, Mention, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import indexStyles from './index.less'
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const { toString, toContentState } = Mention;

export default class EditFormTwo extends React.Component {
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
            <div>上传</div>
            <div>
              通过上传文件来触发的步骤称之为上传，适用于引导用户在流程中按要求提交需收集的文件。
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
              <span>要求</span><br/>
              <span style={{fontSize: 12, color: '#8c8c8c'}}>上传数量、格式<br/>及大小</span>
            </div>
            <div className={indexStyles.editBottItem_right}>
              <div style={{color: '#262626'}}>
                限制上传数量为&nbsp;&nbsp;<InputNumber style={{width: 70}} defaultValue={0} min={0} />&nbsp;&nbsp;个文件<span style={{color: '#8c8c8c'}}>（0为不限制）</span>
              </div>
              <div style={{color: '#262626'}}>
                限制文件格式为&nbsp;&nbsp;
                <Checkbox.Group style={{color: '#262626',marginTop: 14}} onChange={this.checkBoxOnChange.bind(this)}>
                  <Checkbox value="1" style={{color: '#262626'}}>文档</Checkbox>
                  <Checkbox value="2" style={{color: '#262626'}}>图像</Checkbox>
                  <Checkbox value="3" style={{color: '#262626'}}>音频</Checkbox>
                  <Checkbox value="4" style={{color: '#262626'}}>视频</Checkbox>
                </Checkbox.Group>
              </div>
              <div style={{color: '#262626',marginTop: 14}}>
                限制文件大小为&nbsp;&nbsp;<InputNumber style={{width: 70}} defaultValue={0} min={0} />&nbsp;&nbsp;MB<span style={{color: '#8c8c8c'}}>（0为不限制）</span>
              </div>
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
              <span>推进人</span><br/>
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
              </Checkbox.Group>
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

