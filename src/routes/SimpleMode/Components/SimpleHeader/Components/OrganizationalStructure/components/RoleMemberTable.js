import React, { Component, lazy, Suspense } from 'react'
import styles from './rolemembertable.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import dva, { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../../models/technological/orgStructure'
import { Avatar, Dropdown, Select } from 'antd'
import {
  AppstoreOutlined,
} from '@ant-design/icons';

const TreeRemoveBoardMemberModal = lazy(() =>
  import(
    '@/routes/Technological/components/ProjectDetail/DetailInfo/TreeRemoveBoardMemberModal'
  )
)
const { Option } = Select;

@connect(({ [OrgStructureModel.namespace]: { orgMembersList, currentOrgTagList } }) => ({
  orgMembersList, currentOrgTagList
}))
/** 组织架构的右侧成员列表
 * @description 用于展示组织架构成员列表
 */
export default class RoleMemberTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      member: ['王力宏'],
      list: ['北京', '上海', '广州', '深圳'],
      orglist: [{
        title: '一线',
        list: [
          {
            title: '北京',
            list: []
          }, {
            title: '上海',
            list: []
          }, {
            title: '深圳',
            list: [
              {
                title: '',
                list: ['南山', '罗湖']
              }
            ]
          }, {
            title: '广州',
            list: []
          },
        ]
      }],
      searchList: [],
      /**
       * 是否展示检索匹配标签列表
       */
      isShowSearch: false,
      currentTag: '',
      inputValue: '',
      isconfirmCurrentTag: false
    }
  }
  componentDidMount() {
    this.getMemberTagList();
  }
  /**
   * 添加成员
   * @returns 
   */
  addRoleMenber() {
    console.log('添加成员')
    this.props.addRoleMember()
  }
  /**
   * 删除成员
   * @returns 
   */
  deleteMember() {
    console.log('删除成员')
  }

  /**
   * 获取输入框的内容 根据输入的内容检索列表
   * @param {*} e 
   */
  getPrintTagKey = e => {
    var { currentOrgTagList } = this.props;
    var searchList = currentOrgTagList && currentOrgTagList.filter(item => {
      return item.name.search(e.target.value) != -1
    })

    this.setState({
      searchList: searchList,
      isShowSearch: true,
      isconfirmCurrentTag: false,
      currentTag: e.target.value,
    })
  }
  /**
   * 获取组织标签列表
   * @param {*} e 
   */
  getMemberTagList() {
    const { dispatch } = this.props
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'getMemberTagList'
      ].join('/'),
      payload: {
        org_id: localStorage.getItem('OrganizationId'),
      }
    })
  }
  /**
   * 为成员打标签
   * @param {*} e 
   */
  addRoleMenberTag(item) {
    const { dispatch } = this.props
    const { currentMemberId } = this.state;
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'addRoleMenberTag'
      ].join('/'),
      payload: {
        label_id: item.id,
        member_id: currentMemberId
      }
    }).then((res) => {
      this.props.getRolePermissionsAndMenber()
      this.setState({
        isconfirmCurrentTag: true,
        // moreVisible:false,
        currentLableID:item.id,
        currentTag: item.name,
        isShowSearch: false
      })
    })
  }
  /**
   * 移除成员标签
   */
  deleteRelaMemberTag() {
    const { dispatch } = this.props
    const { currentMemberId,currentLableID } = this.state;
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'deleteRelaMemberTag'
      ].join('/'),
      payload: {
        label_id: currentLableID,
        member_id: currentMemberId
      }
    }).then(() => {
      this.props.getRolePermissionsAndMenber()
      this.setState({
        moreVisible: false
      })
    })
  }

  /**
   * 获取输入框的内容 回车键
   * @param {*} e 
   */
  enterPrintTagKey = e => {
    this.addMenberTag()
  }
  /**
   * 添加标签
   */
  addMenberTag() {
    const {currentSelectValue} = this.state;

    const { dispatch } = this.props
    if (currentSelectValue) {
      dispatch({
        type: [
          OrgStructureModel.namespace,
          'addNewMemberTag'
        ].join('/'),
        payload: {
          org_id: localStorage.getItem('OrganizationId'),
          name: currentSelectValue,
          color: ''
        }
      }).then(res => {
        console.log('sssssss',res)
        debugger
        this.addRoleMenberTag(res)
      })
    }
    this.setState({
      isconfirmCurrentTag: true,
      isShowSearch: false,
      // currentTag: '',
    })
  }
  /**
   * 组件卸载
   */
  componentWillUnmount() {
    this.setState({
      searchList: [],
      isShowSearch: false
    })
  }
  /**删除标签 */
  deleteTag = item => {
    console.log('删除标签', item)
    const { dispatch } = this.props
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'deleteMemberTag'
      ].join('/'),
      payload: {
        id: item.id
      }
    })
  }
  handleonChange(value) {
    //  this.addMenberTag(value)
    // var { currentOrgTagList } = this.props;
    // var searchList = currentOrgTagList && currentOrgTagList.filter(item => {
    //   return item.name.search(e.target.value) != -1
    // })

    // if(value) {
    //   this.setState({
    //     currentTag:value[1]
    //   })
    // }
   
  

  }
  onSearch (value) {
    var { currentOrgTagList } = this.props;
    var searchList = currentOrgTagList && currentOrgTagList.filter(item => {
      return item.name.search(value) != -1
    })
    this.setState({
      searchList: searchList,
      isShowSearch: true,
      currentSelectValue: value,
    })
  }
  onBlur(value) {
    console.log(`selected onBlur${value}`);
    if(value == '' || !value) {
      this.deleteRelaMemberTag()
    }
  }
  /**
   * 渲染添加标签弹窗
   */
  overlayAddMember(currentOrgTagList) {
    const { list, searchList, isShowSearch, currentTag, currentSelectValue, currentName } = this.state;
    console.log(currentOrgTagList)
    return (
      <div className={styles.add_member_tag}>
        <span className={styles.add_member_title}>给“{currentName}”添加标签</span>
        <Select placeholder="输入创建新标签"
          showSearch
          allowClear
          style={{color:"#212434"}}
          open={true}
          onBlur={this.onBlur.bind(this)}
          onChange={this.handleonChange.bind(this)}
          onSearch={this.onSearch.bind(this)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          dropdownStyle={{ border: 'none'}}
          defaultValue={currentTag}
        
          dropdownRender={(menu) => {
            return (
              <div className={styles.add_member_tagList} 
              style={{
                overflowY: 'auto',
                position: 'relative',
              }}>

                {
                  currentOrgTagList && currentOrgTagList.map((item, key) => {
                    return (
                      <>
                        {/* {menu} */}
                        <div className={styles.add_member_tag_item} onClick={this.addRoleMenberTag.bind(this, item)}>
                          {item.name}
                          <div className={`${styles.role_member_tag_delete_icon}`}>
                            <span
                              className={`${styles.role_member_delete_icon} ${globalStyles.authTheme}`}
                              onClick={this.deleteTag.bind(this, item)}
                            >
                              &#xe661;
                              </span>
                          </div>
                        </div>
                      </>
                    )


                  })
                }
                {
                  isShowSearch && this.overlaySearchTag(searchList)
                }
              </div>
            )

          }
          }
        >
          {/* {
            currentOrgTagList.map(item=>{
             return <Option value={item.name} title={item.name}>{item.name}</Option>
            })
          } */}
        </Select>

        {/* <Input
          onChange={this.getPrintTagKey}
          // value={this.state.currentTag}
          //  onInput={this.getPrintTagKey} 
          value={isconfirmCurrentTag ? currentTag + ' ':currentTag} 
          onPressEnter={e => this.enterPrintTagKey()}
          placeholder='输入创建新标签' className={styles.add_member_tag_input}>
        </Input>
        <div className={styles.add_member_tag_input_area}>
          {
            currentTag && isconfirmCurrentTag && <div className={styles.add_member_tag_input_textbg}>{currentTag}</div>
          }
        </div>
        <div
          className={styles.add_member_tagList}
          style={{
            overflowY: 'auto',
            position: 'relative',
          }}>
          {
            currentOrgTagList && currentOrgTagList.map((item, key) => {
              return (
                <div className={styles.add_member_tag_item} onClick={this.addRoleMenberTag.bind(this, item)}>
                  {item.name}
                  <div className={`${styles.role_member_tag_delete_icon}`}>
                    <span
                      className={`${styles.role_member_delete_icon} ${globalStyles.authTheme}`}
                      onClick={this.deleteTag.bind(this, item)}
                    >
                      &#xe661;
                          </span>
                  </div>
                </div>
              )
            })
          }
        </div> */}


      </div>
    )
  }
  /**
   * 输入关键字检索出来的标签列表
   * @param {*} searchList  检索出来的标签数组
   * @returns 
   */
  overlaySearchTag(searchList) {
    const { currentSelectValue } = this.state;
    return <div className={styles.add_member_tag_search}>
      {
        searchList && searchList.length > 0 ? (
          <div
            className={styles.add_member_tagList}
            style={{
              overflowY: 'auto',
              position: 'relative',
            }}>
            {
              searchList.map((item, key) => {
                return (
                  <div className={styles.add_member_tag_item} onClick={this.addRoleMenberTag.bind(this, item)}>
                    {item.name}
                  </div>
                )
              })
            }
          </div>
        ) : (
          <div className={styles.add_member_tag_creat} onClick={this.addMenberTag()}>{"创建新标签“" + currentSelectValue + "”"}</div>
        )
      }
    </div>
  }


  /**
   * 是否展示标签下拉弹窗
   * @param {*} visible 
   */
  handleVisibleChange = (visible, user_id) => {
    this.setState({
      moreVisible: visible
    })
  }
  /**
   * 点击标签 确认选择哪一条数据
   * @param {*} item 
   */
  selectMember = (item) => {
    console.log(item)
    const { currentOrgTagList } = this.props;
    const item_Tag = currentOrgTagList.filter(value => {
      return value.id == item.label_id[0]
    })
    this.setState({
      currentTag: item_Tag.length > 0 ? item_Tag[0].name : '',
      currentName: item.name,
      currentUserId: item.user_id,
      currentMemberId: item.member_id,
      currentLableID:item.label_id[0]
    })
  }

  moveUserOut() {
    this.setState({
      TreeRemoveBoardMemberModalVisible:true
    })
  }

  /**
   * 移动至 下拉框
   * @returns 
   */
  overlayRoleMenberMore() {
    const { orglist } = this.state;
    return <div className={styles.roleMenberMore}>
      <div className={`${styles.roleMenberMore_item} ${styles.roleMenber_moveOut}`} onClick={this.moveUserOut.bind(this)}>移出组织</div>
      <Dropdown trigger={['hover']}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        overlay={
          this.overlayMoveOrg(orglist)
        }>
        <div className={`${styles.roleMenberMore_item} ${styles.roleMenber_moveTo}`}>移动至
                <span className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}>
            &#xe7d6;
            </span>
        </div>
      </Dropdown>
    </div>
  }

  overlayMoveOrg(orglist) {
    return (
      <div className={styles.roleMenberMove}>
        {
          orglist.map(item => {
            const list = item['list'] || [];
            return <div >
              {
                item['title'] && <div className={styles.roleMenberMove_title}>{item['title']}</div>
              }

              {
                list.map(value => {
                  const data = value['list'] || [];
                  const title = (typeof value == 'string') && value.constructor == String ? value : value['title'];
                  return <div
                  >
                    {
                      data && data.length > 0 ? (
                        <Dropdown trigger={['hover']}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          overlay={
                            this.overlayMoveOrg(data)
                          }>
                          <div className={styles.roleMenberMove_detail}>
                            <div className={styles.roleMenberMove_detail_left}>
                              <span className={`${styles.role_member_current_icon} ${globalStyles.authTheme}`}>
                                &#xe7fc;
                          </span>
                              <div className={styles.roleMenberMove_name}>{title}</div>
                            </div>
                            <span className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}>
                              &#xe7d6;
                        </span>
                          </div>
                        </Dropdown>
                      ) : (
                        <div className={styles.roleMenberMove_detail}>
                          <div className={styles.roleMenberMove_detail_left}>
                            <span className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}>
                              &#xe7fc;
                          </span>
                            <div className={styles.roleMenberMove_name}>{title}</div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                })
              }
            </div>
          })
        }
      </div>
    )
  }

  /**移除成员 */
  setTreeRemoveBoardMemberVisible = () => {
    this.setState({
      TreeRemoveBoardMemberModalVisible: !this.state
        .TreeRemoveBoardMemberModalVisible
    })
  }
  render() {
    const { orgMembersList = [], currentOrgTagList = [] } = this.props
    const { currentUserId } = this.state;
    return <div className={`${styles.role_member}`}
      style={{
        overflowY: 'auto',
        position: 'relative',
      }}
      id={'RoleMemberTable_wrapper'}
    >
      {
        orgMembersList.map((item, key) => {
          const { member_id, user_id, label_id = [] } = item;
          const item_Tag = currentOrgTagList.filter(value => {
            return value.id == label_id[0]
          })
          return <div className={styles.role_member_item} onClick={this.selectMember.bind(this, item)}>
            <div className={styles.role_member_contant}>
              <Dropdown trigger={['click']}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                overlay={
                  this.overlayRoleMenberMore()
                }>
                <div className={`${styles.role_member_icon}`}>
                  <span
                    className={`${styles.role_member_delete_icon} ${globalStyles.authTheme}`}
                  >
                    &#xe855;
                          </span>
                </div>
              </Dropdown>
              {
                item.avatar ? (<Avatar className={`${styles.role_member_avatar}`} src={item.avatar} size={25} />) : (<Avatar className={`${styles.role_member_avatar}`} size={25} icon="user" />)
              }
              <span className={`${styles.role_member_title}`}>{item.name}</span>
            </div>
            <Dropdown trigger={['click']}
              getPopupContainer={triggerNode => document.getElementById('RoleMemberTable_wrapper')}
              onVisibleChange={(visible, user_id) => this.handleVisibleChange(visible, user_id)}
              visible={this.state.moreVisible && user_id == currentUserId}
              // overlayClassName={styles.add_member_tag}
              overlay={
                this.overlayAddMember(currentOrgTagList)
              }>
              <dev className={styles.role_member_tag} >
                {
                  item_Tag.length > 0 ? item_Tag[0].name : '标签'
                }
              </dev>
            </Dropdown>
          </div>
        })
      }
      <TreeRemoveBoardMemberModal
          visible={true}
          setTreeRemoveBoardMemberVisible={
            this.setTreeRemoveBoardMemberVisible
          }
          removerUserId={'21212121'}
      />
      {/* <Button className={styles.add_role_member}  type='primary' onClick={()=>this.addRoleMenber()}>添加成员</Button> */}
    </div>
  }
}
