import DragLine from './components/DragLine'
import LabelSelect from './components/LabelSelect'
import MemberUpdate from './components/MemberUpdate'
import MoreOperation from './components/MoreOperation'
import UpdateCardBarName from './components/UpdateCardBarName'

/** 默认的任务条设置项数量
 * @constant
 * @member EditName 修改任务名称的常量key
 * @member BarColor 任务条颜色的常量key
 * @member MemberChange 修改成员的常量key
 * @member MoreOperation 更多设置的常量key
 * @member tools 任务条工具列表
 */
export const CardBarOperations = {
  /** 依赖连线的常量 */
  RelyKey: 'rely',
  /** 修改任务名称的常量key */
  EditName: 'editname',
  /** 任务条颜色的常量key */
  BarColor: 'barcolor',
  /** 修改成员的常量key */
  MemberChange: 'memberchange',
  /** 更多设置的常量key */
  MoreOperation: 'moreoperation',
  /** 任务条工具列表 */
  tools: []
}

/** 任务条工具列表 */
CardBarOperations.tools = [
  {
    key: CardBarOperations.RelyKey,
    name: '依赖',
    icon: '&#xe856;',
    component: DragLine
  },
  {
    key: CardBarOperations.EditName,
    name: '修改名称',
    icon: '&#xe852;',
    /** 修改名称组件 */
    component: UpdateCardBarName
  },
  {
    key: CardBarOperations.BarColor,
    name: '标签',
    icon: '&#xe853;',
    /** 修改标签组件 */
    component: LabelSelect
  },
  {
    key: CardBarOperations.MemberChange,
    name: '负责人',
    icon: '&#xe854;',
    /** 修改负责人组件 */
    component: MemberUpdate
  },
  {
    key: CardBarOperations.MoreOperation,
    name: '更多',
    icon: '&#xe855;',
    /** 更多操作组件 */
    component: MoreOperation
  }
]

/** 定义的颜色 */
export const BarColors = [
  '255,163,158',
  '255,213,145',
  '145,213,255',
  '211,173,247',
  '183,235,143',
  '255,65,65',
  '255,134,55',
  '62,130,255',
  '144,95,255',
  '100,161,108'
]
