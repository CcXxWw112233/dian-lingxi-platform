export const NODE_ENV = process.env.NODE_ENV
export const REQUEST_PREFIX = '/dian_lingxi'
// export const REQUEST_PREFIX = '/api'
export const BOOLEAN_TRUE_CODE = '1' //代表后端返回 '1'
export const BOOLEAN_FALSE_CODE = '0' //代表后端返回 ‘0’

export const REQUEST_DOMAIN = `${REQUEST_PREFIX}/upms` //用户信息接口域名
/**
 * 项目接口域名
 * @default string '/dian_lingxi/projects'
 */
export const REQUEST_DOMAIN_BOARD = `${REQUEST_PREFIX}/projects` //项目接口域名
export const REQUEST_DOMAIN_FILE = REQUEST_DOMAIN_BOARD //文件接口域名
export const REQUEST_DOMAIN_FLOWS = REQUEST_DOMAIN_BOARD //流程接口域名
export const REQUEST_DOMAIN_CARD = REQUEST_DOMAIN_BOARD //任务接口域名前缀
export const REQUEST_INTERGFACE_VERSIONN = '/v2' //接口版本
export const REQUEST_PDF = `${REQUEST_PREFIX}/pdf` // pdf圈评接口域名
export const REQUEST_WHITEBOARD = `${REQUEST_PREFIX}/pdf`
export const REQUEST_DOMAIN_WORK_BENCH = `${REQUEST_PREFIX}/workbenchs`
export const REQUEST_DOMAIN_TEAM_SHOW = `${REQUEST_PREFIX}/more`

export const REQUEST_DOMAIN_ARTICLE = 'https://knowapi.new-di.com' //微信小程序后台文章列表

export const WE_APP_TYPE_KNOW_CITY = '1' //知城社
export const WE_APP_TYPE_KNOW_POLICY = '2' //晓策志
export const WE_APP_ID = appType => {
  //返回小程序后台appid
  return appType === '1' ? '1029567653519429632' : '1029565930193162240'
}

// 晓策志接口
export const REQUEST_KNOW_POLICY = `${REQUEST_DOMAIN_ARTICLE}/api`

export const WEBSOCKET_URL = (function(NODE_ENV, location) {
  if (NODE_ENV == 'development') {
    // return 'wss://lingxi.di-an.com/websocket'
    return 'ws://test.lingxi.new-di.com/websocket'
    // return 'ws://prerelease.lingxi.new-di.com/websocket'
    // return 'ws://192.168.1.68/websocket'
    return 'ws://dev.lingxi.new-di.com/websocket' //开发环境
  } else {
    const protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    return `${protocol}//${location.host}/websocket`
  }
})(NODE_ENV, window.location)

// export const MAP_URL = 'https://map.di-an.com' //投资地图-正式环境
export const MAP_URL =
  window.location.host.indexOf('lingxi.di-an') != -1
    ? 'https://map.di-an.com/#/home'
    : 'http://test.map.new-di.com/#/home' //投资地图-测试环境

export const WEBSOCKET_PATH = '192.168.1.16' //'47.93.53.149'//'192.168.0.14'  //WS链接地址dsfsd
export const WEBSOCKET_PORT = '9326' //WS链接地址
// export const IM_HTTP_PATH = window.location.host.indexOf('lingxi') != -1 ? 'https://lingxi.di-an.com/im':'http://www.new-di.com/im'
export const IM_HTTP_PATH = '/im/index.html' //`${window.location.protocol}//${window.location.host}/im`

export const INPUT_CHANGE_SEARCH_TIME = 300 //input输入查询的时间
export const MESSAGE_DURATION_TIME = 3 //message弹框时间
export const UPLOAD_FILE_SIZE = 99 //上传文件MB限制

export const INT_REQUEST_OK = 0 //接口返回常量定义

export const UPLOAD_PROCESS_FILE_SIZE = 99 //流程上传文件MB限制

export const PREVIEW_FILE_FILE_SIZE = 20 // 预览文件MB限制

export const NOT_HAS_PERMISION_COMFIRN = '您没有该访问权限'

export const PAGINATION_PAGE_SIZE = 12 //分页每页条数

export const APP_KEY = {
  FLOW: '2',
  CARD: '3',
  FILE: '4'
}

//权限列表
export const ORG_TEAM_BOARD_CREATE = 'org:team:board:create' //创建项目 permission_type=1
export const ORG_TEAM_BOARD_JOIN = 'org:team:board:join' //加入项目 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_ADD =
  'org:upms:organization:member:add' //添加成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_EDIT =
  'org:upms:organization:member:edit' //编辑成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_REMOVE =
  'org:upms:organization:member:remove' //移除成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_GROUP = 'org:upms:organization:group' //管理分组 permission_type=1
export const ORG_UPMS_ORGANIZATION_EDIT = 'org:upms:organization:edit' //编辑基本信息 permission_type=1
export const ORG_UPMS_ORGANIZATION_DELETE = 'org:upms:organization:delete' //删除组织 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_CREATE =
  'org:upms:organization:role:create' //创建角色 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_EDIT = 'org:upms:organization:role:edit' //编辑角色 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_DELETE =
  'org:upms:organization:role:delete' //删除角色 permission_type=1
export const ORG_TEAM_BOARD_QUERY = 'org:team:board:query' //查看项目 permission_type=1
export const ORG_TEAM_BOARD_EDIT = 'org:team:board:edit' //编辑项目 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_QUERY =
  'org:upms:organization:member:query' //查看成员 permission_type=1
export const ORG_TEAM_FLOW_TEMPLETE = 'org:team:flow:template' //组织管理流程模板 permission_type=1
export const PROJECT_TEAM_BOARD_MEMBER = 'project:team:board:member' //成员管理 permission_type=2
export const PROJECT_TEAM_BOARD_EDIT = 'project:team:board:edit' //编辑项目 permission_type=2
export const PROJECT_TEAM_BOARD_ARCHIVE = 'project:team:board:archive' //归档项目 permission_type=2
export const PROJECT_TEAM_BOARD_DELETE = 'project:team:board:delete' //删除项目 permission_type=2
export const PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE =
  'project:team:board:content:privilege' // 访问控制 permission_type=2
export const PROJECT_FLOWS_FLOW_TEMPLATE = 'project:flows:flow:template' //管理流程模板 permission_type=2
export const PROJECT_FLOWS_FLOW_CREATE = 'project:flows:flow:create' //新增流程 permission_type=2
export const PROJECT_FLOWS_FLOW_DELETE = 'project:flows:flow:delete' //删除流程 permission_type=2
export const PROJECT_FLOWS_FLOW_ABORT = 'project:flows:flow:abort' //中止流程 permission_type=2
export const PROJECT_FLOW_FLOW_ACCESS = 'project:flows:flow:access' //访问流程 permission_type=2
export const PROJECT_FLOWS_FLOW_COMMENT = 'project:flows:flow:comment' //发表评论 //
export const PROJECT_TEAM_CARD_INTERVIEW = 'project:team:card:interview' //访问任务 permission_type=2
export const PROJECT_TEAM_CARD_CREATE = 'project:team:card:create' //创建任务 permission_type=2
export const PROJECT_TEAM_CARD_EDIT = 'project:team:card:edit' //编辑任务 permission_type=2
export const PROJECT_TEAM_CARD_COMPLETE = 'project:team:card:complete' //完成/重做任务 permission_type=2
export const PROJECT_TEAM_CARD_DELETE = 'project:team:card:delete' //删除任务 permission_type=2
export const PROJECT_TEAM_CARD_GROUP = 'project:team:content:group' //管理任务分组 permission_type=2
export const PROJECT_TEAM_CARD_EDIT_FINISH_TIME =
  'project:team:card:edit:finishTime' //修改任务完成时间
export const PROJECT_TEAM_CARD_COMMENT_PUBLISH =
  'project:team:card:comment:publish' //发表评论 permission_type=2
export const PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD =
  'project:team:card:attachment:upload' // 上传附件 premission_type = 2
export const PROJECT_FILES_FILE_INTERVIEW = 'project:files:file:interview' //访问文件 permission_type=2
export const PROJECT_FILES_FILE_UPLOAD = 'project:files:file:upload' //上传文件 permission_type=2
export const PROJECT_FILES_FILE_DOWNLOAD = 'project:files:file:download' //下载文件 permission_type=2
export const PROJECT_FILES_FILE_UPDATE = 'project:files:file:update' //更新文件 permission_type=2
export const PROJECT_FILES_FILE_DELETE = 'project:files:file:delete' //删除文件 permission_type=2
/**
 * 文件编辑权限 permission_type = 2
 */
export const PROJECT_FILES_FILE_EDIT = 'project:files:file:edit' //编辑文件 permission_type=2
export const PROJECT_FILES_FOLDER = 'project:files:folder' //管理文件夹 permission_type=2
export const PROJECT_FILES_COMMENT_PUBLISH = 'project:files:comment:publish' //发表评论 permission_type=2
export const PROJECT_FILES_COMMENT_VIEW = 'project:files:comment:view' //查看评论 permission_type=2
export const PROJECT_TEAM_BOARD_MILESTONE = 'project:team:board:milestone' // 查看项目里程碑

//名词定义
export const NORMAL_NOUN_PLAN = {
  Organization: '组织',
  Tasks: '任务',
  Flows: '流程',
  Dashboard: '工作台',
  Projects: '项目',
  Files: '文件',
  'board:plans': '项目计划',
  'board:chat': '项目交流',
  'board:files': '项目档案',
  Members: '成员',
  Catch_Up: '动态',
  Map_Admin: '地图管理'
}

/** 付费升级打开的表格申请网页 */
export const PAYUPGRADEURL =
  'https://docs.qq.com/form/edit/DSHRaQ01GSU1qZHlT#/edit'

export const ORGANIZATION = 'Organization'
export const TASKS = 'Tasks'
export const FLOWS = 'Flows'
export const DASHBOARD = 'Dashboard'
export const PROJECTS = 'Projects'
export const FILES = 'Files'
export const BOARD_PLANS = 'board:plans'
export const BOARD_CHAT = 'board:chat'
export const BOARD_FILES = 'board:files'
export const MEMBERS = 'Members'
export const CATCH_UP = 'Catch_Up'
export const MAP_ADMIN = 'Map_Admin'

//内容类型 board , list, card, file, folder,flow
export const CONTENT_DATA_TYPE_BOARD = 'board'
export const CONTENT_DATA_TYPE_MILESTONE = 'milestone'
export const CONTENT_DATA_TYPE_LIST = 'list'
export const CONTENT_DATA_TYPE_CARD = 'card'
export const CONTENT_DATA_TYPE_FILE = 'file'
export const CONTENT_DATA_TYPE_FOLDER = 'folder'
export const CONTENT_DATA_TYPE_FLOW = 'flow'

// 针对性定制化开发的组织
export const CUSTOMIZATION_ORGNIZATIONS = [
  '1207841935180566528',
  '1192754064144863232',
  '1108192151461826560',
  '1193858769025634304',
  '1200009822913826816',
  '1106838340805726208',
  '1212911749708255232',
  '1216604161253183488',
  '1217998714627559424',
  '1164926825101660160',
  '1177520105660223488',
  '1177054842179424256',
  '1108909996021780480',
  '1173834807776514048',
  '1173837025166626816',
  '1238307901991424000',
  '1238303604515934208',
  '1238308765850275840',
  '1238305595837255680',
  '1238304382282502144',
  '1238304382282502144'
]

export const FILE_UPLOAD_ACCEPT_TYPE =
  '.3dm, .iges, .obj, .ma, .mb, .skp, .dwg, .psd, .pdf, .doc, .xls, .ppt, .docx, .xlsx, .pptx, .key, .jpg,.jpeg, .png, .gif, .mp4, .mp3, .txt, .rar, .zip, .7z, .gz, .bmp'

/** 本地缓存保存的key数据 */
export const LocalStorageKeys = {
  /** 即将过期的弹窗关闭时间 */
  willExpireCloseTime: 'willExpireCloseTime'
}

/** 组织中，用户的类型 */
export const OrgUserType = {
  /** 访客
   * @default string '0'
   */
  visitor: '0',
  /** 普通成员
   * @default string '1'
   */
  normal: '1',
  /** 管理员
   * @default string '3'
   */
  manager: '3'
}

/** 付费状态 */
export const OrgPaymentMark = {
  /** 试用
   * @default string 'trial'
   */
  trial: 'trial',
  /** 付费
   * @default string 'pay'
   */
  pay: 'pay'
}

/** 甘特图的视图类型 */
export const GanttViewMode = {
  /** 日视图
   * @default string 'month'
   */
  Day: 'month',
  /** 周视图
   * @default string 'week'
   */
  Week: 'week',
  /** 年视图
   * @default string 'year'
   */
  Month: 'year',
  /** 时视图
   * @default string 'hours'
   */
  Hours: 'hours',
  /** 相对时间
   * @default string 'relative_time'
   */
  Relative: 'relative_time'
}

/** 甘特图视图类型的日期宽度 */
export const GanttViewDateWidth = {
  /** 周视图
   * @default number 84
   */
  Week: 84,
  /** 时视图
   * @default number 22
   */
  Hours: 22,
  /** 日视图
   * @default number 34
   */
  Day: 34,
  /** 月视图
   * @default number 90
   */
  Month: 90
}

/** 甘特图滚动元素的id */
export const ganttScrollElementId = 'gantt_card_out_middle'

/** 最高的层级数值 */
export const MaxZIndex = 1100
/** 功能的code type 类型 */
export const FEATURE_INSTANCE_CODE_TYPE = {
  MILESTONE: '1', //里程碑
  CARD: '2', //任务
  FLOW: '3' //流程
}
