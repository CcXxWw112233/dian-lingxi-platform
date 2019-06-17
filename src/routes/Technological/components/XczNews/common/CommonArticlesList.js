import React, { Component } from 'react'
import commonStyles from './common.less'
import { Icon } from 'antd'

export default class CommonArticlesList extends Component {

    // 时间戳转换日期格式
    getdate() {
        var now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " "
     }
     
    render() {
        console.log(this.props)
        const { articlesList = [] } = this.props;
        return (
            <div className={commonStyles.mainContainer}>
                {
                    articlesList.map(item => {
                        // console.log(item)
                        return (
                            <div className={commonStyles.info}>
                                <div className={commonStyles.title}>
                                    <h2 id={item.id}>{item.name}</h2>
                                    <a href="#">
                                        更多
                                        <Icon type="right" />
                                    </a>
                                </div>
                                <div className={commonStyles.news}>
                                    <ul>
                                        {
                                            item.articles.map((item, index) => {
                                                if (!item.hasImg) {
                                                    return (
                                                        <li>
                                                            <div className={commonStyles.right}>
                                                                <div className={commonStyles.message}>
                                                                    <i className={commonStyles.dot}></i>
                                                                    <a className={commonStyles.text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                </div>
                                                                <div className={commonStyles.dot_note}>
                                                                    <span>{item.origin_name}</span>
                                                                    <span>{this.getdate(item.publish_time)}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                } else {
                                                    return (
                                                        <li>
                                                            <div className={commonStyles.left}>
                                                                <img src="" />
                                                            </div>
                                                            <div className={commonStyles.right}>
                                                                <div className={commonStyles.message}>
                                                                    <a className={commonStyles.img_text} target="_blank" href={item.origin_url}>{item.title}</a>
                                                                </div>
                                                                <div className={commonStyles.img_note}>
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
