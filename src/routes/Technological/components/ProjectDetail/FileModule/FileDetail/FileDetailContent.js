import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Drawer } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'
import {stopPropagation} from "../../../../../../utils/util";
import Comment from './Comment/Comment'
import Comment2 from './Comment/Comment2'
import CommentListItem2 from './Comment/CommentListItem2'

export default class FileDetailContent extends React.Component {

  versionItemClick({value, key}){
    const { file_resource_id, file_id } = value
    this.props.updateDatas({filePreviewCurrentVersionKey: key, filePreviewCurrentId: file_resource_id, filePreviewCurrentFileId: file_id})
    this.props.filePreview({id: file_resource_id, file_id})
  }

  state = {
    // rects: [{"x":288,"y":176,"width":59,"height":58,"isAready":false},{"x":556,"y":109,"width":48,"height":48,"isAready":false},{"x":477,"y":308,"width":118,"height":123,"isAready":false}],//[],
    rects: [],
    imgHeight: 0,
    imgWidth: 0, //获取到的图片宽高
    punctuateArea: 48, //点击圈点的
    maxImageWidth: 900,//设置imagload的最大值
    currentRect: { x: 0 ,y: 0, width: 0, height: 0 }, //当前操作的矩形属性
    isInAdding: false, //用来判断是否显示评论下拉
    isInEdditOperate: false, //用来判断不是点击存在的圈
    mentionFocus: false,
    point_number: '',
  }
  constructor() {
    super();
    this.x1 = 0
    this.y1 = 0
    this.isDragging = false
    this.SelectedRect = {x: 0, y: 0 }
  }

  componentWillMount() {
    const { datas: { filePreviewCommitPoints=[]} }= this.props.model
    this.setState({
      rects: filePreviewCommitPoints
    })
  }

  componentWillReceiveProps(nextProps) {
    const rects = []
    const { datas: { filePreviewCommitPoints=[]} }= nextProps.model
    this.setState({
      rects: filePreviewCommitPoints
    })
  }

  //评图功能
  previewImgLoad(e) {
    const { maxImageWidth } = this.state
    this.setState({
      imgWidth: e.target.width >= maxImageWidth? maxImageWidth : e.target.width,
      imgHeight: e.target.height
    })
  }
  commitReactArea(data,e) {
    e.stopPropagation()
    const { datas:{ filePreviewCurrentFileId  } } = this.props.model
    this.setState({
      ...data,
      isInEdditOperate: false
    },() => {
      const { point_number } = this.state
      this.props.updateDatas({
        filePreviewPointNumCommits: []
      })
      this.props.getPreviewFileCommits({
        id: filePreviewCurrentFileId,
        point_number,
        type: 'point'
      })
    })

  }
  commitReactArea2(e) {
    e.stopPropagation()
  }
  isObj(obj) {
    if(!obj || typeof obj !='object') {
      return false
    } else {
      return true
    }
  }
  operateAreaClick(e) {
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.x1 = e.pageX - target.offsetLeft;
    this.y1 = e.pageY - target.offsetTop;
    this.SelectedRect = {x: 0, y: 0 }
    if(!this.isDragging) {
      const { punctuateArea, imgHeight, imgWidth } = this.state

      let x = this.x1
      let y = this.y1

      if(imgWidth - x < punctuateArea/2) { //右边界
        x = imgWidth - punctuateArea
      } else if(x < punctuateArea/2) { //左边界
        x = 0
      } else {
        x = x - punctuateArea/2
      }
      if(imgHeight - y < punctuateArea/2) { //下边界
        y = imgHeight - punctuateArea
      } else if(y < punctuateArea/2) { //上边界
        y = 0
      } else {
        y = y - punctuateArea/2
      }
      const property = {
        x: x,
        y: y,
        width: punctuateArea,
        height: punctuateArea,
        isAready: false
      }
      this.props.updateDatas({
        filePreviewPointNumCommits: []
      })
      this.setState({
        currentRect: property,
        isInEdditOperate: true,
        point_number: ''
      })
    }
  }
  operateAreaBlur(e) {
    const that = this
    setTimeout(function () {
      if(that.state.mentionFocus) {
        return false
      }
      that.setState({
        isInAdding: false,
        currentRect: { x: 0 ,y: 0, width: 0, height: 0 }
      })
      that.props.updateDatas({
        filePreviewPointNumCommits: []
      })
    }, 100)

  }
  setMentionFocus(bool) {
    this.setState({
      mentionFocus: bool
    })
  }
  stopDragging() {
    this.right = false;
    const target = this.refs.operateArea
    target.onmousemove = null;
    target.onmuseup = null;
  }
  onmousedown(e) {
    this.setState({
      isInAdding: false
    })
    // 取得target上被单击的点
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.x1 = e.pageX - target.offsetLeft;
    this.y1 = e.pageY - target.offsetTop;
    this.SelectedRect = {x: 0, y: 0 }
    this.isDragging = false

    /*定义鼠标移动事件*/
    target.onmousemove = this.onmousemove.bind(this);
    /*定义鼠标抬起事件*/
    target.onmouseup = this.onmouseup.bind(this);
  }
  onmousemove(e) {
    //mousedown 后开始拖拽时添加
    if(!this.isDragging) {
      const property = {
        x: this.x1,
        y: this.y1,
        width: this.SelectedRect.x,
        height: this.SelectedRect.y,
        isAready: false
      }
      this.setState({
        currentRect: property,
        isInEdditOperate: true,
        point_number: ''
      })
      this.props.updateDatas({
        filePreviewPointNumCommits: []
      })
    }

    // 判断矩形是否开始拖拽
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.isDragging = true

    // 判断拖拽对象是否存在
    if (this.isObj(this.SelectedRect)) {
      // 取得鼠标位置
      const x = e.pageX - target.offsetLeft;
      const y = e.pageY - target.offsetTop;
      //------------------------
      //设置高度
      this.SelectedRect.x= x-this.x1;
      this.SelectedRect.y= y-this.y1;

      const {  imgWidth, imgHeight, punctuateArea } = this.state

      // 更新拖拽的最新矩形
      let px = x < this.x1 ? this.x1 -  Math.abs(this.SelectedRect.x) : x -  Math.abs(this.SelectedRect.x)
      let py = y < this.y1 ? this.y1 -  Math.abs(this.SelectedRect.y) : y -  Math.abs(this.SelectedRect.y)
      let width = Math.abs(this.SelectedRect.x)
      let height = Math.abs(this.SelectedRect.y)

      if(imgWidth - px  - width< 0) { //右边界
        width = imgWidth - px
      } else if(x < punctuateArea/2) { //左边界
        width = 0
      } else {
        width = x - punctuateArea/2
      }
      if(imgHeight - py - height < 0) { //下边界
        height = imgHeight - py
      } else if(y < punctuateArea/2) { //上边界
        height = 0
      } else {
        height = y - punctuateArea/2
      }
      const property ={
        x: px,
        y: py,
        width: Math.abs(this.SelectedRect.x),
        height: Math.abs(this.SelectedRect.y),
        isAready: false
      }

      this.setState({
        currentRect: property
      })
    }
  }
  onmouseup() {
    this.setState({
      isInAdding: true
    })
    this.stopDragging()
  }

  render() {

    const { rects, imgHeight = 0, imgWidth = 0,maxImageWidth, currentRect={}, isInAdding = false, isInEdditOperate = false } = this.state
    const { clientHeight } =this.props

    const fileDetailContentOutHeight = clientHeight - 60
    const { datas: { filePreviewCommitPoints, filePreviewCommits, filePreviewPointNumCommits, isExpandFrame = false, filePreviewUrl, filePreviewIsUsable, filePreviewCurrentId, filePreviewCurrentVersionList=[], filePreviewCurrentVersionKey=0 } }= this.props.model
    const  getIframe = (src) => {
      const iframe = '<iframe style="height: 100%;width: 100%" class="multi-download"  src="'+src+'"></iframe>'
      return iframe
    }

    const getVersionItem = (value, key ) => {
      const { file_name, creator, update_time, file_size } = value
      return (
        <div className={indexStyles.versionInfoListItem} onClick={this.versionItemClick.bind(this,{value, key})}>
          <div className={filePreviewCurrentVersionKey === key ?indexStyles.point : indexStyles.point2}></div>
          <div className={indexStyles.name}>{creator}</div>
          <div className={indexStyles.info}>上传于{update_time}</div>
          <div className={indexStyles.size}>{file_size}</div>
        </div>
      )
    }

    const punctuateDom = (
      <div style={{height: '100%', width: '100%'}} className={`${indexStyles.fileDetailContentLeft} ${indexStyles.noselect}`} >
        <div  style={{margin: '0 auto', marginTop: (fileDetailContentOutHeight - imgHeight) / 2, width: imgWidth, height: imgHeight, overflow: 'hide' }}  ref={'operateArea'}>
          <img src={filePreviewUrl} onLoad={this.previewImgLoad.bind(this)}  style={{ maxWidth: maxImageWidth}} />
          <div tabIndex="0" hideFocus="true" id={'punctuateArea'} onClick={this.operateAreaClick.bind(this)}  onBlur={this.operateAreaBlur.bind(this)} onMouseDown={this.onmousedown.bind(this)}  style={{height: imgHeight,top:-imgHeight, left:0, width: imgWidth, position: 'relative', zIndex: 3, outline: 0}}>
            {rects.map((value, key) => {
              const { flag, coordinates } = value
              const { x, y, width, height } = JSON.parse(coordinates)
              return (
                <div onClick={this.commitReactArea.bind(this,{currentRect: JSON.parse(coordinates), point_number: flag})} onMouseDown={this.commitReactArea2.bind(this)} key={key} style={{position:'absolute', left: x, top: y, width:width, height: height, backgroundColor: 'red',border:'1px solid rgba(24,144,255,.5)',backgroundColor:'rgba(24,144,255,.2)'}}>
                  <div className={indexStyles.flag}>
                    {flag}
                  </div>
                </div>
              )
            })}
            {isInEdditOperate?(
              <div onClick={this.commitReactArea2.bind(this)} onMouseDown={this.commitReactArea2.bind(this)}
                   style={{position:'absolute', left: currentRect.x, top: currentRect.y, width:currentRect.width, height: currentRect.height, backgroundColor: 'red',border:'1px solid rgba(24,144,255,.5)',backgroundColor:'rgba(24,144,255,.2)'}} />
            ):('')}

            {isInAdding? (
              <div style={{position: 'absolute', left: currentRect.x, top: currentRect.y+ currentRect.height + 10}}>
                <Comment {...this.props} currentRect={currentRect} point_number={this.state.point_number} setMentionFocus={this.setMentionFocus.bind(this)}></Comment>
              </div>
            ) : ('')}

          </div>
        </div>

      </div>
    )
    const iframeDom = (
      <div className={indexStyles.fileDetailContentLeft}
      dangerouslySetInnerHTML={{__html: getIframe(filePreviewUrl)}}></div>
    )

    // console.log('ssss','rects',rects)
    // // console.log('ssss',1,'filePreviewCommits',filePreviewCommits)
    // // console.log('ssss',2,'filePreviewPointNumCommits', filePreviewPointNumCommits )
    // console.log('ssss',3,'filePreviewCommitPoints', filePreviewCommitPoints)
    return (
      <div className={indexStyles.fileDetailContentOut} ref={'fileDetailContentOut'} style={{height: clientHeight - 60}}>
        {filePreviewIsUsable? (
          punctuateDom
        ):(
          <div className={indexStyles.fileDetailContentLeft} style={{display: 'flex',justifyContent:'center',alignItems: 'center', fontSize: 16,color: '#595959'}}>
            <div>
              当前文件不支持预览，您可点击下载再进行查看
            </div>
          </div>
        )}

        {/*width: isExpandFrame?0:420*/}

        <div className={indexStyles.fileDetailContentRight} style={{width: isExpandFrame?0:420}}>
          <div className={indexStyles.fileDetailContentRight_top} ref={'versionInfoArea'}>
             <div>版本信息</div>
             <div className={indexStyles.versionInfoList}>
               {filePreviewCurrentVersionList.map((value, key ) => {
                 return (<div key={key}>{getVersionItem(value, key )}</div>)
               })}
             </div>
          </div>

          <div className={indexStyles.fileDetailContentRight_middle} style={{height: clientHeight - 60 - 70 - (this.refs.versionInfoArea?this.refs.versionInfoArea.clientHeight : 0)}}>
            <CommentListItem2 {...this.props} />
          </div>
          <div className={indexStyles.fileDetailContentRight_bott}>
            <Comment2 {...this.props}></Comment2>
          </div>

        </div>

      </div>
    )
  }
}








// <Drawer
//   mask={false}
//   placement="right"
//   closable={false}
//   visible={true}
//   maskClosable={true}
//   width={420}
//   top={172}
//   zIndex={1010}
//   maskStyle={{top: 60}}
{/*>*/}
  {/*<div>sasd</div>*/}
{/*</Drawer>*/}
