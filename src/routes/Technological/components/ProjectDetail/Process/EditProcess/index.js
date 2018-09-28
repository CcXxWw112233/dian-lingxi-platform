import React from 'react'
import indexStyles from './index.less'
import { Icon, Button } from 'antd'
import EditFormOne from './EditFormOne'
import EditFormTwo from './EditFormTwo'
import EditFormThree from './EditFormThree'
import EditFormFour from './EditFormFour'
import EditFormFive from './EditFormFive'
import SaveTemplate from './SaveTemplate'


export default class EditProcess extends React.Component {
  state = {
    saveTemplateModalVisible: false
  }
  nodeTypeClick(node_type) {
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep  } } = this.props.model
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
  addNode(node_type) { //添加每一项默认里程碑开始，当前步数跳到最新
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep = 0  } } = this.props.model
    const nodeObj = {
      "name":"编辑节点名称",//节点名称
      "node_type":"1",//节点类型：1代表里程碑节点
      "description":"",
      "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
      "deadline_value":"1",//完成期限值
      "is_workday":"0",
      "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
      "assignees":"",//审批人(id) 多个逗号隔开
      "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
      "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
      "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
    }
    const recordItemobjs =  {
      'node_type': '1',
      'alltypedata': [
        {
          "name":"编辑节点名称",//节点名称
          "node_type":"1",//节点类型：1代表里程碑节点
          "description":"",
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
          "assignees":"",//审批人(id) 多个逗号隔开
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
        },
        {
          "name":"编辑节点名称",
          "node_type":"2",//节点类型：2代表上传节点
          "description":"",
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
          "assignees":"",//审批人(id) 多个逗号隔开
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
          "require_data":{
            "limit_file_num":"0",//限制文件上传数量 0=不限制
            "limit_file_type":"1,2,3,4",//限制上传类型(文件格式)1=文档 2=图像 3=音频 4=视频
            "limit_file_size":"20"//限制文件大小
          }
        },
        {
          "name":"编辑节点名称",
          "node_type":"3",//节点类型：3代表填写节点
          "description":"",
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
          "assignees":"",//审批人(id) 多个逗号隔开
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
          "form_data":[
            {
              "field_type":"1",//字段类型 1=输入框
              "property_name":"输入框",//属性名称(标题)
              "default_value":"默认值",//默认值
              "verification_rule":"email",//校验规则 '' =不校验格式 mobile = 手机号码，tel = 座机，ID_card = 身份证号码，chinese_name = 中文名，url = 网址,qq = QQ号，postal_code = 邮政编码，positive_integer = 正整数，negative = 负数，two_decimal_places = 精确到两位小数
              "val_length":"20",//长度
              "is_required":"1"//是否必须 1=必须 0=不是必须
            },
            {
              "field_type":"2",//字段类型 2=日期选择
              "property_name":"日期选择",//属性名称(标题)
              "default_value":"默认值",//默认值
              "verification_rule":"SINGLE_DATE_TIME",//校验规则 单个+日期+时分 = SINGLE_DATE_TIME ,单个+日期 = SINGLE_DATE,多个+日期+时分 = MULTI_DATE_TIME ,多个+日期 = MULTI_DATE
              "is_required":"1"//是否必须 1=必须 0=不是必须
            },
            {
              "field_type":"3",//字段类型 3=下拉框
              "property_name":"下拉框",//属性名称(标题)
              "default_value":"默认值",//默认值(预设值)
              "verification_rule":"redio",//校验规则 redio = 单选， multiple = 多选 ，province = 省市区
              "is_required":"1",//是否必须 1=必须 0=不是必须
              "options_data":[
                "one","two"
              ]
            }
          ]
        },
        {
          "name":"编辑节点名称",
          "node_type":"4",//节点类型：4代表抄送节点
          "description":"",
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"1",//抄送人类型 2=启动流程时指定 3=固定人选
          "assignees":"",//抄送人 多个逗号隔开（传的是邮箱）
          "cc_type":"1",//抄送人类型 1=启动流程时指定 2=固定人选
          "recipients":"",//抄送人 多个逗号隔开（传的是邮箱）
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
        },
        {
          "name":"编辑节点名称",
          "node_type":"5",//节点类型：5代表审批节点
          "description":"",
          "approve_type":"1",//审批模式 1=串签 2=并签 3=汇签
          "approve_value":"",//汇签值 当approve_type=3 时该字段有效
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"2",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
          "assignees":"",//审批人(id) 多个逗号隔开
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
        },
      ],
    }

    processEditDatasRecords.push(recordItemobjs)
    processEditDatas.push(nodeObj)
    this.props.updateDatas({
      processEditDatasRecords,
      processEditDatas,
      processCurrentEditStep: processEditDatasRecords.length - 1,
      node_type: '1'
    })
  }

  currentEditStepClick(data) {
    const { datas: { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep = 0  } } = this.props.model
    const { value, key } = data
    const { node_type } = value
    this.props.updateDatas({
      processCurrentEditStep: key,
      node_type
    })
  }

  setSaveTemplateModalVisible() {
    this.setState({
      saveTemplateModalVisible: !this.state.saveTemplateModalVisible
    })
  }
  quitEdit() {
    this.props.updateDatas({
      processPageFlagStep: '1',
      node_type: '1', //节点类型
      processCurrentEditStep: 0, //编辑第几步，默认 0
      processEditDatas: [
        {
          "name":"编辑节点名称",//节点名称
          "node_type":"1",//节点类型：1代表里程碑节点
          "description":"",
          "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
          "deadline_value":"1",//完成期限值
          "is_workday":"0",
          "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
          "assignees":"",//审批人(id) 多个逗号隔开
          "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
          "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
          "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
        },
      ], //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
      processEditDatasRecords: [
        { 'node_type': '1',
          'alltypedata': [
            {
              "name":"编辑节点名称",//节点名称
              "node_type":"1",//节点类型：1代表里程碑节点
              "description":"",
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"1",//完成期限值
              "is_workday":"0",
              "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
              "assignees":"",//审批人(id) 多个逗号隔开
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
            },
            {
              "name":"编辑节点名称",
              "node_type":"2",//节点类型：2代表上传节点
              "description":"",
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"1",//完成期限值
              "is_workday":"0",
              "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
              "assignees":"",//审批人(id) 多个逗号隔开
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
              "requires_data":{
                "limit_file_num":"0",//限制文件上传数量 0=不限制
                "limit_file_type":"1,2,3,4",//限制上传类型(文件格式)1=文档 2=图像 3=音频 4=视频
                "limit_file_size":"20"//限制文件大小
              }
            },
            {
              "name":"编辑节点名称",
              "node_type":"3",//节点类型：3代表填写节点
              "description":"",
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"1",//完成期限值
              "is_workday":"0",
              "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
              "assignees":"",//审批人(id) 多个逗号隔开
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
              "forms_data":[
                {
                  "field_type":"1",//字段类型 1=输入框
                  "property_name":"输入框",//属性名称(标题)
                  "default_value":"默认值",//默认值
                  "verification_rule":"email",//校验规则 '' =不校验格式 mobile = 手机号码，tel = 座机，ID_card = 身份证号码，chinese_name = 中文名，url = 网址,qq = QQ号，postal_code = 邮政编码，positive_integer = 正整数，negative = 负数，two_decimal_places = 精确到两位小数
                  "val_length":"20",//长度
                  "is_required":"1"//是否必须 1=必须 0=不是必须
                },
                {
                  "field_type":"2",//字段类型 2=日期选择
                  "property_name":"日期选择",//属性名称(标题)
                  "default_value":"默认值",//默认值
                  "verification_rule":"SINGLE_DATE_TIME",//校验规则 单个+日期+时分 = SINGLE_DATE_TIME ,单个+日期 = SINGLE_DATE,多个+日期+时分 = MULTI_DATE_TIME ,多个+日期 = MULTI_DATE
                  "is_required":"1"//是否必须 1=必须 0=不是必须
                },
                {
                  "field_type":"3",//字段类型 3=下拉框
                  "property_name":"下拉框",//属性名称(标题)
                  "default_value":"默认值",//默认值(预设值)
                  "verification_rule":"redio",//校验规则 redio = 单选， multiple = 多选 ，province = 省市区
                  "is_required":"1",//是否必须 1=必须 0=不是必须
                  "options_data":[
                    "one","two"
                  ]
                }
              ]
            },
            {
              "name":"编辑节点名称",
              "node_type":"4",//节点类型：4代表抄送节点
              "description":"",
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"1",//完成期限值
              "is_workday":"0",
              "assignee_type":"1",//抄送人类型 2=启动流程时指定 3=固定人选
              "assignees":"",//抄送人 多个逗号隔开（传的是邮箱）
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
            },
            {
              "name":"编辑节点名称",
              "node_type":"5",//节点类型：5代表审批节点
              "description":"",
              "approve_type":"1",//审批模式 1=串签 2=并签 3=汇签
              "approve_value":"",//汇签值 当approve_type=3 时该字段有效
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"1",//完成期限值
              "is_workday":"0",
              "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
              "assignees":"",//审批人(id) 多个逗号隔开
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
            },
          ]
        },
      ] //每一步的每一个类型，记录，数组的全部数据step * type
    })
  }
  directStart(){
    const { datas: { projectDetailInfoData = {}, processEditDatas } } = this.props.model
    const { board_id } = projectDetailInfoData
    this.props.directStartSaveTemplate({
      board_id,
      is_retain: '0',
      node_data: JSON.stringify(processEditDatas),
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
              {/*<div className={node_type === '3' ? indexStyles.selectType : ''} onClick={this.nodeTypeClick.bind(this, '3')}>填写</div>*/}
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
