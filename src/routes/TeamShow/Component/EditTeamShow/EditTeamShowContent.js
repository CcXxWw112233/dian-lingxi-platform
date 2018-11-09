import React from 'react'
import { Button, Input } from 'antd'
import indexStyles from './index.less'
import BaseInfo from './BaseInfo'
import Edit from './Edit'
import PreviewModal from "./PreviewModal";

const TextArea = Input.TextArea

export default class EditTeamShowContent extends React.Component {


  handleEditorChangeProps(value) {
    this.props.updateDatas({
      content:value
    })
    const that = this
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      that.props.updateDatas({
        previewHtml:　html
      })
    },200)
  }

  render() {
    const {datas: {content, previewHtml }} = this.props.model
    return (
      <div id={'editTeamShowOut'} className={indexStyles.editTeamShowOut}>
        <div className={indexStyles.editTeamShow}>
          <BaseInfo {...this.props}  />
          <Edit  {...this.props} handleEditorChangeProps={this.handleEditorChangeProps.bind(this)}/>
          <div style={{height: 60}}></div>
          <PreviewModal  {...this.props}  />
        </div>
      </div>
    )
  }
}

