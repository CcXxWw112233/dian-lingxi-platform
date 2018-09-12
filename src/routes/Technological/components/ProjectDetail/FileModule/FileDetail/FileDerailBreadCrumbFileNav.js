
import React from 'react'
import { Breadcrumb, Menu, Dropdown, Icon } from  'antd'
import indexStyles from './index.less'

export default class FileDerailBreadCrumbFileNav extends React.Component {
  fileNavClick(data) {
    const { value: { id, name, type }, key } = data
    if(type !== '1') {
      return false
    }
    const { datas = {} } = this.props.model
    const { breadcrumbList = [] } = datas
    breadcrumbList.splice(key + 1, breadcrumbList.length - key - 1) //删除当前点击后面的元素下标
    this.props.updateDatas({breadcrumbList, currentParrentDirectoryId: id, isInOpenFile: false})
    //这里执行请求列表元素
  }
  render() {
    const { datas = {} } = this.props.model
    const { breadcrumbList = [], filedata_2 = [] } = datas
    const menu = (
      <Menu>
        {filedata_2.map((value, key) => {
          return(
            <Menu.Item key={key}>{value.name}</Menu.Item>
          )
        })}

      </Menu>
    );
    return (
      <div>
        <div  style={{display: 'flex', cursor: 'pointer',}}>
          <Breadcrumb
            separator=">"
          >
            {breadcrumbList.map((value, key) => {
              return (<Breadcrumb.Item key={key} onClick={this.fileNavClick.bind(this,{value, key})}>{value.name}</Breadcrumb.Item> )
            })}
          </Breadcrumb>
          <Dropdown overlay={menu}>
            <Icon type="caret-down" theme="outlined" style={{ fontSize: 12, margin: '4px 0 0 8px'}} />
          </Dropdown>
        </div>

      </div>
    )
  }

}
