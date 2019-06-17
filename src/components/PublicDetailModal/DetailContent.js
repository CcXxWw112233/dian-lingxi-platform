import React from 'react'
import indexStyles from './index.less'
import Comment2 from './Comment/Comment2'
import CommentListItem2 from './Comment/CommentListItem2'
import ContentRaletion from '../../components/ContentRaletion'

export default class DetailContent extends React.Component {
  state = {
    isShowAll: false, //是否查看全部
  }

  constructor() {
    super();
    this.relative_content_ref = React.createRef()
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const rects = []
  }
  setIsShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll
    })
  }
  render() {
    const { clientHeight, offsetTopDeviation, isExpandFrame, board_id, currentProcessInstanceId, } =this.props

    const { mainContent = <div></div> } = this.props

    return (
      <div className={indexStyles.fileDetailContentOut} ref={'fileDetailContentOut'} style={{height: clientHeight- offsetTopDeviation - 60}}>
        <div className={indexStyles.fileDetailContentLeft} style={{overflowY: 'auto'}}>
             {/*主要内容放置区*/}
          {mainContent}
        </div>

        <div className={indexStyles.fileDetailContentRight} style={{width: isExpandFrame?0:420}}>

          {/*从文件卡片查看的时候才有*/}
          <div className={indexStyles.fileDetailContentRight_top} ref={this.relative_content_ref}>
            {/*关联内容放置区*/}
            <ContentRaletion
              {...this.props}
              board_id ={board_id}
              isShowAll = {this.state.isShowAll}
              link_id={currentProcessInstanceId}
              link_local={'2'}
            />
          </div>

          <div className={indexStyles.fileDetailContentRight_middle} style={{height: clientHeight - offsetTopDeviation - 60 - 70 - (this.relative_content_ref?this.relative_content_ref.clientHeight : 0)}}>

            <div style={{display: 'flex', justifyContent: 'center',marginTop: '12px' ,fontSize: '14px', cursor: 'pointer', color: '#499BE6'}} onClick={this.setIsShowAll.bind(this)}>{!this.state.isShowAll? '查看全部': '收起部分'}</div>

            {/*动态放置区*/}
            <div style={{fontSize: '12px', color: '#595959'}}>
              <div>
                说的很对
              </div>
            </div>
            {/*评论放置区*/}
            <div>
              <CommentListItem2 />
            </div>
          </div>
          <div className={indexStyles.fileDetailContentRight_bott}>
            <Comment2 />
          </div>


        </div>

      </div>
    )
  }
}
