import React from 'react'
import { Card, Icon } from 'antd'
import indexstyles from '../index.less'
import {WE_APP_TYPE_KNOW_CITY} from "../../../../../globalset/js/constant";
import ArticleItem from "./ArticleItem";
import PreviewFileModal from '../PreviewFileModal'

export default class CardContentArticle extends React.Component{
  state={
    page_no: 1,
    page_size: 20,
    query_type: '1',
    previewFileModalVisibile: false
  }
  componentWillMount() {
    this.getArticleList()
  }
  getArticleList() {
    const { appType } = this.props
    const { page_size, page_no, query_type } = this.state
    const obj = {
      page_no,
      page_size,
      query_type,
      appType
    }
    this.props.getArticleList(obj)
  }
  getArticleDetail(id,e) {
    this.setPreviewFileModalVisibile()
    this.props.getArticleDetail({
      id,
      appType: this.props.appType
    })
  }
  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }
  render() {
    const { appType, title } = this.props
    const { datas = {} } = this.props.model
    const { knowCityArticles = [] , knowPolicyArticles = [] } = datas
    const list = appType === WE_APP_TYPE_KNOW_CITY? knowCityArticles: knowPolicyArticles
    return (
      <div>
        <div className={indexstyles.cardDetail}>
          <div className={indexstyles.contentTitle}>
            <div>{title}</div>
            {/*<div><Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} /></div>*/}
          </div>
          <div className={indexstyles.contentBody}>
            {list.map((value, key) => {
              const { title,id} = value
              return (
                <div  key={id} onClick={this.getArticleDetail.bind(this, id)}>
                  <ArticleItem {...this.props} appType={appType} itemValue={value}/>
                </div>
              )
            })}
          </div>
        </div>
        <PreviewFileModal {...this.props}  modalVisible={this.state.previewFileModalVisibile} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)} />

      </div>
    )
  }


}

