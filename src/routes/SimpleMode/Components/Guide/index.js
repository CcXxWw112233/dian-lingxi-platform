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
        this.props.setHomeVisible({
            simpleHeaderVisiable: true,
            myWorkbenchBoxsVisiable: true,
            wallpaperSelectVisiable: true,
            workbenchBoxSelectVisiable: false,
            createProjectVisiable: false,
        });
    }

    componentDidMount() { }

    render() {

        const { guideModalVisiable } = this.props

        return (
            <div>
                {guideModalVisiable && (<div className={indexStyles.guideModal}>
                    <div className={indexStyles.guideModalLeft}>
                        <div className={indexStyles.guideModalLeftHender}>
                            灵犀项目协作引导场景
                        </div>
                        <div className={indexStyles.guideNavigationView}>
                            <Menu>
                                <Menu.Item>菜单项1</Menu.Item>
                                <Menu.Item>菜单项2</Menu.Item>
                                <Menu.Item>菜单项3</Menu.Item>
                                <Menu.Item>菜单项4</Menu.Item>
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
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Tab 1" key="1">
                                    Content of Tab Pane 1
                            </TabPane>
                                <TabPane tab="Tab 2 || Tab 2" key="2">
                                    Content of Tab Pane 2 || Content of Tab Pane 2
                            </TabPane>
                                <TabPane tab="Tab 3 || Tab 3 || Tab 3" key="3">
                                    Content of Tab Pane 3 || Content of Tab Pane 3 || Content of Tab Pane 3
                            </TabPane>
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
    simplemode: { guideModalVisiable, },

}) => ({ guideModalVisiable, }))(Guide)