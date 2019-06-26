// 公用的文章列表

import React, { Component } from 'react'
import commonStyles from './common.less'
import { Icon } from 'antd'
import { connect } from 'dva'

@connect(({ xczNews }) => ({
    xczNews,
}))
export default class CommonArticlesList extends Component {

    // 时间戳转换日期格式
    getdate() {
        var now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " "
     }

     // 更多的点击事件
     handleMore(id) {
         const { dispatch } = this.props;
         dispatch({
             type: 'xczNews/updateDatas',
             payload: {
                category_ids: id,
                moreFlag: false,
                hotFlag: false,
                highRiseFlag: false, // 高层的开关
                authorityFlag: false, // 权威的开关
                dataBaseFlag: false,
                page_no: 1
             }
         })
         dispatch({
            type: 'xczNews/getHeaderSearch',
            payload: {
                
            }
         })
     }
     
    render() {
        // console.log(this.props)
        const { articlesList = [] } = this.props;
        return (
            <div className={commonStyles.mainContainer}>
                {
                   articlesList && articlesList.length && articlesList.map(item => {
                        // console.log(item)
                        return (
                            <div className={commonStyles.info}>
                                <div className={commonStyles.title}>
                                    <h2 id={item.id}>{item.name}</h2>
                                    <span onClick={() => { this.handleMore(item.id) }}>
                                        更多
                                        <Icon type="right" />
                                    </span>
                                </div>
                                <div className={commonStyles.news}>
                                    <div className={commonStyles.ul}>
                                        {
                                            item.articles.map((item, index) => {
                                                if (!item.hasImg) {
                                                    return (
                                                        <div className={commonStyles.li}>
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
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className={commonStyles.li}>
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
                                                        </div>
                                                    )
                                                }
                                                
                                            })
                                        }   
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
