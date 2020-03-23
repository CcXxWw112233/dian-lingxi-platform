import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import { principalList } from '../../../constant'
import ConfirmInfoOne_one from './ConfirmInfoOne_one'
import ConfirmInfoOne_two from './ConfirmInfoOne_two'
import ConfirmInfoOne_three from './ConfirmInfoOne_three'
import ConfirmInfoOne_five from './ConfirmInfoOne_five'
import AmendComponent from '../AmendComponent'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { Button } from 'antd'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class ConfirmInfoOne extends Component {

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
    this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  filterForm = (value,key) => {
    const { field_type } = value
    let container = (<div></div>)
    switch (field_type) {
      case '1':
        container = <ConfirmInfoOne_one itemKey={key} itemValue={value}/>
        break;
      case '2':
        container = <ConfirmInfoOne_two itemKey={key} itemValue={value}/>
        break;
      case '3':
        container = <ConfirmInfoOne_three itemKey={key} itemValue={value}/>
        break;
      case '5':
        container = <ConfirmInfoOne_five itemKey={key} itemValue={value}/>
        break;
    
      default:
        break;
    }
    return container
  }

  // 渲染编辑详情的内容  
  renderEditDetailContent = () => {
    const { itemValue } = this.props
    const { forms = [], description, deadline_value } = itemValue
    return (
      <div>
        {/* 表单内容 */}
        {
          forms && forms.length ? (
            <div style={{padding: '16px 0 8px 0', marginTop: '16px', borderTop: '1px solid #e8e8e8'}}>
              {
                forms.map((item,key) => {
                  return this.filterForm(item,key)
                })
              }
            </div>
          ) : (<></>)
        }
        {/* 备注 */}
        {
          description != '' && 
          (
            <div className={indexStyles.select_remarks}>
              <span className={globalStyles.authTheme}>&#xe636; 备注 :</span>
              <div>Ant Design是一个服务于企业级产品的设计体系，基于『确定』和『自然』的设计价值观和模块化的解决方案，让设计者专注于更好的用户体验。</div>
            </div>
          )
        }
      </div>
    )
  }

  render() {
    const { itemKey, itemValue, processEditDatas = [], projectDetailInfoData: { data = [] } } = this.props
    const { transPrincipalList = [], is_show_spread_arrow } = this.state
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '48px' }}>
        {/* {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>} */}
        
        {processEditDatas.length <= itemKey + 1 ? null : <div className={indexStyles.completeLine}></div>}
        <div className={indexStyles.circle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 上 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe7b1;</span>
                  <span>前期资料整理</span>
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
            <div style={{display:'flex',alignItems: 'center',justifyContent: 'space-between'}}>
              <div className={indexStyles.content__principalList_icon}>
                <AvatarList
                  size="small"
                  maxLength={10}
                  excessItemsStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                  }}
                >
                  {(transPrincipalList && transPrincipalList.length) && transPrincipalList.map(({ name, avatar }, index) => (
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
                <span style={{position: 'relative'}}>
                  <AmendComponent type="1" updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} placementTitle="填写人" data={data} itemKey={itemKey} itemValue={itemValue} />
                </span>
              </div>
              <div style={{marginRight: '16px'}}>
                <span style={{fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px'}} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
                <span style={{position: 'relative'}}>
                  <AmendComponent updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} placementTitle="完成期限" data={data} itemKey={itemKey} itemValue={itemValue} />
                </span>
              </div>
            </div>
            { is_show_spread_arrow && this.renderEditDetailContent()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}