import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import MoreOptionsComponent from '../../MoreOptionsComponent'
import { connect } from 'dva'
import { principalList } from '../../../constant'

@connect(mapStateToProps)
export default class ConfigureStepTypeThree extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // principalList
      designatedPersonnelList: []
    }
  }

  // 把assignees中的执行人,在项目中的所有成员过滤出来
  filterAssignees = () => {
    const { projectDetailInfoData: { data = [] } } = this.props
    const { designatedPersonnelList = [] } = this.state
    let new_data = [...data]
    let newDesignatedPersonnelList = designatedPersonnelList && designatedPersonnelList.map(item => {
      return new_data.find(item2 => item2.user_id == item) || {}
    })
    newDesignatedPersonnelList = newDesignatedPersonnelList.filter(item => item.user_id)
    return newDesignatedPersonnelList

  }

  componentDidMount() {
    // this.resize()
  }

  titleResize = () => {
    if (!this.refs && !this.refs.autoTitleTextArea) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.autoTitleTextArea.style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs.autoTitleTextArea.scrollHeight >= this.refs.autoTitleTextArea.offsetHeight) {
      this.refs.autoTitleTextArea.style.height = this.refs.autoTitleTextArea.scrollHeight + 'px'
    }
  }

  gradeResize = () => {
    if (!this.refs && !this.refs.autoGradeTextArea) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.autoTitleTextArea.style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs.autoGradeTextArea.scrollHeight >= this.refs.autoGradeTextArea.offsetHeight) {
      this.refs.autoGradeTextArea.style.height = this.refs.autoGradeTextArea.scrollHeight + 'px'
    }
  }

  weightResize = () => {
    if (!this.refs && !this.refs.autoWeightTextArea) return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.autoTitleTextArea.style.height = 'auto';  

    // 如果高度不够，再重新设置
    if (this.refs.autoWeightTextArea.scrollHeight >= this.refs.autoWeightTextArea.offsetHeight) {
      this.refs.autoWeightTextArea.style.height = this.refs.autoWeightTextArea.scrollHeight + 'px'
    }
  }

  handleChangeAutoTextArea = (e) => {
    e && e.stopPropagation()
    // console.log(this.refs, 'ssssssssssssssssssssss_thi.refs')
    // console.log(e.target.value, 'sssssssssssssssssssssssss_value')
    // if (e.keyCode >=48 && e.keyCode <= 57) {
    //   console.log(e.target.value,'ssssssssssssssssssssss_value')
    // }
    // 表示执行的是title的文本框
    if (this.refs && this.refs.autoTitleTextArea) {
      this.titleResize()
    }
    // 表示执行的是 分值文本框
    if (this.refs && this.refs.autoGradeTextArea) {
      this.gradeResize()
    }

    if (this.refs && this.refs.autoWeightTextArea) {
      this.weightResize()
    }

    // let height = parseInt(getComputedStyle(e.target).height.slice(0, -2), 10);
    // return
    //关键是先设置为auto，目的为了重设高度（如果字数减少）
    // this.refs.myTA.style.height = 'auto';  

    //如果高度不够，再重新设置
    // if(this.refs.myTA.scrollHeight >= this.refs.myTA.offsetHeight){
    //     this.refs.myTA.style.height = this.refs.myTA.scrollHeight + 'px'
    // }
  }

  // 渲染默认的table表格, 即没有开启权重评分
  renderDefaultTableContent = () => {
    return (
      <table className={indexStyles.popover_tableContent} border={1} style={{ borderColor: '#E9E9E9' }} width="352px">
        <tr style={{ width: '352px', height: '38px', border: '1px solid #E9E9E9', textAlign: 'center', background: '#FAFAFA' }}>
          <th style={{ width: '260px' }}>标题</th>
          <th>最高分值</th>
        </tr>
        <tr style={{ width: '352px', height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
          <th style={{ width: '260px' }}>
            {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoTitleTextArea" />
          </th>
          <th style={{ position: 'relative' }}>
            {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoGradeTextArea" />
            <div className={indexStyles.rating_moreBox}>
              <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
            </div>
          </th>
        </tr>
        {/* <tr style={{ width: '352px', height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
          <th style={{ width: '260px' }}>
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoTitleTextArea" />
          </th>
          <th style={{ position: 'relative' }}>
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoGradeTextArea" />
            <div className={indexStyles.rating_moreBox}>
              <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
            </div>
          </th>
        </tr> */}
      </table>
    )
  }

  // 渲染具有权重的表格
  renderWeightTableContent = () => {
    return (
      <table className={indexStyles.popover_tableContent} border={1} style={{ borderColor: '#E9E9E9' }} width="352px">
        <tr style={{ width: '352px', height: '38px', border: '1px solid #E9E9E9', textAlign: 'center', background: '#FAFAFA' }}>
          <th style={{ width: '170px' }}>标题</th>
          <th style={{width: '90px'}}>权重占比%</th>
          <th style={{width: '90px'}}>最高分值</th>
        </tr>
        <tr style={{ width: '352px', height: '38px', border: '1px solid #E9E9E9', textAlign: 'center' }}>
          <th style={{ width: '170px' }}>
            {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoTitleTextArea" />
          </th>
          <th style={{ width: '90px' }}>
            {/* <div className={`${indexStyles.rating_editTable} ${globalStyles.global_vertical_scrollbar}`} contentEditable={true}></div> */}
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoWeightTextArea" />
          </th>
          <th style={{ position: 'relative', width: '90px' }}>
            {/* <div className={indexStyles.rating_editTable} contentEditable={true}></div> */}
            <textarea onChange={this.handleChangeAutoTextArea} ref="autoGradeTextArea" />
            <div className={indexStyles.rating_moreBox}>
              <span className={indexStyles.rating_more_icon}><span className={globalStyles.authTheme}>&#xe7fd;</span></span>
            </div>
          </th>
        </tr>
      </table>
    )
  }


  renderContent = () => {
    return (
      <div className={indexStyles.popover_content}>
        <div style={{ minHeight: '352px' }} className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '352px', color: 'rgba(0,0,0,0.45)' }}>
            <span>评分内容：</span>
            <span style={{ display: 'inline-block' }}>
              <span style={{ verticalAlign: 'middle' }}>权重评分 <span style={{ fontSize: '16px' }} className={globalStyles.authTheme}>&#xe845;&nbsp;&nbsp;</span>:&nbsp;&nbsp;&nbsp;</span>
              <span><Switch size="small" /></span>
            </span>
          </div>
          {/* {this.renderDefaultTableContent()} */}
          {this.renderWeightTableContent()}
          <Button className={indexStyles.rating_button}>
            <span className={globalStyles.authTheme}>&#xe782;</span>
            <span>添加评分</span>
          </Button>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button type="primary" style={{ width: '100%' }}>确定</Button>
        </div>
      </div>
    )
  }

  // 渲染指定人员
  renderDesignatedPersonnel = () => {
    const { projectDetailInfoData: { data = [], board_id, org_id } } = this.props
    // const { designatedPersonnelList = [] } = this.state
    let designatedPersonnelList = this.filterAssignees()
    return (
      <div style={{ flex: 1, padding: '8px 0' }}>
        {
          !designatedPersonnelList.length ? (
            <div style={{ position: 'relative' }}>
              <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                overlayStyle={{ maxWidth: '200px' }}
                overlay={
                  <MenuSearchPartner
                    listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={designatedPersonnelList}
                    board_id={board_id}
                    invitationType='1'
                    invitationId={board_id}
                    invitationOrg={org_id}
                    chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                }
              >
                {/* 添加通知人按钮 */}

                <div className={indexStyles.addNoticePerson}>
                  <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                </div>
              </Dropdown>
            </div>
          ) : (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', lineHeight: '22px' }}>
                {designatedPersonnelList.map((value, index) => {
                  const { avatar, name, user_name, user_id } = value
                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                      <div className={`${indexStyles.user_item}`} style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }} key={user_id}>
                        {avatar ? (
                          <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                            <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                          </Tooltip>
                        ) : (
                            <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                              <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                              </div>
                            </Tooltip>
                          )}
                        <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${indexStyles.userItemDeleBtn}`}></span>
                      </div>
                    </div>
                  )
                })}
                <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlayStyle={{ maxWidth: '200px' }}
                  overlay={
                    <MenuSearchPartner
                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={designatedPersonnelList}
                      board_id={board_id}
                      invitationType='1'
                      invitationId={board_id}
                      invitationOrg={org_id}
                      chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                  }
                >
                  {/* 添加通知人按钮 */}

                  <div className={indexStyles.addNoticePerson} style={{ marginTop: '-6px' }}>
                    <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                  </div>
                </Dropdown>
              </div>
            )
        }

      </div>
    )
  }

  render() {
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData: { data = [], board_id, org_id } } = this.props
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
          <div className={indexStyles.ratingItems}>
            <div className={indexStyles.rating_itemsValue}>
              <p>
                <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer' }}>
                  <Tooltip title="评分项" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span style={{ marginRight: '9px' }}>评分项:</span>
                  </Tooltip>
                  <Tooltip overlayStyle={{ minWidth: '110px' }} title="权重占比: 90%" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span className={indexStyles.rating_weight}>*90%</span>
                  </Tooltip>
                </span>
                <span className={globalStyles.authTheme}>&#xe785;</span>
              </p>
              <div className={indexStyles.rating_grade}>
                <span>最高<span className={indexStyles.rating_grade_value}>100</span>分</span>
              </div>
            </div>
            <div>
              <div onClick={(e) => e.stopPropagation()} className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
                <Popover
                  // key={`${itemKey}-${itemValue}`}
                  title={<div className={indexStyles.popover_title}>配置评分</div>}
                  trigger="click"
                  // visible={this.state.popoverVisible}
                  onClick={(e) => e.stopPropagation()}
                  content={this.renderContent()}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placement={'bottomRight'}
                  zIndex={1010}
                  className={indexStyles.popoverWrapper}
                  autoAdjustOverflow={false}
                // onVisibleChange={this.onVisibleChange}
                >
                  <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
                    <span style={{ color: '#1890FF' }} className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe78e;</span>
                  </span>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        {/* 评分人 */}
        <div>
          <div style={{ paddingTop: '18px', minHeight: '98px', borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
            <div>
              <span style={{ color: 'rgba(0,0,0,0.45)' }}><span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe7b2;</span> 评分人&nbsp;:</span>
              <span style={{ display: 'inline-block', marginRight: '36px', marginLeft: '18px', position: 'relative' }}>
                <Switch size="small" />
                <span style={{ margin: '0 8px', color: 'rgba(0,0,0,0.65)', verticalAlign: 'middle' }}>锁定评分人</span>
                <Tooltip overlayStyle={{ minWidth: '270px' }} title="锁定评分人后启动流程时不可修改评分人" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <span style={{ color: '#D9D9D9', fontSize: '16px', verticalAlign: 'middle', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe845;</span>
                </Tooltip>
              </span>
              <span style={{ display: 'inline-block', position: 'relative' }}>
                <Switch size="small" />
                <span style={{ margin: '0 8px', color: 'rgba(0,0,0,0.65)', verticalAlign: 'middle' }}>评分时相互不可见</span>
                <Tooltip overlayStyle={{ minWidth: '400px' }} title="2人以上的评分过程中，各评分人的评分值互相不可见，待所有评分人完成评分后，显示各评分人的评分值" placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <span style={{ color: '#D9D9D9', fontSize: '16px', verticalAlign: 'middle', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe845;</span>
                </Tooltip>
              </span>
            </div>
            <div>
              {this.renderDesignatedPersonnel()}
            </div>
          </div>
        </div>
        {/* 评分结果判定 */}
        <div>
          <div style={{ minHeight: '210px', padding: '16px 0px', borderBottom: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ color: 'rgba(0,0,0,0.45)' }}>
              <span className={globalStyles.authTheme}>&#xe7bf;</span>
              <span style={{ marginLeft: '4px' }}>评分结果判定：</span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>计算方式</span>
              <span>
                <Select style={{ width: '114px', height: '40px' }}>

                </Select>
              </span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>结果分数</span>
              <span>
                <Select style={{ width: '114px', height: '40px' }}></Select>
                <InputNumber style={{ width: '114px', height: '32px', margin: '0px 8px' }} />
                <Select style={{ width: '114px', height: '40px' }}></Select>
              </span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>其余情况</span>
              <Select style={{ width: '114px', height: '40px' }}></Select>
            </div>
          </div>
        </div>
        {/* 更多选项 */}
        <div>
          <MoreOptionsComponent itemKey={itemKey} itemValue={itemValue} updateConfigureProcess={this.updateConfigureProcess} data={data} board_id={board_id} org_id={org_id} />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}