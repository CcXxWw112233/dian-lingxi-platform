import React, { Component } from "react";
import dva, { connect } from "dva"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import SiderLeft from '@/routes/Technological/Sider/SiderLeft'
import VideoMeeting from '@/routes/Technological/Sider/comonent/videoMeetingPopoverContent/index'
import { Tooltip, Dropdown } from 'antd'
import Cookies from "js-cookie";
import SimpleNavigation from "./Components/SimpleNavigation/index"
import SimpleDrawer from './Components/SimpleDrawer/index'
import LingxiIm from 'lingxi-im'
class SimpleHeader extends Component {
    state = {
        leftNavigationVisible: false,
        simpleDrawerVisible: false,
        simpleDrawerContent: null,
        simpleDrawerTitle: ''
    }

    openOrCloseImChatModal = (val) => {
        const { dispatch, chatImVisiable } = this.props;
        const width = document.body.scrollWidth;
        let workbenchBoxContentWapperModalStyle = !chatImVisiable ? { width: (width - 400) + 'px' } : { width: '100%' }
        let flag = val !== undefined ? val : !chatImVisiable ;
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                chatImVisiable: flag,
                workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
            }
        });

    }

    handleVisibleChange = flag => {
        this.setState({ leftNavigationVisible: flag });
    };

    openOrCloseMainNav = (e) => {
        // e.stopPropagation();
        // dispatch({
        //     type: 'simplemode/updateDatas',
        //     payload: {
        //         leftMainNavVisible: !leftMainNavVisible
        //     }
        // });

        //window.open('/#/technological/workbench', '_blank');
        // console.log(checked, 'sssss')
        const { dispatch } = this.props
        dispatch({
            type: 'technological/setShowSimpleModel',
            payload: {
                is_simple_model: 0,
                checked: false
            }
        })

    }
    updateStates = (data) => {
        this.setState({
            ...data
        });
    }

    closeDrawer = () => {
        this.setState({
            simpleDrawerVisible: false,
            simpleDrawerTitle: ''
        });
    }
    ImToggle = (val) =>{
      if(!val){
        this.openOrCloseImChatModal(false);
      }
    }

    componentWillReceiveProps(props, nextProps){
      // if(nextProps.chatImVisiable){
        LingxiIm.show();
      // }
    }
    componentDidMount(){
      LingxiIm.show();
    }

    render() {
        const { chatImVisiable = false, leftMainNavVisible = false, leftMainNavIconVisible } = this.props;
        const { simpleDrawerVisible, simpleDrawerContent, leftNavigationVisible, simpleDrawerTitle } = this.state;
        return (
            <div className={indexStyles.headerWapper}>
                {
                    false && (
<Tooltip placement="bottom" title={'退出极简模式'}>
                        <div className={indexStyles.miniNavigation} onClick={this.openOrCloseMainNav}>
                            <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe69d;</i>
                        </div>
                    </Tooltip>
)
                }
                {
                    leftMainNavIconVisible && (
<Dropdown
                        placement="bottomLeft"
                        overlay={<SimpleNavigation updateStates={this.updateStates} dropdownHandleVisibleChange={this.handleVisibleChange}/>}
                        onVisibleChange={this.handleVisibleChange}
                        visible={leftNavigationVisible}
                    >
                        <div className={indexStyles.miniNavigation}>
                            <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe69f;</i>
                        </div>
                    </Dropdown>
)}

                <div className={indexStyles.miniImMessage} onClick={this.openOrCloseImChatModal}>
                    <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe8e8;</i>
                </div>

                {/* {leftMainNavVisible &&
                        <SiderLeft is_simplemode={true} collapsed={false} />
                    } */}

                <div className={indexStyles.chatWapper} style={{ display: `${chatImVisiable ? '' : 'none'}` }}>
                    {/* <div className={indexStyles.chatHeader}>
                        <div className={indexStyles.menu} onClick={this.openOrCloseImChatModal}>
                            <i className={`${globalStyles.authTheme}`} style={{ color: '#1890FF', fontSize: '24px' }}>&#xe7f4;</i>
                        </div>
                    </div>
                    <div className={indexStyles.imWapper}>
                        <iframe src='/im/index.html'></iframe>
                    </div>
                    <div className={indexStyles.videoMeetingWapper}>
                        <VideoMeeting />
                    </div> */}
                    <LingxiIm token={Cookies.get('Authorization')} width='400px' onToggle={this.ImToggle}/>

                    <div className={indexStyles.videoMeetingWapper}>
                        <VideoMeeting />
                    </div>
                </div>

                {simpleDrawerVisible &&
                    <SimpleDrawer updateState={this.updateStates} closeDrawer={this.closeDrawer} simpleDrawerContent={simpleDrawerContent} drawerTitle={simpleDrawerTitle} />
                }

            </div>
        );
    }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ simplemode: { chatImVisiable, leftMainNavVisible, leftMainNavIconVisible }, modal, technological, loading }) {
    return { chatImVisiable, leftMainNavVisible, leftMainNavIconVisible, modal, model: technological, loading }
}
export default connect(mapStateToProps)(SimpleHeader)
