import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip } from 'antd'
import CommentStyles from './Comment.less'

const Dragger = Upload.Dragger

const arr = [1,2,3,4,5,6,7,8,9,12,11,12,13,14,15,16,17,18,19,20,21]
export default class CommentListItem extends React.Component {
  state = {
    closeNormal: true,
    commentListArr: arr
  }

  boxOnMouseOver() {
    this.setState({
      closeNormal: false
    })
  }
  hideBeyond(){
    this.setState({
      closeNormal: true
    })
  }


  render() {
    const { closeNormal, commentListArr } = this.state
    const listItem = (key) => (
      <div className={CommentStyles.commentListItem}>
        <div><span>我</span>{key}</div>
        <div>今天 12:30</div>
      </div>
    )
    return (
      <div className={CommentStyles.commentListItemBox}>
        {commentListArr.length > 20 ?(
          <div className={CommentStyles.commentListItemControl}>
            {closeNormal?(
              <div>
                <Icon type="eye" />
              </div>
            ):(
              <div>
                <Icon type="arrow-up" onClick={this.hideBeyond.bind(this)}/>
              </div>
            )}
          </div>
        ) : ('')}
        <div  onMouseOver={this.boxOnMouseOver.bind(this)}>
          {commentListArr.map((value, key) => {
            if(closeNormal && key > 19) {
              return false
            }
            return (
              <div key={key}>
                {listItem(key)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}


