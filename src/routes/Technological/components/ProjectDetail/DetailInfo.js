import React from 'react'
import detailInfoStyle from './DetailInfo.less'
import { Icon, Menu, Dropdown, Tooltip, Modal, Checkbox, Card, Progress, Input, Button } from 'antd'
import AddModalForm from './AddModalForm'
const TextArea = Input.TextArea

const detaiDescription = '欢迎使用ProductName，为了帮助你更好的上手使用好ProductName，我们为你提前预置了这个项目并放置一些帮助你理解每项功能特性的任务卡片。不会耽误你特别多时间，只需要抽空点开卡片并跟随里面的内容提示进行简单操作，即可上手使用。此处显示的文字为项目的介绍信息，旨在帮助参与项目的成员快速了解项目的基本概况，点击可编辑。d如果使用中需要问题，可以随时联系我们进行交流或反馈：support@ProductName.com'

export default class DetailInfo extends React.Component {

  state = {
    isSoundsEvrybody: false, //confirm是否通知项目所有人
    isSoundsEvrybody_2: false,//edit是否通知项目所有人
    editDetaiDescription :false ,//是否处于编辑状态
    detaiDescriptionValue: this.props.model.detaiDescription || detaiDescription
  }

  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm() {
    Modal.confirm({
      title: '确认将他移出项目吗？',
      content: <div style={{color:'rgba(0,0,0, .8)',fontSize: 14}}>
        <span >退出后将无法获取该项目的相关动态</span>
        <div style={{marginTop:20,}}>
          <Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>
        </div>
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk()  {
      }
    });
  }
  //出现confirm-------------end

  //点击区域描述可编辑区域-----------start
  setEditDetaiDescriptionShow() {
    this.setState({
      editDetaiDescription: true
    })
  }
  setEditIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody_2: e.target.checked
    })
  }
  textAreaChange(e) {
    this.setState({
      detaiDescriptionValue: e.target.value
    })
  }
  editSave() {
    const obj = {
      isSoundsEvrybody_2: this.state.isSoundsEvrybody_2,
      detaiDescriptionValue: this.state.detaiDescriptionValue
    }
    console.log(obj)
    this.setState({
      editDetaiDescription: false
    })
  }
  //点击区域描述可编辑区域-----------end

  render() {
    const { editDetaiDescription } = this.state
    const { projectInfoDisplay } = this.props
    const avatarList = [1,2,3,4,5,6,7,8,9]//长度再加一
    const manImageDropdown = (
      <div className={detailInfoStyle.manImageDropdown}>
        <div className={detailInfoStyle.manImageDropdown_top}>
          <div className={detailInfoStyle.left}>
            <img src="" />
          </div>
          <div className={detailInfoStyle.right}>
            <div className={detailInfoStyle.name}>贝克汉姆</div>
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
            <div> 啥进度和啥进度和啥进度和啥进度和啥进度和啥进度和</div>
          </div>
          <div className={detailInfoStyle.detailItem}>
            <div>组织：</div>
            <div> 啥进度和啥进度和啥进度和啥进度和啥进度和啥进度和</div>
          </div>
          <div className={detailInfoStyle.detailItem}>
            <div>邮箱：</div>
            <div> 啥进度和啥进度和啥进度和啥进度和啥进度和啥进度和</div>
          </div>
          <div className={detailInfoStyle.detailItem}>
            <div>手机：</div>
            <div> 啥进度和啥进度和啥进度和啥进度和啥进度和啥进度和</div>
          </div>
          <div className={detailInfoStyle.detailItem}>
            <div>微信：</div>
            <div> 啥进度和啥进度和啥进度和啥进度和啥进度和啥进度和</div>
          </div>
        </div>
        <div className={detailInfoStyle.manImageDropdown_bott}>
          <img src="" />
        </div>
      </div>
    )
    const EditArea = (
      <div>
        <TextArea defaultValue={detaiDescription} autosize className={detailInfoStyle.editTextArea} onChange={this.textAreaChange.bind(this)}/>
        <div style={{ textAlign: 'right'}}>
          <div>
            <Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, marginTop: 10 }} onChange={this.setEditIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>
          </div>
          <Button type={'primary'} style={{fontSize: 14, marginTop: 10 }} onClick={this.editSave.bind(this)}>保存</Button>
        </div>
      </div>
    )
    return (
      <div className={projectInfoDisplay?detailInfoStyle.detailInfo : detailInfoStyle.detailInfo_2}>
        <div className={detailInfoStyle.top}>
          <div className={detailInfoStyle.topItem}>
            <div>27</div>
            <div>剩余任务</div>
          </div>
          <div className={detailInfoStyle.topItem}>
            <div style={{color: '#8c8c8c'}}>27</div>
            <div>已完成</div>
          </div>
          <div className={detailInfoStyle.topItem}>
            <div >27</div>
            <div>距离下一节点</div>
          </div>
        </div>
        <div className={detailInfoStyle.manImageList}>
          {
            avatarList.map((value, key) => {
              if(key < avatarList.length - 1) {
                return(
                  <div className={detailInfoStyle.manImageItem} key={ key }>
                    <div className={detailInfoStyle.delete} onClick={this.confirm.bind(this)}>
                      <Icon type="close" />
                    </div>
                    <Dropdown overlay={manImageDropdown}>
                      <img src=""  />
                    </Dropdown>
                  </div>
                )
              }else{
                return(
                  <div className={detailInfoStyle.addManImageItem} key={key} onClick={this.props.showModal}>
                    <Icon type="plus" style={{color:'#8c8c8c',fontSize:20,fontWeight: 'bold'}}/>
                  </div>
                )
              }
            })
          }
        </div>
        {!editDetaiDescription?(
          <div className={detailInfoStyle.Bottom} onClick={this.setEditDetaiDescriptionShow.bind(this)}>
            {this.state.detaiDescriptionValue}
          </div>
        ) : ( EditArea)}
        <AddModalForm {...this.props} />
      </div>
    )
  }
}

