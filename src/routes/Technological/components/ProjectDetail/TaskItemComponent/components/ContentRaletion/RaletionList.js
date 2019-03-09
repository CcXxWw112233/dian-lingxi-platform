import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import indexStyles from './index.less'

export default class RaletionList extends React.Component {

  state = {

  }

  render() {
    const data = [{name: 'http拉开了的大力', id: '111'}, {name: 'http拉开ssss了的大力', id: '222'}]
    return(
      <div className={indexStyles.relaData}>
        {data.map((value, key) => {
          const { id, name } = value
          return (
            <div key={id} className={indexStyles.relaData_item}>
              <span></span>
              <span>{name}</span>
            </div>
          )
        })}
      </div>
    )
  }
}
