import React from "react";
import {
  Layout,
  Mention,
} from "antd";
import indexStyles from "./index.less";
import glabalStyles from "../../../globalset/css/globalClassName.less";
import { connect } from "dva";
import classNames from "classnames/bind";
import { NODE_ENV, IM_HTTP_PATH } from '../../../globalset/js/constant';
import VideoMeeting from './../Sider/Components/VideoMeeting/index';

let cx = classNames.bind(indexStyles);
const { Sider } = Layout;
const { toContentState } = Mention;

@connect(({ technological, workbench }) => {
  return {
    projectList:
      technological.datas && technological.datas.currentOrgProjectList
        ? technological.datas.currentOrgProjectList
        : [],
    projectTabCurrentSelectedProject:
      workbench.datas && workbench.datas.projectTabCurrentSelectedProject
        ? workbench.datas.projectTabCurrentSelectedProject
        : "0",
    currentSelectedProjectMembersList:
      workbench.datas && workbench.datas.currentSelectedProjectMembersList
        ? workbench.datas.currentSelectedProjectMembersList
        : [],
    currentOrgAllMembers: technological.datas.currentOrgAllMembersList
  };
})
class SiderRight extends React.Component {
  state = {
    collapsed: true,
    saveToProject: null,
    meetingTitle: "",
    videoMeetingDefaultSuggesstions: [], //mention 原始数据
    selectedSuggestions: [], //自定义的mention选择列表
    suggestionValue: toContentState(""), //mention的值
    mentionSelectedMember: [], //已经选择的 item,
    selectedMemberTextAreaValue: "",
    videoMeetingPopoverVisible: false,

  };
  constructor(props) {
    super(props);
  }
  onCollapse(bool) {
    this.setState({
      collapsed: bool
    });
  }

  setCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const {
      collapsed
    } = this.state;

    const ImMaskWhencollapsed = cx({
      [indexStyles.ImMaskCollapsed]: collapsed,
      [indexStyles.ImMaskExpand]: !collapsed
    });

    return (
      <div id={"siderRight"} className={indexStyles.siderRight}>
        <Sider
          collapsible
          onCollapse={this.onCollapse.bind(this)}
          className={indexStyles.siderRight}
          defaultCollapsed={true}
          collapsed={collapsed}
          trigger={null}
          collapsedWidth={56}
          width={300}
          theme={"light"}
        >
          <div
            className={indexStyles.siderRightInner}
            style={{ width: collapsed ? 56 : 300 }}
          >
            <div
              className={indexStyles.handleBar}
              onClick={this.setCollapsed.bind(this)}
            >
              <p className={collapsed ? "" : indexStyles.rotate180} />
            </div>
            <div
              className={indexStyles.contain_1}
              onClick={this.setCollapsed.bind(this)}
            >
              <div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>
                &#xe795;
              </div>
              <div className={indexStyles.right}>通知</div>
            </div>
            <div
              style={{
                height: document.documentElement.clientHeight - 58,
                padding: "20px 12px",
                paddingBottom: "40px",
                position: "relative"
              }}
              onClick={this.setCollapsed.bind(this)}
            >
              <div
                style={{ height: document.documentElement.clientHeight - 108 }}
                className={ImMaskWhencollapsed}
              />
              {NODE_ENV == 'development' && (
                <iframe
                  title="im"
                  src={IM_HTTP_PATH}
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  id={"iframImCircle"} />
              )}

            </div>
            <div className={indexStyles.videoMeetingWapper}>
              <VideoMeeting />
            </div>
          </div>
        </Sider>
      </div>
    );
  }
}

export default SiderRight;
