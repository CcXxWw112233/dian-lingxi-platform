import React from 'react'
import { Button, Input } from 'antd'
import indexStyles from './index.less'
import BaseInfo from './BaseInfo'
import Edit from './Edit'
import PreviewModal from "./PreviewModal";

const TextArea = Input.TextArea

export default class EditTeamShowContent extends React.Component {

  state = {
    templateHtml: '',
    previewHtml: ''
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

