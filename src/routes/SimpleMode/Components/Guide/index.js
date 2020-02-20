import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Menu, Tabs, Icon } from 'antd';
import React, { Component } from "react";
import dva, { connect } from "dva/index"
const { TabPane } = Tabs

class Guide extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    closeGuideModal = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                guideModalVisiable: false,
            }
        });
    }

    selectionCategoryList = (value) => {

        this.loadGuideArticle(value)
    }

    loadGuideArticle = (value) => {

        const { id } = value
        const { dispatch } = this.props
        dispatch({
            type: 'simplemode/getGuideArticle',
            payload: {
                id: id
            }
        });

        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                guideCategorySelectedKeys: value
            }
        });
    }

    render() {

        const { guideModalVisiable, guideCategoryList = [], guideArticleList = [], guideCategorySelectedKeys, } = this.props
        const { id } = guideCategorySelectedKeys

        return (
            <div>
                {guideModalVisiable && (<div className={indexStyles.guideModal}>
                    <div className={indexStyles.guideModalLeft}>
                        <div className={indexStyles.guideModalLeftHender}>
                            灵犀项目协作引导场景
                        </div>
                        <div className={indexStyles.guideNavigationView}>
                            <Menu
                                defaultSelectedKeys={id ? [id] : []}
                                mode="inline"
                            >
                                {guideCategoryList.map((value, key) => {
                                    const { text, id} = value
                                    return (
                                        <Menu.Item key={id} onClick={this.selectionCategoryList.bind(this, value)}>
                                            <div className={indexStyles.menu_item_style}>
                                                <div className={indexStyles.menu_item_text_style}>{text}</div>
                                            </div>
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        </div>
                    </div>
                    <div className={indexStyles.guideModalRight}>
                        <div className={indexStyles.guideModalRightHender}>
                            <div className={indexStyles.close} onClick={this.closeGuideModal}>
                                <Icon type="close" style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <div className={indexStyles.guidenTabsView}>
                            <Tabs defaultActiveKey={guideArticleList && guideArticleList[0] ? guideArticleList[0].id : ''}>
                                {guideArticleList.map(i => {
                                    const {id, title, content } = i
                                    return (
                                        <TabPane tab={title} key={id}>
                                            <div className={indexStyles.tab_content_style} dangerouslySetInnerHTML={{ __html: content }}></div>
                                        </TabPane>
                                    )
                                }
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
                )}
            </div>
        );
    }
}

export default connect(({
    simplemode: { guideCategoryList, guideModalVisiable, guideArticleList, guideCategorySelectedKeys, },

}) => ({ guideCategoryList, guideModalVisiable, guideArticleList, guideCategorySelectedKeys, }))(Guide)