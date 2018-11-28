import React from 'react'
import { Card } from 'antd'
import indexstyles from '../index.less'
import {WE_APP_TYPE_KNOW_CITY} from "../../../../../globalset/js/constant";
import ArticleItem from "./ArticleItem";

export default class CardContentArticle extends React.Component{
  state={
    page_no: 1,
    page_size: 20,
    query_type: '1'
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
  render() {
    const { appType, title } = this.props
    const { datas = {} } = this.props.model
    const { knowCityArticles = [] , knowPolicyArticles = [] } = datas
    const list = appType === WE_APP_TYPE_KNOW_CITY? knowCityArticles: knowPolicyArticles
    return (
      <div className={indexstyles.cardDetail}>
        <div className={indexstyles.contentTitle}>{title}</div>
        <div className={indexstyles.contentBody}>
          {list.map((value, key) => {
            const { title } = value
            return (
              <ArticleItem key={key} itemValue={value}/>
            )
          })}
        </div>
      </div>
    )
  }


}

