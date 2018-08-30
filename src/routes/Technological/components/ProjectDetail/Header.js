import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip, Modal, Checkbox } from 'antd'
import ShowAddMenberModal from '../Project/ShowAddMenberModal'

let is_starinit = null
export default class Header extends React.Component {

  state = {
    isInitEntry: true, // isinitEntry isCollection用于处理收藏
    isCollection: false,
    ShowAddMenberModalVisibile: false,
    ellipsisShow: false,//是否出现...菜单
    dropdownVisibleChangeValue: false,//是否出现...菜单辅助判断标志
  }
  setProjectInfoDisplay() {
    this.props.updateDatas({ projectInfoDisplay: !this.props.model.datas.projectInfoDisplay, isInitEntry:  true })
  }

  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm(board_id ) {
    const that = this
    Modal.confirm({
      title: '确认要退出该项目吗？',
      content: <div style={{color:'rgba(0,0,0, .8)',fontSize: 14}}>
        <span >退出后将无法获取该项目的相关动态</span>
        {/*<div style={{marginTop:20,}}>*/}
        {/*<Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>*/}
        {/*</div>*/}
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.props.quitProject({ board_id})
      }
    });
  }
  //出现confirm-------------end
  //添加项目组成员操作
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  //菜单按钮点击
  handleMenuClick(board_id, e ) {
    e.domEvent.stopPropagation();
    this.setState({
      ellipsisShow: false,
      dropdownVisibleChangeValue:false
    })
    const { key } = e
    switch (key) {
      case '1':
        this.setShowAddMenberModalVisibile()
        break
      case '2':
        this.props.archivedProject({board_id, is_archived: '1'})
        break
      case '3':
        this.props.deleteProject(board_id)
        break
      case '4':
        this.confirm(board_id )
        break
      default:
        return
    }
  }

  //收藏
  starClick(id, e) {
    e.stopPropagation();
    const { itemDetailInfo = {}} = this.props
    const { is_star } = itemDetailInfo
    this.setState({
      isInitEntry: false,
      isCollection:  this.state.isInitEntry ? (is_starinit === '1' ? false: true ) : !this.state.isCollection,
    },function () {
      if(this.state.isCollection) {
        this.props.collectionProject(id)
      }else{
        this.props.cancelCollection(id)
      }
    })
  }


  //...菜单变化点击
  ellipsisClick(e) {
    e.stopPropagation();
  }
  setEllipsisShow() {
    this.setState({
      ellipsisShow: true
    })
  }
  setEllipsisHide() {
    this.setState({
      ellipsisShow: false
    })
  }
  onDropdownVisibleChange(visible){
    this.setState({
      dropdownVisibleChangeValue: visible,
    })
  }

  render() {
    const {datas: { projectInfoDisplay, projectDetailInfoData = {} } } = this.props.model
    const { ellipsisShow, dropdownVisibleChangeValue, isInitEntry, isCollection} = this.state
    const { board_name, board_id, is_star } = projectDetailInfoData
    is_starinit = is_star

    const menu = (
      <Menu onClick={this.handleMenuClick.bind(this, board_id)}>
        <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            邀请成员加入
          </div>
        </Menu.Item>
        <Menu.Item key={'2'} style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            项目归档
          </div>
        </Menu.Item>
        <Menu.Item key={'3'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            删除项目
          </div>
        </Menu.Item>
        <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectDangerMenu}>
            退出项目
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
      <div className={indexStyle.headout}>
         <div className={indexStyle.left}>
           <div className={indexStyle.left_top} onMouseLeave={this.setEllipsisHide.bind(this)} onMouseOver={this.setEllipsisShow.bind(this)}>
              <Icon type="left-square-o" className={indexStyle.projectNameIcon}/>
               <span className={indexStyle.projectName}>{board_name}</span>
               <Icon className={indexStyle.star}
                     onClick={this.starClick.bind(this, board_id)}
                     type={isInitEntry ? (is_star === '1'? 'star':'star-o'):(isCollection? 'star':'star-o')}
                     style={{margin: '6px 0 0 8px',fontSize: 20,color: '#FAAD14'}} />
               <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.onDropdownVisibleChange.bind(this)} >
                 <Icon type="ellipsis"  style={{fontSize:24,margin: '4px 0 0 8px',display: (ellipsisShow || dropdownVisibleChangeValue) ? 'inline-block': 'none'}}/>
               </Dropdown>
           </div>
           <div className={indexStyle.displayProjectinfo} onClick={this.setProjectInfoDisplay.bind(this)}>
             {projectInfoDisplay ? (
               <span><Icon type="left" style={{marginRight:2}}/>收起项目信息</span>
             ):(
               <span>查看项目信息<Icon type="right" style={{marginLeft:2}}/></span>
             )}

           </div>
         </div>
        <div className={indexStyle.right}>
          <div className={indexStyle.right_top} >
            <span>招标</span>
            <span>流程</span>
            <span>任务</span>
            <span>文档</span>
          </div>
          <div className={indexStyle.right_bott}>
            <span>按分组名称排列 <Icon type="down"  style={{fontSize:14,color:'#bfbfbf'}}/></span>
            <Icon type="appstore-o"  style={{fontSize:14,marginTop:18,marginLeft:14}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
          </div>
        </div>
      </div>
      <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
      </div>
  )
  }
}
