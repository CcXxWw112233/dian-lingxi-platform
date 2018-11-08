import React from 'react'
import { Button, Input } from 'antd'
import indexStyles from './index.less'
import BaseInfo from './BaseInfo'
import ImageTextOne from './ImageTextOne/index'
import Edit from './Edit'
import PreviewModal from "./PreviewModal";
const TextArea = Input.TextArea

export default class EditTeamShow extends React.Component {

  state = {
    templateHtml: ''
  }

  btnClick() {
    const that = this
    that.props.updateDatas({
      teamShowCertainOneShow: false
    })
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      console.log(html)
      that.setState({
        templateHtml: html
      })
    },200)
  }

  handleEditorChangeProps(value) {
    this.setState({
      templateHtml: value,
    })
    const that = this
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      that.setState({
        previewHtml: html
      })
    },200)
  }

  render() {
    const {templateHtml, previewHtml} = this.state
    return (
      <div id={'editTeamShowOut'} className={indexStyles.editTeamShowOut}>
        <div className={indexStyles.editTeamShow}>
          <BaseInfo {...this.props} templateHtml={templateHtml} />
          <Edit editorState={templateHtml}   {...this.props} handleEditorChangeProps={this.handleEditorChangeProps.bind(this)}/>
          <div style={{height: 60}}></div>
          <PreviewModal previewHtml = {previewHtml} {...this.props}  />
        </div>
      </div>
    )
  }
}


