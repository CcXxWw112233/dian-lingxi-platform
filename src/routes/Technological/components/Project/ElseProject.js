import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card, Modal,Checkbox, Form } from 'antd'
import detailInfoStyle from '../ProjectDetail/DetailInfo.less'
import ShowAddMenberModal from './ShowAddMenberModal'

let is_starinit = null
export default class CollectionProject extends React.Component{
  state = {
    ShowAddMenberModalVisibile: false,
    starOpacity: 0.6,
    isInitEntry: true,
    isCollection: false,
    isSoundsEvrybody: false,
    ellipsisShow: false,//是否出现...菜单
    dropdownVisibleChangeValue: false,//是否出现...菜单辅助判断标志
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
         that.props.quitProject({board_id})
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

  //项目列表点击---------------------
  //星星样式变化start----------------
  starMouseOver() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 1
    })
  }
  starMouseLeave() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 0.6
    })
  }
  starClick(id, e) {
    e.stopPropagation();
    const { itemDetailInfo = {}} = this.props
    const { is_star } = itemDetailInfo
    this.setState({
      isInitEntry: false,
    },function () {
      this.setState({
        isCollection: is_starinit === '1' ? false : this.state.isInitEntry ? false : !this.state.isCollection,
        starOpacity: 1
      },function () {
        if(this.state.isCollection) {
          this.props.collectionProject(id)
        }else{
          this.props.cancelCollection(id)
        }
      })
    })
  }
  //星星样式变化end--------------

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
  projectListItemClick(route,e,a) {
    this.props.routingJump(route)
  }

  render() {
    const { starType,starOpacity, ellipsisShow, dropdownVisibleChangeValue, isInitEntry, isCollection } = this.state
    const { itemDetailInfo = {}} = this.props
    const { data = [], board_id, board_name, is_star, user_count, is_create } = itemDetailInfo // data为项目参与人信息
    is_starinit = is_star
    const menu = (board_id) => {
      return (
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
          {is_create !== '1'? (
            <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
              <div className={indexStyle.elseProjectDangerMenu}>
                退出项目
              </div>
            </Menu.Item>
          ) : ('')}
        </Menu>
      );
    }
    const manImageDropdown = (props) =>{
      const { avatar, email, full_name, mobile, user_id, user_name, we_chat = '无' } = props
      return  (
        <div className={detailInfoStyle.manImageDropdown}>
          <div className={detailInfoStyle.manImageDropdown_top}>
            <div className={detailInfoStyle.left}>
              {avatar ? (<img src="" />) : (
                <div  style={{backgroundColor: '#f2f2f2',textAlign:'center',width: 32, height: 32, borderRadius: 32}}>
                  <Icon type={'user'} style={{color: '#8c8c8c', fontSize: 20,marginTop: 6}}/>
                </div>
              )}
            </div>
            <div className={detailInfoStyle.right}>
              <div className={detailInfoStyle.name}>{full_name}</div>
              <Tooltip title="30% 过期 / 30% 完成 / 40% 正在进行">
                <div className={detailInfoStyle.percent}>
                  <div style={{width: '30%'}}></div>
                  <div style={{width: '30%'}}></div>
                  <div style={{width: '40%'}}></div>
                </div>
              </Tooltip>
            </div>
          </div>
          <div className={detailInfoStyle.manImageDropdown_middle}>
            <div className={detailInfoStyle.detailItem}>
              <div>姓名：</div>
              <div>{full_name}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>组织：</div>
              <div>无</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>邮箱：</div>
              <div>{email}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>手机：</div>
              <div>{mobile}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>微信：</div>
              <div>{we_chat || '无'}</div>
            </div>
          </div>
          {/*<div className={detailInfoStyle.manImageDropdown_bott}>*/}
            {/*<img src="" />*/}
          {/*</div>*/}
        </div>
      )
    }

    return (
      <div>
        <Card style={{position: 'relative',height: 'auto', marginTop: 20}}>
          <div className={indexStyle.listOutmask}></div>
          <div className={indexStyle.listOut} onClick={this.projectListItemClick.bind(this, `/technological/projectDetail?board_id=${board_id}`)}>
            <div className={indexStyle.left}>
              <div className = {indexStyle.top} onMouseLeave={this.setEllipsisHide.bind(this)} onMouseOver={this.setEllipsisShow.bind(this)}>
                <span>{board_name}</span>
                <span className={indexStyle.nameHoverMenu} >
                  <Icon className={indexStyle.star}
                        onMouseOver={this.starMouseOver.bind(this)}
                        onMouseLeave={this.starMouseLeave.bind(this)}
                        onClick={this.starClick.bind(this, board_id)}
                        type={isInitEntry ? (is_star === '1'? 'star':'star-o'):(isCollection? 'star':'star-o')} style={{margin: '0 0 0 8px',opacity: starOpacity,color: '#FAAD14 '}} />
                    <Dropdown overlay={menu(board_id)} trigger={['click']} onVisibleChange={this.onDropdownVisibleChange.bind(this)}>
                      <Icon type="ellipsis"  style={{fontSize:18,margin: '0 0 0 8px',display: (ellipsisShow || dropdownVisibleChangeValue) ? 'inline-block': 'none'}} onClick={this.ellipsisClick}/>
                    </Dropdown>
                </span>
              </div>
              <div className ={indexStyle.bottom}>
                {data.map((value, key) => {
                  const { avatar, email, full_name, mobile, user_id, user_name } = value
                  if(key < 7) {
                    return (
                      <Dropdown overlay={manImageDropdown(value)} key={key}>
                        {avatar? (
                          <img src="" key={key} className={indexStyle.taskManImag}></img>
                        ):(
                          <div className={indexStyle.taskManImag} style={{backgroundColor: '#f2f2f2',textAlign:'center'}}>
                            <Icon type={'user'} style={{color: '#8c8c8c'}}/>
                          </div>
                        )
                        }
                      </Dropdown>
                    )
                  }
                })}
                {data.length > 7? (
                  <div style={{display: 'flex',fontSize: 12}}>
                    <div className={indexStyle.manwrap} ><Icon type="ellipsis" style={{fontSize:18}}/></div>{user_count}位任务执行人
                  </div>
                ) : ('')}
              </div>
            </div>
            <div className={indexStyle.right}>
              <div className={indexStyle.rightItem}>
                <div>0</div>
                <div>剩余任务</div>
              </div>
              <div className={indexStyle.rightItem}>
                <div style={{color: '#8c8c8c'}}>0</div>
                <div>已完成</div>
              </div>
              <div className={indexStyle.rightItem}>
                <div >0</div>
                <div>距离下一节点</div>
              </div>
            </div>
          </div>
        </Card>
        <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
      </div>
    )
  }
}
