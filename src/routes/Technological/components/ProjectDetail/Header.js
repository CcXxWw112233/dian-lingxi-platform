import React from 'react'
import indexStyle from './index.less'
import { UPLOAD_FILE_SIZE } from '../../../../globalset/js/constant'
import { Icon, Menu, Dropdown, Tooltip, Modal, Checkbox, Upload, Button, message } from 'antd'
import ShowAddMenberModal from '../Project/ShowAddMenberModal'
import {REQUEST_DOMAIN_FILE} from "../../../../globalset/js/constant";
import Cookies from 'js-cookie'
import MenuSearch from '../TecPublic/MenuSearch'

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

  //项目操作----------------start
  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm(board_id) {
    const that = this
    Modal.confirm({
      title: '确认要退出该项目吗？',
      content: <div style={{color:'rgba(0,0,0, .8)',fontSize: 14}}>
        <span >退出后将无法获取该项目的相关动态</span>
        {/*<div style={{marginTop:20,}}>*/}
        {/*<Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>*/}
        {/*</div>*/}
      </div>,
      zIndex: 2000,
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
  //项目操作---------------end

  //右方部分点击-----------------start
  //右方app应用点击
  appClick(key) {
    this.props.updateDatas({
      appsSelectKey: key
    })
    this.props.appsSelect({
      appsSelectKey: key
    })
  }
  //文档操作----start
  quitOperateFile() {
    this.props.updateDatas({
      selectedRowKeys: [],
    })
  }
  reverseSelection() {
    const {datas: {  selectedRowKeys = [], fileList = []}} = this.props.model
    const newSelectedRowKeys = []
    for (let i = 0; i < fileList.length; i++) {
      for (let val of selectedRowKeys) {
        if(val !== i){
          console.log(i)
          newSelectedRowKeys.push(i)
        }
      }
    }
    this.props.updateDatas({selectedRowKeys: newSelectedRowKeys})
  }
  createDirectory() {
    const { datas: { fileList = [], filedata_1 = [], isInAddDirectory = false } } = this.props.model
    if(isInAddDirectory) { //正在创建的过程中不能添加多个
      return false
    }
    const obj = {
      file_id: '',
      file_name: '',
      file_size: '-',
      update_time: '-',
      creator: `-`,
      type: '1',
      isInAdd: true
    }
    fileList.unshift(obj)
    filedata_1.unshift(obj)
    this.props.updateDatas({fileList, filedata_1, isInAddDirectory: true})
  }
  collectionFile() {

  }
  downLoadFile() {
    const { datas: { fileList, selectedRowKeys } } = this.props.model
    let chooseArray = []
    for(let i=0; i < selectedRowKeys.length; i++ ){
      chooseArray.push(fileList[selectedRowKeys[i]].file_id)
    }
    const ids = chooseArray.join(',')
    this.props.fileDownload({ids})

    //将要进行多文件下载的mp3文件地址，以组数的形式存起来（这里只例了3个地址）
    // let mp3arr = ["http://pe96wftsc.bkt.clouddn.com/ea416183ad91220856c8ff792e5132e1.zip?e=1536660365&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:XK9eRCWcG8yDztiL7zct2jrpIvc=","http://pe96wftsc.bkt.clouddn.com/2fc83d8439ab0d4507dc7154f3d50d3.pdf?e=1536659325&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:DGertCGKCr3Y407F6fY9ZGgkP4M=", "http://pe96wftsc.bkt.clouddn.com/ec611c887680f9264bb5db8e4cb33141.docx?e=1536659379&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:9IkALD1DjOBvQtv3uAvtzk5y694=",];

    // const download = (name, href) => {
    //   var a = document.createElement("a"), //创建a标签
    //     e = document.createEvent("MouseEvents"); //创建鼠标事件对象
    //   e.initEvent("click", false, false); //初始化事件对象
    //   a.href = href; //设置下载地址
    //   a.download = name; //设置下载文件名
    //   a.dispatchEvent(e); //给指定的元素，执行事件click事件
    // }
    // let iframes = ''
    // for (let index = 0; index < mp3arr.length; index++) {
      // const iframe = '<iframe style="display: none;" class="multi-download"  src="'+mp3arr[index]+'"></iframe>'
      // iframes += iframe
      // window.open(mp3arr[index])
      // download('第'+ index +'个文件', mp3arr[index]);
    // }
    // this.setState({
    //   iframes
    // })
  }
  moveFile() {
    this.props.updateDatas({
      copyOrMove: '0',//copy是1
      openMoveDirectoryType: '1',
      moveToDirectoryVisiblie: true
    })
  }
  copyFile() {
    this.props.updateDatas({
      copyOrMove: '1',//copy是1
      openMoveDirectoryType: '1',
      moveToDirectoryVisiblie: true
    })
  }
  deleteFile() {
    const { datas: { fileList, selectedRowKeys, projectDetailInfoData= {} } } = this.props.model
    const { board_id } = projectDetailInfoData
    let chooseArray = []
    for(let i=0; i < selectedRowKeys.length; i++ ){
      chooseArray.push({type: fileList[selectedRowKeys[i]].type,id: fileList[selectedRowKeys[i]].file_id})
    }
    this.props.fileRemove({
      board_id,
      arrays: JSON.stringify(chooseArray),
    })
  }
  //文档操作 ---end

  //右方部分点击-----------------end

  render() {
    const that = this
    const {datas: { projectInfoDisplay, projectDetailInfoData = {}, appsSelectKey, selectedRowKeys = [], currentParrentDirectoryId }} = this.props.model
    const { ellipsisShow, dropdownVisibleChangeValue, isInitEntry, isCollection} = this.state
    const { board_name, board_id, is_star, is_create, app_data = [], folder_id } = projectDetailInfoData
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
        {is_create !== '1'? (
          <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={indexStyle.elseProjectDangerMenu}>
              退出项目
            </div>
          </Menu.Item>
        ) : ('')}

      </Menu>
    );
    //文件上传
    const uploadProps = {
      name: 'file',
      withCredentials: true,
      action: `${REQUEST_DOMAIN_FILE}/file/upload`,
      data: {
        board_id,
        folder_id: currentParrentDirectoryId,
        type: '1',
        upload_type: '1'
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken : Cookies.get('refreshToken'),
      },
      beforeUpload(e) {
        if(e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        }else if(e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
          return false
        }
        let loading = message.loading('正在上传...', 0)
      },
      onChange({ file, fileList, event }) {
        if (file.status === 'uploading') {

        }else{
          // message.destroy()
        }
        if (file.status === 'done') {
          message.success(`上传成功。`);
          that.props.getFileList({folder_id: currentParrentDirectoryId})
        } else if (file.status === 'error') {
          message.error(`上传失败。`);
          setTimeout(function () {
            message.destroy()
          },2000)
        }
      },
    };

    const appsOperator = (appsSelectKey) => {  //右方操作图标
      let operatorConent = ''
      switch (appsSelectKey) {
        case 2:
          operatorConent = (
            <div  style={{color:'#595959'}}>
              <Dropdown overlay={<MenuSearch />}>
                 <span>请选择流程 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></span>
              </Dropdown>
              <Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
            </div>
          )
          break
        case 3:
          operatorConent = (
            <div>
              <span>按分组名称排列 <Icon type="down"  style={{fontSize:14,color:'#bfbfbf'}}/></span>
              <Icon type="appstore-o"  style={{fontSize:14,marginTop:18,marginLeft:14}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
            </div>
          )
          break
        case 4:
          if(selectedRowKeys.length) { //选择文件会改变
            operatorConent = (
              <div style={{display: 'flex',alignItems: 'center',color: '#595959' }} className={indexStyle.fileOperator}>
                <div dangerouslySetInnerHTML={{__html: this.state.iframes}}></div>
                <div style={{marginTop: 18}}>
                  <span style={{color: '#8c8c8c'}}>
                    已选择{selectedRowKeys.length}项
                  </span>
                  <span style={{marginLeft:14}} onClick={this.quitOperateFile.bind(this)}>
                    取消
                  </span>
                  {/*<span style={{marginLeft:14}} onClick={this.reverseSelection.bind(this)}>*/}
                    {/*反选*/}
                  {/*</span>*/}
                </div>
                {/*<Button style={{height: 24, marginTop:16,marginLeft:14}} >*/}
                  {/*<Icon type="star" />收藏*/}
                {/*</Button>*/}
                <Button style={{height: 24, marginTop:16,marginLeft:14}} onClick={this.downLoadFile.bind(this)} >
                  <Icon type="download" />下载
                </Button>
                <Button style={{height: 24, marginTop:16,marginLeft:14}} onClick={this.moveFile.bind(this)}>
                  <Icon type="export" />移动
                </Button>
                <Button style={{height: 24, marginTop:16,marginLeft:14}} onClick={this.copyFile.bind(this)}>
                  <Icon type="copy" />复制
                </Button>
                <Button style={{height: 24, marginTop:16,marginLeft:14, backgroundColor: '#f5f5f5', color: 'red'}} onClick={this.deleteFile.bind(this)}>
                  <Icon type="delete" />移动到回收站
                </Button>
                <div>
                  <Icon type="appstore-o"  style={{fontSize:14,marginTop:20,marginLeft:14}}/> <Icon type="appstore-o" style={{fontSize:14,marginTop:20,marginLeft:16}}/>
                </div>
              </div>
            )
          }else {
            operatorConent = (
              <div style={{display: 'flex',alignItems: 'center', }}>
                <Upload {...uploadProps} showUploadList={false}>
                  <Button style={{height: 24, marginTop:16,}} type={'primary'}>
                    <Icon type="upload" />上传
                  </Button>
                </Upload>
                <Button style={{height: 24, marginTop:16,marginLeft:14}} onClick={this.createDirectory.bind(this)}>
                  <Icon type="plus" />创建文件夹
                </Button>
                <div>
                  <Icon type="appstore-o"  style={{fontSize:14,marginTop:20,marginLeft:14}}/> <Icon type="appstore-o" style={{fontSize:14,marginTop:20,marginLeft:16}}/>
                </div>
              </div>
            )
          }
        default:
          break
      }
      return operatorConent
    }
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
            {app_data.map((value, itemkey) => {
              const { app_name, key } = value
              return (
                <div className={appsSelectKey === key?indexStyle.appsSelect : indexStyle.appsNoSelect} key={itemkey} onClick={this.appClick.bind(this, key)}>{app_name}</div>
              )
            })}
          </div>
          <div className={indexStyle.right_bott}>
            {appsOperator(appsSelectKey)}
          </div>
        </div>
      </div>
      <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
      </div>
  )
  }
}
