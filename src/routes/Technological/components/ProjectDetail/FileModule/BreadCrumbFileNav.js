
import React from 'react'
import { Breadcrumb } from  'antd'
import indexStyles from './index.less'

export default class BreadCrumbFileNav extends React.Component {
  fileNavClick(data) {
    const { value: { id, name }, key } = data
    const { datas = {} } = this.props.model
    const { breadcrumbList = [] } = datas
    breadcrumbList.splice(key + 1, breadcrumbList.length - key - 1) //删除当前点击后面的元素下标
    this.props.updateDatas({breadcrumbList, currentParrentDirectoryId: id})
    //这里执行请求列表元素
  }
  render() {
    const { datas = {} } = this.props.model
    const { breadcrumbList = [] } = datas

    return (
      <div className={indexStyles.BreadCrumbFileNavOut}>
        {breadcrumbList.length>1 &&  <div className={indexStyles.BreadCrumbFileNavContent}>
          <Breadcrumb
            separator=">"
          >
            {breadcrumbList.map((value, key) => {
              return(
                <Breadcrumb.Item key={key} onClick={this.fileNavClick.bind(this,{value, key})}>{value.name}</Breadcrumb.Item>
              )
            })}
          </Breadcrumb>
        </div>}
      </div>
    )
  }

}
