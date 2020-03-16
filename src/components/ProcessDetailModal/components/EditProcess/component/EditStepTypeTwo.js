import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { principalList } from '../../../constant'
import { Button } from 'antd'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class EditStepTypeTwo extends Component {

  state = {
    transPrincipalList: JSON.parse(JSON.stringify(principalList)),
    is_show_spread_arrow: false,
  }

  
  // 更新对应步骤下的节点内容数据, 即当前操作对象的数据
  updateCorrespondingPrcodessStepWithNodeContent = (data, value) => {
    const { itemValue, processEditDatas = [], itemKey, dispatch } = this.props
    let newProcessEditDatas = [...processEditDatas]
    newProcessEditDatas[itemKey][data] = value
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newProcessEditDatas,
      }
    })
  }

  handleSpreadArrow = (e) => {
    e && e.stopPropagation()
    this.setState({
      is_show_spread_arrow: !this.state.is_show_spread_arrow
    })
  }

   // 编辑点击事件
   handleEnterConfigureProcess = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('is_confirm', '0')
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  renderEditDetailContent = () => {
    const { itemValue } = this.props
    const { approve_type } = itemValue
    let type_name = ''
    const diffType = () => {
      switch (approve_type) {
        case '1':
          type_name = '串签'
          break;
        case '2':
          type_name = '并签'
          break;
        case '1':
          type_name = '汇签'
          break;
        default:
          break;
      }
      return type_name
    }
    return (
      <div>
        {/* 审批类型 */}
        <div style={{ minHeight: '64px', padding: '20px 14px', color: 'rgba(0,0,0,0.45)', borderTop: '1px solid #e8e8e8', marginTop: '15px' }}>
          <span className={globalStyles.authTheme}>&#xe616; 审批类型 : &nbsp;&nbsp;&nbsp;{diffType()}</span>
        </div>
        {/* 编辑按钮 */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center'}}>
          <Button onClick={this.handleEnterConfigureProcess} type="primary">编辑</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey} = this.props
    const { transPrincipalList = [], is_show_spread_arrow } = this.state
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '45px' }}>
        <div className={indexStyles.line}></div>
        <div className={indexStyles.circle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe616;</span>
                  <span>建设部门审批</span>
                </div>
                <div>
                  <span onClick={this.handleSpreadArrow} className={`${indexStyles.spreadIcon}`}>
                    {
                      !is_show_spread_arrow ? <span className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}>&#xe7ee;</span> : <span className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}>&#xe7ed;</span>
                    }
                  </span>
                </div>
              </div>
            </div>
            {/* 下 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className={indexStyles.content__principalList_icon}>
                <AvatarList
                  size="small"
                  maxLength={10}
                  excessItemsStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                  }}
                >
                  {transPrincipalList && transPrincipalList.map(({ name, avatar }, index) => (
                    <AvatarList.Item
                      key={index}
                      tips={name}
                      src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                    />
                  ))}
                </AvatarList>
                <span className={indexStyles.content__principalList_info}>
                  {`${transPrincipalList.length}位填写人`}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px' }} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
              </div>
            </div>
            {is_show_spread_arrow && this.renderEditDetailContent()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}