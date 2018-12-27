import React from 'react'
import indexstyles from '../index.less'
import { Icon, Avatar } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import Cookies from 'js-cookie'

export default class MyCircleItem extends React.Component {
  render() {
    const { itemValue = {}, itemKey } = this.props
    return (
      <div className={indexstyles.myCircleItem}>
        <div className={indexstyles.hideScrolloutercontainer_1} >
         <div className={`${indexstyles.left} ${indexstyles.hideScrollinnercontainer_1}`}>
           <div>

           </div>
           <div className={indexstyles.left_item}>
              <div>院办院办院办院办院办院办院办院办院办院办院办院办院办院办</div>
              <div>
                <Icon type="folder-open" />
              </div>
            </div>
           <div className={indexstyles.left_item}>
              <div>院办</div>
              <div>
                <Icon type="folder-open" />
              </div>
            </div>
        </div>
        </div>
        <div className={indexstyles.middle}></div>
        <div className={indexstyles.hideScrolloutercontainer_2}>
          <div className={`${indexstyles.right} ${indexstyles.hideScrollinnercontainer_2}`}>
            <div className={indexstyles.right_item}>
              <div className={indexstyles.avatar}>
                <Avatar icon="user" />
              </div>
              <div className={indexstyles.name}>
                流血是
              </div>
              <div className={indexstyles.commit}>
                <Icon type="folder-open" />
              </div>
            </div>
            <div className={indexstyles.right_item}>
              <div className={indexstyles.avatar}>
                <Avatar icon="user" />
              </div>
              <div className={indexstyles.name}>
                流血是
              </div>
              <div className={indexstyles.commit}>
                <Icon type="folder-open" />
              </div>
            </div>
            <div className={indexstyles.right_item}>
              <div className={indexstyles.avatar}>
                <Avatar icon="user" />
              </div>
              <div className={indexstyles.name}>
                流血是
              </div>
              <div className={indexstyles.commit}>
                <Icon type="folder-open" />
              </div>
            </div>
            <div className={indexstyles.right_item}>
              <div className={indexstyles.avatar}>
                <Avatar icon="user" />
              </div>
              <div className={indexstyles.name}>
                流血是
              </div>
              <div className={indexstyles.commit}>
                <Icon type="folder-open" />
              </div>
            </div>
            <div className={indexstyles.right_item}>
              <div className={indexstyles.avatar}>
                <Avatar icon="user" />
              </div>
              <div className={indexstyles.name}>
                流血是
              </div>
              <div className={indexstyles.commit}>
                <Icon type="folder-open" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
