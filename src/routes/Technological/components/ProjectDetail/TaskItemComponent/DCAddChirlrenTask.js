import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, } from 'antd'
const TextArea = Input.TextArea

export default class DCAddChirlrenTask extends React.Component{

  render() {
    return(
      <div className={DrawerContentStyles.divContent_1}>
        <div className={DrawerContentStyles.contain_7}>
          <div>
            <div className={DrawerContentStyles.contain_7_add}>
              <Icon type="plus" style={{marginRight: 4}}/>
              <input  placeholder={'子任务'} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
