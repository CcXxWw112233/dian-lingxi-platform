import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class UploadAttachmentModal extends Component {
    render() {
        return (
            <div>
                上传附件组件
            </div>
        )
    }
}
// 只关联public弹窗内的数据
function mapStateToProps({ }) {
    return {}
  }
  

