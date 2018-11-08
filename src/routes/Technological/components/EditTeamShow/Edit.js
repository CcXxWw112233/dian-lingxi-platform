import React from 'react'
import {message } from 'antd'
import {REQUEST_DOMAIN} from "../../../../globalset/js/constant";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

import Cookies from 'js-cookie'

export default class Edit extends React.Component {

  state = {
  }

  componentDidMount () {

  }

  submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML()
    // console.log(htmlContent)
  }

  handleEditorChange = (editorState) => {
    this.props.handleEditorChangeProps(editorState)
  }
  isJSON = (str) => {
    if (typeof str == 'string') {
      try {
        var obj=JSON.parse(str);
        if(str.indexOf('{')>-1){
          return true;
        }else{
          return false;
        }

      } catch(e) {
        return false;
      }
    }
    return false;
  }
  myUploadFn = (param) => {
    const serverURL = `${REQUEST_DOMAIN}/organization/logo_upload`
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      if(xhr.status === 200 && this.isJSON(xhr.responseText)) {
        param.success({
          url: JSON.parse(xhr.responseText).data.logo,
          meta: {
            id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          }
        })
      }else {
        message.warn('图片上传出现问题了，请重新上传')
      }

    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '图片上传失败!'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

     fd.append('file', param.file)
     xhr.open('POST', serverURL, true)
     xhr.setRequestHeader('Authorization', Cookies.get('Authorization'))
     xhr.setRequestHeader('refreshToken', Cookies.get('refreshToken'))
     xhr.send(fd)
  }
  render () {

    const { editorState } = this.props
    const {datas: { editTeamShowPreview, editTeamShowSave }} = this.props.model

    return (
      <div style={{backgroundColor: '#ffffff'}}>
        {(editTeamShowPreview || editTeamShowSave )? (
         ''
        ) : (
          <BraftEditor
            initialContent={editorState}
            contentFormat = {'html'}
            onHTMLChange = {this.handleEditorChange}
            onSave={this.submitContent.bind(this)}
            media={{uploadFn: this.myUploadFn}}
            contentStyle={{minHeight: 500, height: 1000,overflow: 'auto'}}
          />
        )}

      </div>
    )

  }

}
