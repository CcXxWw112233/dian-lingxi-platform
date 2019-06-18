// 搜索的文章列表

import React, { Component } from 'react'
import commonStyles from './common.less'
import { connect } from 'dva'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class SearchArticlesList extends Component {

    // 时间戳转换日期格式
    getdate() {
        var now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " "
     }

     // 对象转换数组
     objectToArray(obj) {
        var obj = obj;
        var arr = []
        for (let i in obj) {
            let o = {};
            o[i] = obj[i];
            arr.push(o)
        }
        return arr;
    }
     
    render() {
        const { xczNews } = this.props;
        // const { searchList = {} } = this.props;
        const {searchList, inputValue, onSearchButton } = xczNews;
        console.log(inputValue, onSearchButton)

        return (
            <div className={commonStyles.mainContainer}>
                <p style={{ marginLeft: 25, paddingTop: 15 }}>
                    {`含"${inputValue}"的全部结果共"${1}"条`}
                </p>
                {
                    searchList.records && searchList.records.map(item => {
                        // console.log(list)
                        // console.log(item)
                        return (
                            <div className={commonStyles.info}>
                                <div className={commonStyles.news}>
                                    <ul>
                                        {
                                           !item.hasImg ? (
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
                                                    ) : (
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
