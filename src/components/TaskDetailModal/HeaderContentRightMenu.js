import React, { Component } from 'react'
import { Tooltip } from 'antd'
import headerStyles from './HeaderContent.less'
import VisitControl from '../../routes/Technological/components/VisitControl/index'
import ShareAndInvite from '../../routes/Technological/components/ShareAndInvite/index'

export default class HeaderContentRightMenu extends Component {
  render() {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <span style={{marginRight:0}}>
            <VisitControl />
          </span>
          <span>
            <ShareAndInvite />
          </span>
        </div>
      </div>
    )
  }
}
