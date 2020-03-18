import React, { Component } from 'react'
import indexStyles from './index.less'
import TemplateContent from './component/TemplateContent'
import PagingnationContent from './component/PagingnationContent'
import { Tabs } from 'antd';
import { connect } from 'dva'
import ProcessDetailModal from '../../../../../components/ProcessDetailModal'

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}
const TabPane = Tabs.TabPane
@connect(mapStateToProps)
export default class ProcessDefault extends Component {
  state = {
    clientHeight: changeClientHeight()
  }
  constructor() {
    super()
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }
  resizeTTY = () => {
    const clientHeight = changeClientHeight();//获取页面可见高度
    this.setState({
      clientHeight
    })
  }

    // 新增模板点击事件
    handleAddTemplate = () => {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processPageFlagStep: '1',
          process_detail_modal_visible: true
        }
      })
    }
  
    // 编辑模板的点击事件
    handleEditTemplete = () => {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processPageFlagStep: '2',
          process_detail_modal_visible: true,
          processEditDatas: [
            {
              "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
              "name": "资料收集节点",//流程节点名称
              "description": "描述",//描述 备注
              "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
              "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
              "deadline_value": "1",//完成期限值
              "assignee_type": "2",//审批人类型 1=任何人 2=指定人员
              "assignees": "1158204054019641344",//审批人 多个逗号隔开
              "is_edit": '1',
              "forms": [//表单数据
                {
                  "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "文本标题",//标题
                  "prompt_content": "请填写",//提示内容
                  "is_required": "0",//是否必填 1=必须 0=不是必须
                  "verification_rule": "shuzi",//校验规则
                  "val_min_length": "10",//最小长度
                  "val_max_length": "20"//最大长度
                },
                {
                  "field_type": "2",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "性别",//标题
                  "prompt_content": "请选择",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "is_multiple_choice": "0",//是否多选 1=是 0=否
                  "options": [//选择项
                    {
                      "label_name": "男",
                      "label_value": "男"
                    },
                    {
                      "label_name": "女",
                      "label_value": "女"
                    }
                  ]
                },
                {
                  "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "生日",//标题
                  "prompt_content": "您的出生日期",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
                  "date_precision": "1"//日期精度 1=仅日期 2=日期+时间
                },
                {
                  "field_type": "5",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "简历",//标题
                  "prompt_content": "请上传简历",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "limit_file_num": "1",//上传数量
                  "limit_file_type": [//限制上传类型(文件格式) document=文档 image=图像 audio=音频 video=视频
                    "document", "image", "audio", "video"
                  ],
                  "limit_file_size": "10"//上传大小限制
                }
              ]
            },
            {
              "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
              "name": "审批节点",//流程节点名称
              "description": "备注",//描述 备注
              "approve_type": "1",//审批类型 1=串签 2=并签 3=汇签
              "approve_value": "",// 当为 汇签时需填的值
              "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
              "deadline_time_type": "hour",//完成期限类型 hour = 时 day =天 month = 月
              "deadline_value": "10",//完成期限值
              "assignees": "1158204054019641344",//审批人 多个逗号隔开
              "is_edit": '1',
            }
          ]
        }
      })
    }
  
    // 启动流程的点击事件
    handleStartProcess = () => {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processPageFlagStep: '3',
          process_detail_modal_visible: true,
          processEditDatas: [
            {
              "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
              "name": "资料收集节点",//流程节点名称
              "description": "描述",//描述 备注
              "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
              "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
              "deadline_value": "1",//完成期限值
              "assignee_type": "2",//审批人类型 1=任何人 2=指定人员
              "assignees": "1158204054019641344",//审批人 多个逗号隔开
              "forms": [//表单数据
                {
                  "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "文本标题",//标题
                  "prompt_content": "请填写",//提示内容
                  "is_required": "0",//是否必填 1=必须 0=不是必须
                  "verification_rule": "shuzi",//校验规则
                  "val_min_length": "10",//最小长度
                  "val_max_length": "20"//最大长度
                },
                {
                  "field_type": "2",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "性别",//标题
                  "prompt_content": "请选择",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "is_multiple_choice": "0",//是否多选 1=是 0=否
                  "options": [//选择项
                    {
                      "label_name": "男",
                      "label_value": "男"
                    },
                    {
                      "label_name": "女",
                      "label_value": "女"
                    }
                  ]
                },
                {
                  "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "生日",//标题
                  "prompt_content": "您的出生日期",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
                  "date_precision": "1"//日期精度 1=仅日期 2=日期+时间
                },
                {
                  "field_type": "5",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                  "title": "简历",//标题
                  "prompt_content": "请上传简历",//提示内容
                  "is_required": "1",//是否必填 1=必须 0=不是必须
                  "limit_file_num": "1",//上传数量
                  "limit_file_type": [//限制上传类型(文件格式) document=文档 image=图像 audio=音频 video=视频
                    "document", "image", "audio", "video"
                  ],
                  "limit_file_size": "10"//上传大小限制
                }
              ]
            },
            {
              "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
              "name": "审批节点",//流程节点名称
              "description": "备注",//描述 备注
              "approve_type": "1",//审批类型 1=串签 2=并签 3=汇签
              "approve_value": "",// 当为 汇签时需填的值
              "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
              "deadline_time_type": "hour",//完成期限类型 hour = 时 day =天 month = 月
              "deadline_value": "10",//完成期限值
              "assignees": "1158204054019641344"//审批人 多个逗号隔开
            }
          ]
        }
      })
    }

    // 流程实例的点击事件
    handleProcessInfo = () => {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processPageFlagStep: '4',
          process_detail_modal_visible: true,
          processInfo: {
            "board_id": "1238724358210457600",//项目ID
            "name": "床前明月光",//模板名称
            "description": "第一个流程模板",//模板描述
            "is_retain": "1",//是否保留 1=保留 0=不保留,默认保留
            "nodes": [//模板节点 json数组
              {
                "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
                "name": "资料收集节点",//流程节点名称
                "description": "描述",//描述 备注
                "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
                "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
                "deadline_value": "1",//完成期限值
                "assignee_type": "2",//审批人类型 1=任何人 2=指定人员
                "assignees": "1110064610620346368",//审批人 多个逗号隔开
                "cc_type": "1",//抄送人类型 1=设置抄送人 0=不设置抄送人
                "cc_locking": "1",//抄送人锁定 1=锁定抄送人 0=不锁定抄送人
                "recipients": "",//抄送人
                "froms": [//表单数据
                  {
                    "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                    "title": "文本标题",//标题
                    "prompt_content": "请填写",//提示内容
                    "is_required": "0",//是否必填 1=必须 0=不是必须
                    "verification_rule": "shuzi",//校验规则
                    "val_min_length": "10",//最小长度
                    "val_max_length": "20"//最大长度
                  },
                  {
                    "field_type": "2",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                    "title": "性别",//标题
                    "prompt_content": "请选择",//提示内容
                    "is_required": "1",//是否必填 1=必须 0=不是必须
                    "is_multiple_choice": "0",//是否多选 1=是 0=否
                    "options": [//选择项
                      {
                        "label_name": "男",
                        "label_value": "男"
                      },
                      {
                        "label_name": "女",
                        "label_value": "女"
                      }
                    ]
                  },
                  {
                    "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                    "title": "生日",//标题
                    "prompt_content": "您的出生日期",//提示内容
                    "is_required": "1",//是否必填 1=必须 0=不是必须
                    "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
                    "date_precision": "1"//日期精度 1=仅日期 2=日期+时间
                  },
                  {
                    "field_type": "5",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
                    "title": "简历",//标题
                    "prompt_content": "请上传简历",//提示内容
                    "is_required": "1",//是否必填 1=必须 0=不是必须
                    "limit_file_num": "1",//上传数量
                    "limit_file_type": [//限制上传类型(文件格式) document=文档 image=图像 audio=音频 video=视频
                      "document", "image", "audio", "video"
                    ],
                    "limit_file_size": "10"//上传大小限制
                  }
                ]
              },
              {
                "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
                "name": "审批节点",//流程节点名称
                "description": "备注",//描述 备注
                "approve_type": "1",//审批类型 1=串签 2=并签 3=汇签
                "approve_value": "",// 当为 汇签时需填的值
                "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
                "deadline_time_type": "hour",//完成期限类型 hour = 时 day =天 month = 月
                "deadline_value": "10",//完成期限值
                "assignees": "1110064610620346368,1110381102486392832",//审批人 多个逗号隔开
                "cc_type": "1",//抄送人类型 1=设置抄送人 0=不设置抄送人
                "cc_locking": "1",//抄送人锁定 1=锁定抄送人 0=不锁定抄送人
                "recipients": ""//抄送人
              }
            ]
          }
        }
      })
    }

  renderFlowTabs = () => {
    const { clientHeight } = this.state
    const { processDoingList = [], processStopedList = [], processComepletedList = [] } = this.props
    return (
      <Tabs defaultActiveKey="1" onChange={this.tabsChange} tabBarStyle={{ width: '100%', paddingTop: 0, fontSize: 16, background: 'rgba(216,216,216,0)' }}>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>进行中的流程 </div>} key="1">{<PagingnationContent handleProcessInfo={this.handleProcessInfo} listData={processDoingList} status={'1'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已中止的流程 </div>} key="2">{<PagingnationContent listData={processStopedList} status={'2'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已完成的流程 </div>} key="3">{<PagingnationContent listData={processComepletedList} status={'3'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>未开始的流程 </div>} key="4">{<PagingnationContent listData={processComepletedList} status={'3'} clientHeight={clientHeight} />}</TabPane>
      </Tabs>
    )
  }

  render() {
    const { process_detail_modal_visible } = this.props
    const { clientHeight } = this.state
    return (
      <>
      <div className={indexStyles.processDefautOut}>
        <div className={indexStyles.processDefautOut_top}>
          <div className={indexStyles.title}>模板:</div>
          <TemplateContent 
            handleAddTemplate={this.handleAddTemplate}
            handleEditTemplete={this.handleEditTemplete}
            handleStartProcess={this.handleStartProcess}
          />
        </div>
        {/*右方流程*/}
        <div className={indexStyles.processDefautOut_bottom}>
          {this.renderFlowTabs()}
        </div>
      </div>
      {
          process_detail_modal_visible && (
            <ProcessDetailModal process_detail_modal_visible={process_detail_modal_visible} />
          )
        }
      </>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible
  }
}) {
  return {
    process_detail_modal_visible
  }
}