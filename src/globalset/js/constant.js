const PROJECTS_API = '/api/projects'
export const REQUEST_DOMAIN = '/api/upms' //接口域名
export const REQUEST_DOMAIN_BOARD = PROJECTS_API //接口域名
export const REQUEST_DOMAIN_FILE = PROJECTS_API //接口域名
export const REQUEST_DOMAIN_FLOWS = PROJECTS_API //接口域名
export const REQUEST_DOMAIN_ABOUT_PROJECT = PROJECTS_API //项目相关接口域名前缀

export const REQUEST_DOMAIN_WORK_BENCH = '/api/workbenchs'
export const REQUEST_DOMAIN_TEAM_SHOW = '/api/more'

export const REQUEST_DOMAIN_ARTICLE = 'https://knowapi.new-di.com' //微信小程序后台文章列表
export const WE_APP_TYPE_KNOW_CITY = '1' //知城社
export const WE_APP_TYPE_KNOW_POLICY = '2' //晓策志
export const WE_APP_ID = (appType) => { //返回小程序后台appid
  return appType === '1'? '1029567653519429632' : '1029565930193162240'
}

//export const WEBSOCKET_URL = 'wss://lingxi.di-an.com/websocket' //'47.93.53.149'//'192.168.0.14'  //WS链接地址dsfsd
// export const WEBSOCKET_URL = 'ws://www.new-di.com/websocket'
export const NODE_ENV = process.env.NODE_ENV
// export const WEBSOCKET_URL = NODE_ENV == 'development'?'ws://192.168.1.16:9326': window.location.host.indexOf('lingxi') != -1 ? 'wss://lingxi.di-an.com/websocket' : 'ws://www.new-di.com/websocket'//'47.93.53.149'//'192.168.0.14'  //WS链接地址dsfsd
export const WEBSOCKET_URL = (function (NODE_ENV, location) {
  if(NODE_ENV == 'development') {
    return 'ws://192.168.1.16:9326'
  } else {
    const protocol = location.protocol == 'http:'? 'ws:' : 'wss:'
    return `${protocol}//${location.host}/websocket`
  }
})(NODE_ENV, window.location)
export const WEBSOCKET_PATH = '192.168.1.16' //'47.93.53.149'//'192.168.0.14'  //WS链接地址dsfsd
export const WEBSOCKET_PORT= '9326' //WS链接地址
// export const IM_HTTP_PATH = window.location.host.indexOf('lingxi') != -1 ? 'https://lingxi.di-an.com/im':'http://www.new-di.com/im'
export const IM_HTTP_PATH = `${window.location.protocol}//${window.location.host}/im`

export const INPUT_CHANGE_SEARCH_TIME = 300 //input输入查询的时间
export const MESSAGE_DURATION_TIME = 3 //message弹框时间
export const UPLOAD_FILE_SIZE = 30 //上传文件MB限制

export const INT_REQUEST_OK = 0 //接口返回常量定义

export const UPLOAD_PROCESS_FILE_SIZE = 100 //流程上传文件MB限制

export const NOT_HAS_PERMISION_COMFIRN = '您没有该访问权限'

export const PAGINATION_PAGE_SIZE = 12 //分页每页条数

export const APP_KEY = {
  FLOW: '2',
  CARD: '3',
  FILE: '4',
}

//权限列表
export const ORG_TEAM_BOARD_CREATE = 'org:team:board:create' //创建项目 permission_type=1
export const ORG_TEAM_BOARD_JOIN = 'org:team:board:join' //加入项目 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_ADD = 'org:upms:organization:member:add' //添加成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_EDIT = 'org:upms:organization:member:edit' //编辑成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_REMOVE = 'org:upms:organization:member:remove' //移除成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_GROUP = 'org:upms:organization:group' //管理分组 permission_type=1
export const ORG_UPMS_ORGANIZATION_EDIT = 'org:upms:organization:edit' //编辑基本信息 permission_type=1
export const ORG_UPMS_ORGANIZATION_DELETE = 'org:upms:organization:delete' //删除组织 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_CREATE = 'org:upms:organization:role:create' //创建角色 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_EDIT = 'org:upms:organization:role:edit' //编辑角色 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_DELETE = 'org:upms:organization:role:delete' //删除角色 permission_type=1
export const ORG_TEAM_BOARD_QUERY = 'org:team:board:query' //查看项目 permission_type=1
export const ORG_TEAM_BOARD_EDIT = 'org:team:board:edit' //编辑项目 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_QUERY = 'org:upms:organization:member:query' //查看成员 permission_type=1
export const PROJECT_TEAM_BOARD_MEMBER = 'project:team:board:member' //成员管理 permission_type=2
export const PROJECT_TEAM_BOARD_EDIT = 'project:team:board:edit' //编辑项目 permission_type=2
export const PROJECT_TEAM_BOARD_ARCHIVE = 'project:team:board:archive' //归档项目 permission_type=2
export const PROJECT_TEAM_BOARD_DELETE = 'project:team:board:delete' //删除项目 permission_type=2
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
export const PROJECT_TEAM_CARD_GROUP = 'project:team:card:group' //管理任务分组 permission_type=2
export const PROJECT_TEAM_CARD_COMMENT_PUBLISH = 'project:team:card:comment:publish' //发表评论 permission_type=2
export const PROJECT_FILES_FILE_INTERVIEW = 'project:files:file:interview' //访问文件 permission_type=2
export const PROJECT_FILES_FILE_UPLOAD = 'project:files:file:upload' //上传文件 permission_type=2
export const PROJECT_FILES_FILE_DOWNLOAD = 'project:files:file:download' //下载文件 permission_type=2
export const PROJECT_FILES_FILE_UPDATE = 'project:files:file:update' //更新文件 permission_type=2
export const PROJECT_FILES_FILE_DELETE = 'project:files:file:delete' //删除文件 permission_type=2
export const PROJECT_FILES_FILE_EDIT = 'project:files:file:edit' //编辑文件 permission_type=2
export const PROJECT_FILES_FOLDER = 'project:files:folder' //管理文件夹 permission_type=2
export const PROJECT_FILES_COMMENT_PUBLISH = 'project:files:comment:publish' //发表评论 permission_type=2
export const PROJECT_FILES_COMMENT_VIEW = 'project:files:comment:view' //查看评论 permission_type=2

//名词定义
export const NORMAL_NOUN_PLAN = {"Organization": "组织", "Tasks": "卡片", "Flows": "流程", "Dashboard": "与我相关", "Projects": "看板", "Files": "文件", "Members": "成员", "Catch_Up": "动态"}
export const ORGANIZATION = 'Organization'
export const TASKS = 'Tasks'
export const FLOWS = 'Flows'
export const DASHBOARD = 'Dashboard'
export const PROJECTS = 'Projects'
export const FILES = 'Files'
export const MEMBERS = 'Members'
export const CATCH_UP = 'Catch_Up'
