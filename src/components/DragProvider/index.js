import React from 'react'
import styles from './index.less'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { debounce } from 'lodash'
import Axios from 'axios'
import { REQUEST_DOMAIN_FILE } from '../../globalset/js/constant'
import { message } from 'antd'
import Cookies from 'js-cookie'
import { setUploadHeaderBaseInfo } from '../../utils/businessFunction'
import DEvent, { DRAGFILESUPLOADSUCCESS } from '../../utils/event'

/**
 * 一个高阶的文件上传组件，如果需要
 * @param {React.Component} Wrapper 需要包裹的组件
 * @returns
 */
function DragProvider(Wrapper) {
  class Index extends React.Component {
    dragRef = React.createRef()
    constructor(props) {
      super(props)
      this.state = {
        isDragIn: false
      }
      this.DragLeave = debounce(this.DragLeave, 300)
      this.leaveTime = null
    }
    componentDidMount() {
      const { current } = this.dragRef
      if (current) {
        current.addEventListener('dragover', this.DragOver)
        current.addEventListener('dragenter', this.DragEnter)
        current.addEventListener('dragleave', this.DragLeave)
        current.addEventListener('drop', this.Drop)
        current.addEventListener('dragend', this.DragEnd)
      }
    }
    componentWillUnmount() {
      const { current } = this.dragRef
      if (current) {
        current.removeEventListener('dragover', this.DragOver)
        current.removeEventListener('dragenter', this.DragEnter)
        current.removeEventListener('dragleave', this.DragLeave)
        current.removeEventListener('drop', this.Drop)
        current.removeEventListener('dragend', this.DragEnd)
      }
    }
    /** 拖拽hover
     * @param {React.DragEvent} e
     */
    DragOver = e => {
      clearTimeout(this.leaveTime)
      e.stopPropagation()
      e.preventDefault()
      if (this.props.uploadDisabled || !this.props.board_id) return
      this.setState({
        isDragIn: true
      })
    }

    /** 拖拽离开
     * @param {React.DragEvent} e
     */
    DragLeave = e => {
      clearTimeout(this.leaveTime)
      e.stopPropagation()
      e.preventDefault()
      if (this.props.uploadDisabled || !this.props.board_id) return
      // 防止闪烁
      this.leaveTime = setTimeout(() => {
        this.setState({
          isDragIn: false
        })
      }, 50)

      // console.log(e, 'DragLeave')
    }

    /** 拖拽松开
     * @param {React.DragEvent} e
     */
    Drop = e => {
      e.stopPropagation()
      e.preventDefault()
      if (this.props.uploadDisabled || !this.props.board_id) return
      this.setState({
        isDragIn: false
      })
      if (e.dataTransfer) this.filesToUpload(e.dataTransfer.files)
    }

    DragEnd = e => {
      e.stopPropagation()
      e.preventDefault()
      if (this.props.uploadDisabled || !this.props.board_id) return
      // console.log(e, 'DragEnd')
    }

    /** 拖拽鼠标进入 */
    DragEnter = e => {
      e.stopPropagation()
      e.preventDefault()
      if (this.props.uploadDisabled || !this.props.board_id) return
      this.setState({
        isDragIn: true
      })
    }

    /** 创建一个属于文件自己的本地id */
    createUid = () => Math.floor(Math.random() * 10000) + 1

    /** 文件上传方法 */
    filesToUpload = files => {
      const f = [].map.call(files, val => {
        val.uid = this.createUid()
        return val
      })
      const hasMaxSize = f.some(file => file.size >= 100 * 1024 * 1024)
      if (hasMaxSize) {
        message.warn('单个文件大小不能超过100MB')
        return
      }
      /** 文件上传 */
      // ;[].forEach.call(files, this.createAxios.bind(this))
      const sendFils = f.map(item => this.createAxios(item, f))
      Promise.all(sendFils)
        .then(res => {
          // console.log(res)
          setTimeout(() => {
            this.updateDatasUpload({
              show_upload_notification: false,
              uploading_file_list: []
            })
          }, 2000)
          /** 触发上传文件成功方法 */
          DEvent.firEvent(DRAGFILESUPLOADSUCCESS, res)
          message.success('上传成功')
        })
        .catch(err => {
          message.warn(err.data?.message || err.message)
          setTimeout(() => {
            this.updateDatasUpload({
              show_upload_notification: false,
              uploading_file_list: []
            })
          }, 2000)
        })
      /** 显示右上角的进度条 */
      this.updateDatasUpload({
        show_upload_notification: true
      })
    }

    /** 合并file和files */
    mergeFile = (file, files) => {
      let arr = []
      arr = files.map(item => {
        if (item.uid === file.uid) {
          return file
        }
        return item
      })
      return arr
    }

    /** 发起请求 */
    createAxios = (file, files) => {
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('board_id', this.props.board_id)
      formdata.append('folder_id', this.props.folder_id)
      formdata.append('upload_type', '1')
      return Axios({
        url: `${REQUEST_DOMAIN_FILE}/file/upload`,
        data: formdata,
        method: 'POST',
        headers: {
          Authorization: Cookies.get('Authorization'),
          refreshToken: Cookies.get('refreshToken'),
          ...setUploadHeaderBaseInfo({ boardId: this.props.board_id })
        },
        onUploadProgress: progressEvent => {
          // console.log(progressEvent)
          if (progressEvent.lengthComputable) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100
            if (percent < 100) {
              file.status = 'uploading'
            } else if (percent === 100) {
              file.status = 'done'
            }
            file.percent = percent
            const arr = this.mergeFile(file, files)
            // console.log(progreeeEvent)
            this.UpdateUpload({ file, files: arr, percent })
          }
        }
      })
        .then(resp => {
          if (resp.data.code !== '0') return Promise.reject(resp)
          file.status = 'done'
          file.response = resp.data
          const arr = this.mergeFile(file, files)
          this.UpdateUpload({ file, files: arr, percent: 100 })
          return resp
        })
        .catch(err => {
          file.status = 'error'
          file.response = err.data
          const arr = this.mergeFile(file, files)
          this.UpdateUpload({ file, files: arr, percent: 100 })
          return Promise.reject(err)
        })
    }

    /** 文件列表更新方法 */
    updateDatasUpload = (data = {}) => {
      const { dispatch } = this.props
      dispatch({
        type: 'uploadNormal/updateDatas',
        payload: {
          ...data
        }
      })
    }

    /** 文件更新 */
    UpdateUpload = ({ file, files }) => {
      this.updateDatasUpload({
        uploading_file_list: files
      })
    }
    /**
     * 拖拽上传的默认提示
     * @returns {JSX.Element}
     */
    tipsContainer = () => (
      <div className={styles.tipsContainer}>
        <div className={styles.tip_pic}>
          <img
            src={require('../../assets/simplemode/upload_picture.png')}
            width="100%"
            alt=""
          />
        </div>
        <span>鼠标松开上传文件</span>
      </div>
    )

    render() {
      const { isDragIn } = this.state
      return (
        <div
          tabIndex="-1"
          ref={this.dragRef}
          style={this.props.contentStyle || {}}
          className={`${styles.container}`}
        >
          <Wrapper {...this.props} />
          {isDragIn && (
            <div
              draggable
              className={`${styles.dropCenterText} ${
                this.props.isEmpty ? '' : styles.notEvent
              }`}
            >
              {this.props.showTips &&
                (this.props.dropText || this.tipsContainer())}
            </div>
          )}
        </div>
      )
    }
  }
  Index = hoistNonReactStatic(Index, Wrapper)
  return Index
}

export default DragProvider
