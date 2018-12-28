import React from 'react'
import { Card, Icon } from 'antd'
import indexstyles from '../index.less'
import { getArticleList } from '../../../../../services/technological/workbench'
import {WE_APP_TYPE_KNOW_CITY} from "../../../../../globalset/js/constant";
import ArticleItem from "./ArticleItem";
import PreviewArticleModal from '../PreviewArticleModal'

export default class CardContentArticle extends React.Component{
  state={
    page_no: 1,
    page_size: 20,
    query_type: '1',
    previewArticleModalVisibile: false,
    listData: [], //所需加载的数据
    loadMoreText: '加载中...',
    loadMoreDisplay: 'none',
    scrollBlock: true, //滚动加载锁，true可以加载，false不执行滚动操作
  }
  componentWillMount() {
    this.getArticleList()
  }
  //分页逻辑
  async getArticleList() {
    const { appType } = this.props
    const { page_size, page_no, query_type, listData= [] } = this.state
    const obj = {
      page_no,
      page_size,
      query_type,
      appType
    }
    const res = await getArticleList(obj)
    if(res.code === '0') {
      const data = res.data
      this.setState({
        listData: Number(page_no) === 1? res.data : listData.concat(...data),
        scrollBlock: !(data.length < page_size),
        loadMoreText: (data.length < page_size)?'暂无更多数据': '加载中...',
      },() => {
        this.setState({
          loadMoreDisplay: this.state.listData.length?'block': 'none',
        })
      })
    }
  }
  contentBodyScroll(e) {
    if(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20) {
      const { scrollBlock } = this.state
      if(!scrollBlock) {
        return false
      }
      this.setState({
        page_no: ++this.state.page_no,
        scrollBlock: false
      },() => {
        this.getArticleList()
      })
    }
  }

  getArticleDetail(id,e) {
    this.setPreviewArticleModalVisibile()
    this.props.getArticleDetail({
      id,
      appType: this.props.appType
    })
  }
  setPreviewArticleModalVisibile() {
    this.setState({
      previewArticleModalVisibile: !this.state.previewArticleModalVisibile
    })
  }
  render() {
    const { loadMoreDisplay, loadMoreText, listData} = this.state
    const { appType, title } = this.props
    return (
      <div>
        <div className={indexstyles.cardDetail}>
          <div className={indexstyles.contentTitle}>
            <div>{title}</div>
            {/*<div><Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} /></div>*/}
          </div>
          <div className={indexstyles.contentBody} onScroll={this.contentBodyScroll.bind(this)}>
            {listData.map((value, key) => {
              const { title,id} = value
              return (
                <div  key={id} onClick={this.getArticleDetail.bind(this, id)}>
                  <ArticleItem {...this.props} appType={appType} itemValue={value}/>
                </div>
              )
            })}
            {!listData.length && !listData?(
              <div className={indexstyles.nodata} >暂无内容</div>
            ): ('')}
            <div className={indexstyles.Loading} style={{display: loadMoreDisplay }}>{loadMoreText}</div>
          </div>

        </div>

        <PreviewArticleModal {...this.props}  modalVisible={this.state.previewArticleModalVisibile} setPreviewArticleModalVisibile={this.setPreviewArticleModalVisibile.bind(this)} />
      </div>
    )
  }


}

