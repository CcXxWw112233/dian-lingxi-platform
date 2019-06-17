// 高层页面

import React, { Component } from 'react'
import { connect } from 'dva'
import highRiseStyles from './highRise.less'
import { Icon } from 'antd'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class HighRise extends Component {

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
        const { highRiseArticlesList = [] } = xczNews;
        // console.log(highRiseArticlesList)
        return (
            <div className={highRiseStyles.mainContainer}>
                {
                    highRiseArticlesList.map(item => {
                        console.log(item)
                        return (
                                <div className={highRiseStyles.info}>
                                    <div className={highRiseStyles.title}>
                                        <h2 id={item.id}>{item.name}</h2>
                                        <a href="#">
                                            更多
                                            <Icon type="right" />
                                        </a>
                                    </div>
                                    <div className={highRiseStyles.news}>
                                        <ul>
                                            {
                                                item.articles.map((item, index) => {
                                                    if (!item.hasImg) {
                                                        return (
                                                            <li>
                                                                <div className={highRiseStyles.right}>
                                                                    <div className={highRiseStyles.message}>
                                                                        <i className={highRiseStyles.dot}></i>
                                                                        <a className={highRiseStyles.text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                    </div>
                                                                    <div className={highRiseStyles.dot_note}>
                                                                        <span>{item.origin_name}</span>
                                                                        <span>{this.getdate(item.publish_time)}</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    } else {
                                                        return (
                                                            <li>
                                                                <div className={highRiseStyles.left}>
                                                                    <img src="" />
                                                                </div>
                                                                <div className={highRiseStyles.right}>
                                                                    <div className={highRiseStyles.message}>
                                                                        <a className={highRiseStyles.img_text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                    </div>
                                                                    <div className={highRiseStyles.img_note}>
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

