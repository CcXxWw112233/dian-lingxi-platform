// 热点页面

import React, { Component } from 'react'
import mainStyles from './hot.less'
import { Link, NavLink } from 'dva/router'
import { Icon } from 'antd'
import { connect } from 'dva'

@connect(({xczNews = []}) => ({xczNews}))
export default class Hot extends Component {

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
        const { xczNews } = this.props;
        console.log(xczNews)
        return (
            <div className={mainStyles.mainContainer}>
                <div className={mainStyles.list}>
                    <Link to="/technological/xczNews" style={{color: '#fff', background: '#1890FF'}}>乡村振兴</Link>
                    <NavLink to="/technological/xczNews">空间规划</NavLink>
                    <Link to="/technological/xczNews">城市设计</Link>
                    <Link to="/technological/xczNews">区域发展</Link>
                    <Link to="/technological/xczNews">多规合一</Link>
                    <Link to="/technological/xczNews">智慧城市</Link>
                    <Link to="/technological/xczNews">美丽中国</Link>
                    <Link to="/technological/xczNews">特色小镇</Link>
                    <Link to="/technological/xczNews">海绵城市</Link>
                    <Link to="/technological/xczNews">新型城镇</Link>
                    <Link to="/technological/xczNews">雄安新区</Link>
                    <Link to="/technological/xczNews">
                        更多
                        <Icon type="down" className="down" />
                    </Link>
                </div>

                <div className={mainStyles.info}>
                    <div className={mainStyles.title}>
                        <h2>政策</h2>
                        <a href="#">
                            更多
                            <Icon type="right" />
                        </a>
                    </div>
                    <div className={mainStyles.news}>
                        <ul>
                            {
                                this.state.list.map((item, index) => {
                                    if (!item.hasImg) {
                                        return (
                                            <li>
                                                {/* <div className={mainStyles.left}></div> */}
                                                <div className={mainStyles.right}>
                                                    <div className={mainStyles.message}>
                                                        <i className={mainStyles.dot}></i>
                                                        <a className={mainStyles.text} href="#">{item.text}</a>
                                                    </div>
                                                    <div className={mainStyles.dot_note}>
                                                        <span>{item.newsNet}</span>
                                                        <span>{item.newsDate}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li>
                                                <div className={mainStyles.left}>
                                                    <img src="" />
                                                </div>
                                                <div className={mainStyles.right}>
                                                    <div className={mainStyles.message}>
                                                        {/* <i className={mainStyles.dot}></i> */}
                                                        <a className={mainStyles.img_text} href="#">{item.text}</a>
                                                    </div>
                                                    <div className={mainStyles.img_note}>
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
