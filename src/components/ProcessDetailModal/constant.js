export const processEditDatasItemOneConstant = {
  "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "deadline_type": "1",//期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "assignee_type": "1",//审批人类型 1=任何人 2=指定人员
  "assignees": "",//审批人 多个逗号隔开
  "cc_type": "",//抄送人类型 1=设置抄送人 0=不设置抄送人
  "cc_locking": "0",//抄送人锁定 1=锁定抄送人 0=不锁定抄送人
  "recipients": "",//抄送人
  "forms": [],
  "is_confirm": '0', // 是否确认
  "is_edit": '0', // 是否进入编辑
}

export const processEditDatasItemTwoConstant = {
  "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "approve_type": "1",//审批类型 1=串签 2=并签 3=汇签
  "approve_value": "",// 当为 汇签时需填的值
  "deadline_type": "1",//期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "assignees": "",//审批人 多个逗号隔开
  "cc_type": "",//抄送人类型 1=设置抄送人 0=不设置抄送人
  "cc_locking": "0",//抄送人锁定 1=锁定抄送人 0=不锁定抄送人
  "recipients": "",//抄送人
  "is_confirm": "0",
  "is_edit": '0', // 是否进入编辑
}

export const processEditDatasItemThreeConstant = {
  "node_type": "3",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "deadline_type": "1", // 期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "cc_type": "",//抄送人类型 1=自动抄送 2=手动抄送
  "recipients": "",//抄送人 多个逗号隔开
  "assignees": "",//抄报人 多个逗号隔开
  "weight_coefficient": "", // 是否开启权重
  "computing_mode": "", // 计算方式
  "results_score": "", // 结果分数
  "remaining_circumstances": "", // 其余情况
  "scoreList": [
    {
      "key": "0",
      "title": "评分项",
      "weight_value": '100',
      "grade_value": '100',
      "description": '',
    }
  ], // 评分项
  "is_confirm": "0",
  "is_edit": '0', // 是否进入编辑
}

// 假数据

export const principalList = [
  {
    "user_id": "1207501040593801216",
    "name": "rabbitQi",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2020-01-09/43f14b585cff4de2ae18d23555e72192.jpeg"
  },
  {
    "user_id": "1195311878813913088",
    "name": "一只加菲吖",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-11-22/293c32e5af584288a238cc58d1c6a66f.jpg"
  },

  {
    "user_id": "1158204054019641344",
    "name": "加菲猫",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2020-01-10/4e5a59a2afad4c79a11429bd1771c12c.jpg"
  }
]

// 表格数据
export const tableList = [
  {
    "key": '0',
    "title": '标题1',
    "weight_value": '',
    "grade_value": '',
    "description": '',
  },
  {
    "key": '1',
    "title": '标题2',
    "weight_value": '',
    "grade_value": '',
    "description": '',
  },
]

// 评分人列表
export const ratingsList = [
  {
    "passed": "2",
    "user_id": "1195311878813913088",
    "name": "一只加菲吖",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-11-22/293c32e5af584288a238cc58d1c6a66f.jpg",
    "suggestion": "符合报销流程",
    "create_time": "1584582196000",
    "ratingDetail": [
      {
        "key": "0",
        "title": "评分项",
        "weight_value": '100',
        "grade_value": '100',
        "description": '楼下老爷爷',
      }
    ]
  },
]
