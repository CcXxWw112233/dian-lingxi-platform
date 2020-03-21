import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import { principalList } from '../../../constant'
import AccomplishStepOne_one from './AccomplishStepOne_one'
import AccomplishStepOne_two from './AccomplishStepOne_two'
import AccomplishStepOne_three from './AccomplishStepOne_three'
import AccomplishStepOne_five from './AccomplishStepOne_five'
import { validateTel, validateEmail, validatePassword, validateFixedTel, validateIdCard, validateChineseName, validatePostalCode, validateWebsite, validateQQ, validatePositiveInt, validateNegative, validateTwoDecimal, } from '../../../../../utils/verify'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { Button } from 'antd'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class AccomplishStepOne extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transPrincipalList: JSON.parse(JSON.stringify(principalList)),
      is_show_spread_arrow: props.itemValue.status != '1' ? false : true,
    }
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

  setCompleteButtonDisabled = () => {
    const { itemValue, itemKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[itemKey]
    const { val_min_length, val_max_length } = forms[itemKey]
    let valiResult = true
    for (let i = 0; i < forms.length; i++) {
      if (forms[i]['is_required'] == '1') { //必填的情况下
        const verification_rule = forms[i]['verification_rule']
        const value = forms[i]['value']
        // console.log(i, verification_rule, validateTel(''))
        switch (verification_rule) {
          case "":
            if ( value.length >= val_min_length && value.length <= val_max_length) {
              valiResult = true
            } else {
              valiResult = false
            }
            break
          case 'mobile':
            valiResult = validateTel(value)
            break;
          case 'tel':
            valiResult = validateFixedTel(value)
            break;
          case 'ID_card':
            valiResult = validateIdCard(value)
            break;
          case 'chinese_name':
            valiResult = validateChineseName(value)
            break;
          case 'url':
            valiResult = validateWebsite(value)
            break;
          case 'qq':
            valiResult = validateQQ(value)
            break;
          case 'postal_code':
            valiResult = validatePostalCode(value)
            break;
          case 'positive_integer':
            valiResult = validatePositiveInt(value)
            break;
          case 'negative':
            valiResult = validateNegative(value)
            break;
          case 'two_decimal_places':
            valiResult = validateTwoDecimal(value)
            break;
          default:
            if (!!value) {
              valiResult = true
            } else {
              valiResult = false
            }
            break
        }
        if (!valiResult) {
          break
        }
      }
    }
    return valiResult
  }

  // 编辑点击事件
  handleEnterConfigureProcess = (e) => {
    e && e.stopPropagation()
    // this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
    // this.props.dispatch({
    //   type: 'publicProcessDetailModal/updateDatas',
    //   payload: {
    //     processPageFlagStep: '1'
    //   }
    // })
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  filterForm = (value,key) => {
    const { field_type } = value
    const { itemKey } = this.props
    let container = (<div></div>)
    switch (field_type) {
      case '1':
        container = <AccomplishStepOne_one parentKey={itemKey} updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} itemKey={key} itemValue={value}/>
        break;
      case '2':
        container = <AccomplishStepOne_two parentKey={itemKey} updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} itemKey={key} itemValue={value}/>
        break;
      case '3':
        container = <AccomplishStepOne_three parentKey={itemKey} updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} itemKey={key} itemValue={value}/>
        break;
      case '5':
        container = <AccomplishStepOne_five parentKey={itemKey} updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} itemKey={key} itemValue={value}/>
        break;
      default:
        break;
    }
    return container
  }

  // 渲染编辑详情的内容  
  renderEditDetailContent = () => {
    const { itemValue } = this.props
    const { forms = [], description, deadline_value, status } = itemValue
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
        {/* 编辑按钮 */}
        {
          status == "1" && 
          (
            <div style={{marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center'}}>
              <Button type="primary" disabled={!this.setCompleteButtonDisabled()} onClick={this.handleEnterConfigureProcess}>完成</Button>
            </div>
          )
        }
      </div>
    )
  }

  render() {
    const { itemKey, processEditDatas = [], itemValue } = this.props
    const { status } = itemValue
    const { transPrincipalList = [], is_show_spread_arrow } = this.state
    return (
      <div id={status == '1' && 'currentDataCollectionItem'} key={itemKey} style={{ display: 'flex', marginBottom: '48px' }}>
        {processEditDatas.length <= itemKey + 1 ? null : <div className={indexStyles.doingLine}></div>}
        {/* <div className={indexStyles.doingLine}></div> */}
        <div className={indexStyles.doingCircle}> {itemKey + 1}</div>
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
                <span style={{fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px'}} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
              </div>
            </div>
            { is_show_spread_arrow && this.renderEditDetailContent()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}