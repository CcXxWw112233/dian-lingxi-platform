// 权威页面

import React, { Component } from 'react'
import { connect } from 'dva'
import authorityStyles from './authority.less'
import { Icon } from 'antd'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class Authority extends Component {

    // 时间戳转换日期格式
    getdate() {
        var now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " "
     }

    render() {
        const { xczNews } = this.props;
        const { authorityArticlesList = [] } = xczNews;
        return (
            <div className={authorityStyles.mainContainer}>
                {
                    authorityArticlesList.map(item => {
                        // console.log(item)
                        return (
                            <div className={authorityStyles.info}>
                                <div className={authorityStyles.title}>
                                    <h2 id={item.id}>{item.name}</h2>
                                    <a href="#">
                                        更多
                                        <Icon type="right" />
                                    </a>
                                </div>
                                <div className={authorityStyles.news}>
                                    <ul>
                                        {
                                            item.articles.map((item, index) => {
                                                if (!item.hasImg) {
                                                    return (
                                                        <li>
                                                            <div className={authorityStyles.right}>
                                                                <div className={authorityStyles.message}>
                                                                    <i className={authorityStyles.dot}></i>
                                                                    <a className={authorityStyles.text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                </div>
                                                                <div className={authorityStyles.dot_note}>
                                                                    <span>{item.origin_name}</span>
                                                                    <span>{this.getdate(item.publish_time)}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                } else {
                                                    return (
                                                        <li>
                                                            <div className={authorityStyles.left}>
                                                                <img src="" />
                                                            </div>
                                                            <div className={authorityStyles.right}>
                                                                <div className={authorityStyles.message}>
                                                                    <a className={authorityStyles.img_text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                </div>
                                                                <div className={authorityStyles.img_note}>
                                                                    <span>{item.origin_name}</span>
                                                                    <span>{this.getdate(item.publish_time)}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                }
                                                
                                            })
                                        }   
                                    </ul>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }
}


