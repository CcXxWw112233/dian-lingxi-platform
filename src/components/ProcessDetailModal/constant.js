export const processEditDatasConstant = [
  {
    "name": "",
    "node_type": "1", //节点类型：3代表填写节点
    "description": "",
    "deadline_type": "d", //完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
    "deadline_value": "1", //完成期限值
    "is_workday": "0",
    "assignee_type": "1", //审批人类型 1=任何人 2=启动流程时指定 3=固定人选
    "assignees": "", //审批人(id) 多个逗号隔开
    "transfer_mode": "2", //流转方式 1=自由选择 2= 下一步
    "enable_revocation": "1", //是否可撤回 1=可撤回 0=不可撤回
    "enable_opinion": "1", //是否填写意见  1=填写 0=不填写
    "is_confirm": "0",
    "form_data": [
    ]
  },
  // {
  //   "name": "", //节点名称
  //   "node_type": "1", //节点类型：1代表里程碑节点
  //   "description": "",
  //   "deadline_type": "1", //完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
  //   "deadline_value": "1", //完成期限值
  //   "is_workday": "0",
  //   "assignee_type": "1", //审批人类型 1=任何人 2=启动流程时指定 3=固定人选
  //   "assignees": "", //审批人(id) 多个逗号隔开
  //   "transfer_mode": "2", //流转方式 1=自由选择 2= 下一步
  //   "enable_revocation": "1", //是否可撤回 1=可撤回 0=不可撤回
  //   "enable_opinion": "1"//是否填写意见  1=填写 0=不填写
  // },
]

export const processEditDatasRecordsConstant = [
  {
    'node_type': '1',
    'alltypedata': [
      {
        "name": "",
        "node_type": "1", //节点类型：3代表填写节点
        "description": "",
        "deadline_type": "1", //完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
        "deadline_value": "1", //完成期限值
        "is_workday": "0",
        "assignee_type": "1", //审批人类型 1=任何人 2=启动流程时指定 3=固定人选
        "assignees": "", //审批人(id) 多个逗号隔开
        "transfer_mode": "2", //流转方式 1=自由选择 2= 下一步
        "enable_revocation": "1", //是否可撤回 1=可撤回 0=不可撤回
        "enable_opinion": "1", //是否填写意见  1=填写 0=不填写
        "form_data": [
          // 文本
          {
            "field_type": "1", //字段类型 1=输入框
            "property_name": "文本", //属性名称(标题)输入框
            "default_value": "", //默认值 默认值
            "verification_rule": "", //校验规则 '' =不校验格式 mobile = 手机号码，tel = 座机，ID_card = 身份证号码，chinese_name = 中文名，url = 网址,qq = QQ号，postal_code = 邮政编码，positive_integer = 正整数，negative = 负数，two_decimal_places = 精确到两位小数
            "val_length": "20", //长度
            "is_required": "0"//是否必须 1=必须 0=不是必须
          },
          // 选择
          {
            "field_type": "2", //字段类型 3=下拉框
            "property_name": "选择", //属性名称(标题) 下拉框
            "default_value": "", //默认值(预设值)默认值
            "verification_rule": "redio", //校验规则 redio = 单选， multiple = 多选 ，province = 省市区
            "is_required": "0", //是否必须 1=必须 0=不是必须
            "options_data": []
          },
          // 日期
          {
            "field_type": "3", //字段类型 2=日期选择
            "property_name": "日期", //属性名称(标题)日期选择
            "default_value": "", //默认值 默认值
            "verification_rule": "SINGLE_DATE_TIME", //校验规则 单个+日期+时分 = SINGLE_DATE_TIME ,单个+日期 = SINGLE_DATE,多个+日期+时分 = MULTI_DATE_TIME ,多个+日期 = MULTI_DATE
            "is_required": "0"//是否必须 1=必须 0=不是必须
          },
          // 附件 
          {
            "field_type": "5",
            "property_name": "附件", //属性名称(标题)
            "limit_file_num": "10", //限制文件上传数量 0=不限制
            "limit_file_type": "1,2,3,4", //限制上传类型(文件格式)1=文档 2=图像 3=音频 4=视频
            "limit_file_size": "20",//限制文件大小
            "is_required": "0"//是否必须 1=必须 0=不是必须
          }
        ]
      },
      {
        "name": "审批",
        "node_type": "2", //节点类型：5代表审批节点
        "description": "",
        "approve_type": "1", //审批模式 1=串签 2=并签 3=汇签
        "approve_value": "", //汇签值 当approve_type=3 时该字段有效
        "deadline_type": "1", //完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
        "deadline_value": "1", //完成期限值
        "is_workday": "0",
        "assignee_type": "2", //审批人类型 1=任何人 2=启动流程时指定 3=固定人选
        "assignees": "", //审批人(id) 多个逗号隔开
        "transfer_mode": "2", //流转方式 1=自由选择 2= 下一步
        "enable_revocation": "1", //是否可撤回 1=可撤回 0=不可撤回
        "enable_opinion": "1"//是否填写意见  1=填写 0=不填写
      },
      {
        "name": "抄送",
        "node_type": "3", //节点类型：4代表抄送节点
        "description": "",
        "deadline_type": "1", //完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
        "deadline_value": "1", //完成期限值
        "is_workday": "0",
        "assignee_type": "1", //抄送人类型 2=启动流程时指定 3=固定人选
        "assignees": "", //抄送人 多个逗号隔开（传的是邮箱）
        "cc_type": "1", //抄送人类型 1=启动流程时指定 2=固定人选
        "recipients": "", //抄送人 多个逗号隔开（传的是邮箱）
        "transfer_mode": "2", //流转方式 1=自由选择 2= 下一步
        "enable_revocation": "1", //是否可撤回 1=可撤回 0=不可撤回
        "enable_opinion": "1"//是否填写意见  1=填写 0=不填写
      },
    ],
  }
]

export const processEditDatasItemOneConstant = {
  "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "deadline_type": "", // 期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "assignee_type": "1",//审批人类型 1=任何人 2=指定人员
  "assignees": "",//审批人 多个逗号隔开
  "forms": [],
  "is_confirm": '0', // 是否确认
  "form_data": [
  ]
}

export const processEditDatasItemTwoConstant = {
  "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "approve_type": "1",//审批类型 1=串签 2=并签 3=汇签
  "approve_value": "",// 当为 汇签时需填的值
  "deadline_type": "", // 期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "assignees": "",//审批人 多个逗号隔开
  "is_confirm": "0"
}

export const processEditDatasItemThreeConstant = {
  "node_type": "3",//流程节点类型 1=资料收集 2=审批 3=抄送
  "name": "",//流程节点名称
  "description": "",//描述 备注
  "deadline_type": "", // 期限类型 1=不限制时间 2=限制时间
  "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
  "deadline_value": "",//完成期限值
  "cc_type": "1",//抄送人类型 1=自动抄送 2=手动抄送
  "recipients": "",//抄送人 多个逗号隔开
  "assignees": "",//抄报人 多个逗号隔开
  "is_confirm": "0"
}

export const processEditDatasRecordsItemOneConstant = {
  'node_type': '1',
  'alltypedata': [
    {
      "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
      "name": "",//流程节点名称
      "description": "",//描述 备注
      "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
      "deadline_value": "",//完成期限值
      "assignee_type": "",//审批人类型 1=任何人 2=指定人员
      "assignees": "",//审批人 多个逗号隔开
      "forms": [],
      "is_confirm": '0', // 是否确认
      // "form_data": [
      //   // 文本
      //   {
      //     "field_type": "1", //字段类型 1=输入框
      //     "property_name": "文本", //属性名称(标题)输入框
      //     "default_value": "", //默认值 默认值
      //     "verification_rule": "", //校验规则 '' =不校验格式 mobile = 手机号码，tel = 座机，ID_card = 身份证号码，chinese_name = 中文名，url = 网址,qq = QQ号，postal_code = 邮政编码，positive_integer = 正整数，negative = 负数，two_decimal_places = 精确到两位小数
      //     "val_length": "20", //长度
      //     "is_required": "0"//是否必须 1=必须 0=不是必须
      //   },
      //   // 选择
      //   {
      //     "field_type": "2", //字段类型 3=下拉框
      //     "property_name": "选择", //属性名称(标题) 下拉框
      //     "default_value": "", //默认值(预设值)默认值
      //     "verification_rule": "redio", //校验规则 redio = 单选， multiple = 多选 ，province = 省市区
      //     "is_required": "0", //是否必须 1=必须 0=不是必须
      //     "options_data": []
      //   },
      //   // 日期
      //   {
      //     "field_type": "3", //字段类型 2=日期选择
      //     "property_name": "日期", //属性名称(标题)日期选择
      //     "default_value": "", //默认值 默认值
      //     "verification_rule": "SINGLE_DATE_TIME", //校验规则 单个+日期+时分 = SINGLE_DATE_TIME ,单个+日期 = SINGLE_DATE,多个+日期+时分 = MULTI_DATE_TIME ,多个+日期 = MULTI_DATE
      //     "is_required": "0"//是否必须 1=必须 0=不是必须
      //   },
      //   // 附件 
      //   {
      //     "field_type": "5",
      //     "property_name": "附件", //属性名称(标题)
      //     "limit_file_num": "10", //限制文件上传数量 0=不限制
      //     "limit_file_type": "1,2,3,4", //限制上传类型(文件格式)1=文档 2=图像 3=音频 4=视频
      //     "limit_file_size": "20",//限制文件大小
      //     "is_required": "0"//是否必须 1=必须 0=不是必须
      //   }
      // ]
    },
    {
      "node_type": "2",//流程节点类型 1=资料收集 2=审批 3=抄送
      "name": "",//流程节点名称
      "description": "",//描述 备注
      "approve_type": "",//审批类型 1=串签 2=并签 3=汇签
      "approve_value": "",// 当为 汇签时需填的值
      "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
      "deadline_value": "",//完成期限值
      "assignees": "",//审批人 多个逗号隔开
      "is_confirm": "0"
    },
    {
      "node_type": "3",//流程节点类型 1=资料收集 2=审批 3=抄送
      "name": "",//流程节点名称
      "description": "",//描述 备注
      "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
      "deadline_value": "",//完成期限值
      "cc_type": "",//抄送人类型 1=自动抄送 2=手动抄送
      "recipients": "",//抄送人 多个逗号隔开
      "assignees": "",//抄报人 多个逗号隔开
      "is_confirm": "0"
    },
  ],
}

// 假数据
export const processDoingListMatch = [
  {
    "is_privilege": "0",
    "privileges": [

    ],
    "id": "1235511262679535616",
    "flow_template_id": "1235511229297070080",
    "board_id": "1235125250149191680",
    "name": "Señorita",
    "description": "<p></p>",
    "status": "1",
    "proc_ins_id": "610115",
    "proc_def_id": "process1235511229297070080:1:610114",
    "create_by": "1135840292222668800",
    "curr_node_id": "1235511262692118528",
    "create_time": "1583403814",
    "update_time": "1583403815",
    "total_node_num": "0",
    "completed_node_num": "0"
  }
]

export const processInfoMatch = {
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
      "assignees": "1110064610620346368,1110381102486392832"//审批人 多个逗号隔开
    },
    {
      "node_type": "3",//流程节点类型 1=资料收集 2=审批 3=抄送
      "name": "抄送节点",//流程节点名称
      "description": "需要抄送了",//描述 备注
      "deadline_type": "1",//期限类型 1=不限制时间 2=限制时间
      "deadline_time_type": "",//完成期限类型 hour = 时 day =天 month = 月
      "deadline_value": "",//完成期限值
      "cc_type": "2",//抄送人类型 1=自动抄送 2=手动抄送
      "recipients": "1110064610620346368,1110381102486392832",//抄送人 多个逗号隔开
      "assignees": "1110064610620346368"//抄报人 多个逗号隔开
    }
  ]
}

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
  },
  {
    "user_id": "1184398454126940160",
    "name": "13388889999",
    "avatar": ""
  },
  {
    "user_id": "1128925957864951808",
    "name": "ccc",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2020-02-10/a46f3f4152b443ae8be52965d7cde6d6.png"
  },
  {
    "user_id": "1110067154134372352",
    "name": "13333333333",
    "avatar": ""
  },
  {
    "user_id": "1205361599397892096",
    "name": "13344444444",
    "avatar": ""
  },
  {
    "user_id": "1205361598592585728",
    "name": "13311111111",
    "avatar": ""
  },
  {
    "user_id": "1150603267496087552",
    "name": "汤姆",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-10-25/effec42aebf94d10a23b7608e4daed0b.jpg"
  },
  {
    "user_id": "1192753179570343936",
    "name": "15289749459",
    "avatar": "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-12-06/037ff1e467e64f658c4f2fbeaa40d5a4.jpg"
  },
  {
    "user_id": "1205361597866971136",
    "name": "13322222222",
    "avatar": ""
  },
  {
    "user_id": "1193865152404000768",
    "name": "13222222333",
    "avatar": ""
  },
  {
    "user_id": "1205361597246214144",
    "name": "13355555555",
    "avatar": ""
  },
  {
    "user_id": "1205361428626804736",
    "name": "13322221111",
    "avatar": ""
  },
  {
    "user_id": "1205361596608679936",
    "name": "13366666666",
    "avatar": ""
  }

]
