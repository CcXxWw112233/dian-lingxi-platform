import React, { Component } from 'react'
import mainStyles from './hot.less'
import { Icon } from 'antd'

export default class Hot extends Component {
    render() {
        return (
            <div className={mainStyles.mainContainer}>
                <div className={mainStyles.list}>
                    <a href="#" style={{color: '#fff', background: '#1890FF'}}>乡村振兴</a>
                    <a href="#">空间规划</a>
                    <a href="#">城市设计</a>
                    <a href="#">区域发展</a>
                    <a href="#">多规合一</a>
                    <a href="#">智慧城市</a>
                    <a href="#">美丽中国</a>
                    <a href="#">特色小镇</a>
                    <a href="#">海绵城市</a>
                    <a href="#">新型城镇</a>
                    <a href="#">雄安新区</a>
                    <a href="#">
                        更多
                        <Icon type="down" className="down" />
                    </a>
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
                            <li>
                                <div className={mainStyles.left}></div>
                                <div className={mainStyles.right}>
                                    <div className={mainStyles.message}>
                                        <i className={mainStyles.dot}></i>
                                        <a href="#">国务院办公厅关于全面开展工程建设项目审批制度改革的实施意见</a>
                                    </div>
                                    <div className={mainStyles.dot_note}>
                                        <span>新华社</span>
                                        <span>2019-05-24</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={mainStyles.left}>
                                    <img src="" />
                                </div>
                                <div className={mainStyles.right}>
                                    <div className={mainStyles.message}>
                                        {/* <i className={mainStyles.dot}></i> */}
                                        <a href="#">中共中央 国务院关于支持河北雄安新区全面深化改革和扩大开放的指导意见 </a>
                                    </div>
                                    <div className={mainStyles.img_note}>
                                        <span>央视新闻网</span>
                                        <span>2019-05-15</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={mainStyles.left}></div>
                                <div className={mainStyles.right}>
                                    <div className={mainStyles.message}>
                                        <i className={mainStyles.dot}></i>
                                        <a href="#">中共中央办公厅 国务院办公厅印发《地方党政领导干部食品安全责任制规定》</a>
                                    </div>
                                    <div className={mainStyles.dot_note}>
                                        <span>人民日报海外网</span>
                                        <span>2019-05-18</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={mainStyles.left}>
                                    <img src="" />
                                </div>
                                <div className={mainStyles.right}>
                                    <div className={mainStyles.message}>
                                        {/* <i className={mainStyles.dot}></i> */}
                                        <a href="#">中共中央 韩长赋：“五推进一加强”推动实施乡村振兴战略 </a>
                                    </div>
                                    <div className={mainStyles.img_note}>
                                        <span>新华社</span>
                                        <span>2019-05-20</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={mainStyles.left}></div>
                                <div className={mainStyles.right}>
                                    <div className={mainStyles.message}>
                                        <i className={mainStyles.dot}></i>
                                        <a href="#">中共中央办公厅 国务院办公厅转发《中央农办、农业农村部、国家发展改革委关于深入学习浙江“千村示范、万村整治”工程经验扎实推进农村人居环境整治工作的报告》</a>
                                    </div>
                                    <div className={mainStyles.dot_note}>
                                        <span>环球网</span>
                                        <span>2019-05-20</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
