// 权威页面

import React, { Component } from 'react'
import authorityStyles from './authority.less'
import { Link } from 'dva/router'
import { Icon } from 'antd'

export default class HighRise extends Component {
    constructor(pros) {
        super(pros)
        this.state = {
            list: [
                {
                    hasImg: false,
                    text: '国务院办公厅关于全面开展工程建设项目审批制度改革的实施意见',
                    newsNet: '新华社',
                    newsDate: '2019-05-24',
                    id: 1,
                },
                {
                    hasImg: true,
                    text: '中共中央 国务院关于支持河北雄安新区全面深化改革和扩大开放的指导意见 ',
                    newsNet: '央视新闻网',
                    newsDate: '2019-05-15',
                    id: 2,
                },
                {
                    hasImg: false,
                    text: '中共中央办公厅 国务院办公厅印发《地方党政领导干部食品安全责任制规定》',
                    newsNet: '人民日报海外网',
                    newsDate: '2019-05-20',
                    id: 3,
                },
                {
                    hasImg: true,
                    text: '韩长赋：“五推进一加强”推动实施乡村振兴战略',
                    newsNet: '新华社',
                    newsDate: '2019-05-24',
                    id: 4,
                },
            ]
        }
    }

    render() {
        return (
            <div className={authorityStyles.mainContainer}>

                <div className={authorityStyles.info}>
                    <div className={authorityStyles.title}>
                        <h2>改革解读</h2>
                        <a href="#">
                            更多
                            <Icon type="right" />
                        </a>
                    </div>
                    <div className={authorityStyles.news}>
                        <ul>
                            {
                                this.state.list.map((item, index) => {
                                    if (!item.hasImg) {
                                        return (
                                            <li>
                                                {/* <div className={authorityStyles.left}></div> */}
                                                <div className={authorityStyles.right}>
                                                    <div className={authorityStyles.message}>
                                                        <i className={authorityStyles.dot}></i>
                                                        <a className={authorityStyles.text} href="#">{item.text}</a>
                                                    </div>
                                                    <div className={authorityStyles.dot_note}>
                                                        <span>{item.newsNet}</span>
                                                        <span>{item.newsDate}</span>
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
                                                        {/* <i className={authorityStyles.dot}></i> */}
                                                        <a className={authorityStyles.img_text} href="#">{item.text}</a>
                                                    </div>
                                                    <div className={authorityStyles.img_note}>
                                                        <span>{item.newsNet}</span>
                                                        <span>{item.newsDate}</span>
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
            </div>
        )
    }
}


