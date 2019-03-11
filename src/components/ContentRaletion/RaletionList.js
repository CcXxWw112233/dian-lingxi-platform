import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import indexStyles from './index.less'

//relations 关联内容的列表
export default class RaletionList extends React.Component {

  state = {

  }

  relationClick(content_url) {
    window.open(content_url)
  }

  render() {
   const { relations } = this.props
    return(
      <div className={indexStyles.relaData}>
        {relations.map((value, key) => {
          const { id, linked_name, linked_url } = value
          return (
            <div key={id} className={indexStyles.relaData_item} onClick={this.relationClick.bind(this, linked_url)}>
              <span></span>
              <span>{linked_name}</span>
            </div>
          )
        })}
      </div>
    )
  }
}
