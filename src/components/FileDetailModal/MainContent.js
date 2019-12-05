import React, { Component } from 'react'
import withBodyClientDimens from '../HOC/withBodyClientDimens'
import ZoomPicture from '../ZoomPicture'
import globalStyles from '@/globalset/css/globalClassName.less'
import mainContentStyles from './mainContent.less'
import CirclePreviewLoadingComponent from '@/components/CirclePreviewLoadingComponent'
import { connect } from 'dva'
import { fileConvertPdfAlsoUpdateVersion, setCurrentVersionFile } from '@/services/technological/file'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { getSubfixName } from '../../utils/businessFunction'
import {
  MESSAGE_DURATION_TIME,
} from "@/globalset/js/constant";

let timer
@connect()
class MainContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isZoomPictureFullScreenMode: false, //图评全屏模式
      onlyReadingShareModalVisible: false, //只读分享model
      onlyReadingShareData: {},

      // 进度条的百分比
      percent: 0,

      currentZoomPictureComponetWidth: 600,
      currentZoomPictureComponetHeight: 600,

      supportFileTypeArray: ['.xlsx', '.xls', '.doc', '.docx', '.ppt', '.pptx', '.png', '.txt', '.gif', '.jpg', '.jpeg', '.tif', '.bmp', '.ico'],
    }

    this.x1 = 0
    this.y1 = 0
    this.isDragging = false
    this.SelectedRect = { x: 0, y: 0 }
  }

  componentDidMount() {
    console.log(document.getElementById('container_fileDetailContentOut') && document.getElementById('container_fileDetailContentOut').offsetWidth, 'sssssss')
    setTimeout(() => {
      const container_fileDetailContentOut = document.getElementById('container_fileDetailContentOut');
      let zommPictureComponentHeight = container_fileDetailContentOut ? container_fileDetailContentOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
      let zommPictureComponentWidth = container_fileDetailContentOut ? container_fileDetailContentOut.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
      this.setState({
        currentZoomPictureComponetWidth: zommPictureComponentWidth,
        currentZoomPictureComponetHeight: zommPictureComponentHeight
      })
    }, 200)
  }

  // 当圈子展开关闭的时候以及浏览器视图变化时, 实时获取当前的width
  componentWillReceiveProps(nextProps) {
    const { chatImVisiable: newChatImVisiable } = nextProps
    const { chatImVisiable } = this.props
    // 根据圈子做自适应
    if (newChatImVisiable != chatImVisiable) { // 是展开和关闭需要重新获取宽高
      setTimeout(() => {
        const container_fileDetailContentOut = document.getElementById('container_fileDetailContentOut');
        let zommPictureComponentHeight = container_fileDetailContentOut ? container_fileDetailContentOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
        let zommPictureComponentWidth = container_fileDetailContentOut ? container_fileDetailContentOut.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
        this.setState({
          currentZoomPictureComponetWidth: zommPictureComponentWidth,
          currentZoomPictureComponetHeight: zommPictureComponentHeight
        })
      }, 200)
    } else { // 这里是浏览器视图变化的时候需要重新获取宽高
      // setTimeout(() => {
      //   const container_fileDetailContentOut = document.getElementById('container_fileDetailContentOut');
      //   let zommPictureComponentHeight = container_fileDetailContentOut ? container_fileDetailContentOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
      //   let zommPictureComponentWidth = container_publicFileDetailModal ? container_publicFileDetailModal.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
      //   this.setState({
      //     currentZoomPictureComponetWidth: zommPictureComponentWidth,
      //     currentZoomPictureComponetHeight: zommPictureComponentHeight
      //   })
      // }, 200)
    }
  }

  // 获取当前用户的ID
  getCurrentUserId = () => {
    try {
      const { id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
      return id
    } catch (e) {
      return ''
    }
  }

  // 点击是否全屏
  handleZoomPictureFullScreen = (flag) => {
    this.setState({
      isZoomPictureFullScreenMode: flag,
      percent: 0
    })
    clearTimeout(timer)
  }

  updateState = () => {
    this.setState({
      is_petty_loading: !isZoomPictureFullScreenMode && false,
      is_large_loading: isZoomPictureFullScreenMode && false,
      percent: 0
    })
  }

  fetchConvertPdfAlsoUpdateVersion = ({file_name, file_id}) => {
    const { currentPreviewFileData = {} } = this.props
    const { supportFileTypeArray = [] } = this.state
    let FILE_NAME = getSubfixName(file_name)
    if (supportFileTypeArray.indexOf(FILE_NAME) != -1) {
      fileConvertPdfAlsoUpdateVersion({id: file_id}).then(res => {
        if (isApiResponseOk(res)) {
          let isPDF = getSubfixName(res.data.file_name) == '.pdf'
          if (isPDF) {
            this.props.getFilePDFInfo && this.props.getFilePDFInfo({id: res.data.id})
            this.props.updateStateDatas && this.props.updateStateDatas({filePreviewCurrentFileId: res.data.id, currentPreviewFileData:{ ...currentPreviewFileData, id: res.data.id }, currentPreviewFileName: res.data.file_name, fileType: getSubfixName(res.data.file_name)})
            setCurrentVersionFile({id: res.data.id, set_major_version: '1'}).then(result => {
              if (isApiResponseOk(result)) {
  
              }
            })
          } else {
            this.props.getCurrentFilePreviewData && this.props.getCurrentFilePreviewData({id:res.data.id})
          }
          
        } else {
          message.warn(res.message, MESSAGE_DURATION_TIME)
          if (res.code == 4047) { // 表示转换失败
            message.error(res.message, MESSAGE_DURATION_TIME)
          }
        }
      })
    }
  }

  // 加载进度条
  updateProcessPercent = () => {
    const { dispatch } = this.props
    const { filePreviewCurrentFileId, currentPreviewFileData = {} } = this.props
    const { id, board_id, file_name } = currentPreviewFileData
    const { isZoomPictureFullScreenMode } = this.state
    let percent = this.state.percent + 10;
    // return
    if (percent > 100) {
      if (timer) clearTimeout(timer)
      this.setState({
        percent: 100
      })
      this.fetchConvertPdfAlsoUpdateVersion({file_id: id, file_name: file_name})
      return
    }
    this.setState({
      percent
    })
    timer = setTimeout(() => {
      this.updateProcessPercent()
    }, 500)
  }

  // 除pdf外的其他文件进入圈评
  handleEnterCirclePointComment = () => {
    const { isZoomPictureFullScreenMode } = this.state
    this.updateProcessPercent()
    this.setState({
      is_petty_loading: !isZoomPictureFullScreenMode,
      is_large_loading: isZoomPictureFullScreenMode,
      percent: 0
    })
  }

  // 渲染非全屏模式圈评图片
  renderPunctuateDom() {
    const { clientHeight, filePreviewUrl, fileType, filePreviewCurrentFileId, currentPreviewFileData = {}, componentHeight, componentWidth } = this.props
    const { board_id, is_privilege, privileges, id } = currentPreviewFileData
    const { currentZoomPictureComponetWidth, currentZoomPictureComponetHeight, is_petty_loading, percent, } = this.state

    return (
      <>
        {
          is_petty_loading ? (
            <CirclePreviewLoadingComponent
              height={clientHeight - 100 - 60}
              percent={percent}
              is_loading={is_petty_loading}
              style={{ left: '0', right: '0', top: '50%', bottom: '0', margin: '0 180px', position: 'absolute', transform: 'translateY(-25%)', display: 'block', opacity: 1 }} />
          ) : (
              <div style={{
                // minWidth: currentZoomPictureComponetWidth + 'px', minHeight: currentZoomPictureComponetHeight + 'px', 
                overflow: 'auto', textAlign: 'center', position: 'relative'
              }}>
                {/* {
          checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, [], checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)) ? ('') : (
            <div onClick={this.alarmNoEditPermission} className={globalStyles.drawContent_mask}></div>
          )
        } */}
                {filePreviewUrl && (
                  <ZoomPicture
                    // {...this.props}
                    imgInfo={{ url: filePreviewUrl }}
                    componentInfo={{ width: currentZoomPictureComponetWidth + 'px', height: currentZoomPictureComponetHeight + 'px' }}
                    userId={this.getCurrentUserId()}
                    handleFullScreen={this.handleZoomPictureFullScreen}
                    filePreviewCurrentFileId={filePreviewCurrentFileId}
                    handleEnterCirclePointComment={this.handleEnterCirclePointComment}
                    isShow_textArea={true}
                  />
                )}
              </div>
            )
        }
      </>
    )
  }

  // 渲染不支持的文件格式
  renderNotSupport(type) {
    let content = (<div></div>)
    switch (type) {
      case '.obj':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe62f;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe62f;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.3dm':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe626;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe626;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.iges':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe62b;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe62b;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.ma':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe630;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe630;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.mb':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe628;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe628;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.skp':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe62e;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe62e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.dwg':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe62a;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe62a;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      case '.psd':
        content = (
          <div style={{ textAlign: 'center' }}>
            <i className={globalStyles.authTheme} style={{ fontSize: '80px', color: '#5CA8F8' }}>&#xe627;</i>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe627;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe61e;</i>
              <i className={globalStyles.authTheme} style={{ fontSize: '58px' }}>&#xe6cf;</i>
            </div>
            <i style={{ color: 'gray', fontSize: '12px' }}>把文件转换为pdf格式即可在灵犀上圈点协作</i>
          </div>
        )
        break;
      default:
        break;
    }
    return content
  }

  render() {
    const iframeDom = ('')
    const { clientHeight } = this.props
    const { filePreviewIsUsable, filePreviewIsRealImage, fileType } = this.props
    return (

      <div className={mainContentStyles.fileDetailContentOut} ref={'fileDetailContentOut'} style={{ height: clientHeight - 100 - 60 }}>
        {filePreviewIsUsable ? (
          filePreviewIsRealImage ? (
            this.renderPunctuateDom()
          ) : (
              iframeDom
            )
        ) : (
            <div className={mainContentStyles.fileDetailContentLeft} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16, color: '#595959' }}>
              <div>
                {this.renderNotSupport(fileType)}
              </div>
            </div>
          )}

      </div>

    )
  }
}

export default withBodyClientDimens(MainContent)

