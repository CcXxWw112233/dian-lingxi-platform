import React, { Component } from 'react'
import { connect } from 'dva'
import { Breadcrumb } from 'antd'

@connect(mapStateToProps)
export default class FileDetailBreadCrumbFileNav extends Component {

  render() {
    const { breadcrumbList = [] } = this.props

    return (
      <div>
        <Breadcrumb separator=">">
          {(breadcrumbList && breadcrumbList.length) && breadcrumbList.map((value, key) => {
            return (
              <Breadcrumb.Item key={key}>
                <span>{value && value.file_name}</span>
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      </div>
    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicFileDetailModal: { currentInitFileId, breadcrumbList = [] } }) {
  return { currentInitFileId, breadcrumbList }
}
