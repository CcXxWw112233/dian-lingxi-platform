import { Dropdown } from 'antd'
import React from 'react'
import MenuSearchPartner from '../../../../../../../components/MenuSearchMultiple/MenuSearchPartner.js'
import { connect } from 'dva'
import { GANTTMODEL } from '../../../../../../../models/technological/workbench/gantt/gantt.js'
import {
  addTaskExecutor,
  removeTaskExecutor
} from '../../../../../../../services/technological/task.js'
import { ganttIsOutlineView } from '../../../constants.js'

@connect(({ projectDetail: { datas: { projectDetailInfoData } } }) => ({
  projectDetailInfoData
}))
export default class MemberUpdate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    // console.log(props)
  }

  chirldrenTaskChargeChange = val => {
    /** 是否大纲视图 */
    const isOutlineView = ganttIsOutlineView({
      group_view_type: this.props.group_view_type
    })
    const { type, key } = val
    const {
      projectDetailInfoData: { data: users = [], board_set = {} },
      data = {},
      updateCardBarDatas = () => {},
      dispatch
    } = this.props
    if (type === 'add') {
      const user = users.find(item => item.user_id === key)
      if (user) {
        addTaskExecutor({ card_id: data.id, executor: key }).then(res => {
          const list = data.executors.concat([user])
          updateCardBarDatas && updateCardBarDatas({ executors: list })
          dispatch({
            type:
              GANTTMODEL.namespace +
              '/' +
              (isOutlineView
                ? GANTTMODEL.updateOutLineTree
                : GANTTMODEL.updateListGroup),
            payload: {
              datas: [
                {
                  ...data,
                  executors: list
                }
              ]
            }
          })
          /** 更新详情页的内容 */
          this.props.onChangeTimeHandleCardDetail &&
            this.props.onChangeTimeHandleCardDetail()
        })
      }
    }
    if (type === 'remove') {
      removeTaskExecutor({ executor: key, card_id: data.id }).then(res => {
        const list = data.executors.filter(
          item => (item.id || item.user_id) !== key
        )
        updateCardBarDatas && updateCardBarDatas({ executors: list })
        dispatch({
          type:
            GANTTMODEL.namespace +
            '/' +
            (isOutlineView
              ? GANTTMODEL.updateOutLineTree
              : GANTTMODEL.updateListGroup),
          payload: {
            datas: [
              {
                ...data,
                executors: list
              }
            ]
          }
        })
        /** 更新详情页的内容 */
        this.props.onChangeTimeHandleCardDetail &&
          this.props.onChangeTimeHandleCardDetail()
      })
    }
  }

  /** 检测禁用是方法还是bool */
  checkDisabled = () => {
    const { disabled } = this.props
    if (disabled instanceof Function) {
      return disabled.call(this, this.props.valueKey)
    }
    return disabled
  }

  inviteOthersToBoardCalback = () => {}

  render() {
    const { children, data = {} } = this.props || {}
    const { executors = [] } = data || {}
    const org_id = sessionStorage.getItem('aboutBoardOrganizationId')
    const { projectDetailInfoData = {} } = this.props
    const { data: users = [], board_set = {} } = projectDetailInfoData
    return (
      <Dropdown
        disabled={this.checkDisabled()}
        trigger={['click']}
        overlay={
          <MenuSearchPartner
            inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
            invitationType={'13'}
            invitationId={this.props.data.id}
            invitationOrg={org_id}
            HideInvitationOther={true}
            listData={users.map(item => ({
              ...item,
              user_id: item.id || item.user_id
            }))}
            keyCode={'user_id'}
            searchName={'name'}
            currentSelect={executors}
            chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
            board_id={this.props.board_id}
          />
        }
      >
        {children}
      </Dropdown>
    )
  }
}
