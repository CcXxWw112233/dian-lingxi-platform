import React from "react";
import {
  Layout,
  Popover,
  Select,
  Input,
  Mention,
  Button,
  message,
  Modal
} from "antd";
import indexStyles from "./index.less";
import glabalStyles from "../../../globalset/css/globalClassName.less";
import { connect } from "dva";
import Cookies from "js-cookie";
import { validateTel } from "./../../../utils/verify";
import classNames from "classnames/bind";
import { NODE_ENV, IM_HTTP_PATH } from '../../../globalset/js/constant'
// import GroupChat from './comonent/GroupChat'
// import InitialChat from './comonent/InitialChat'
import VideoMeetingPopoverContent from './comonent/videoMeetingPopoverContent/index'
import LingxiIm, { Im } from 'lingxi-im'

let cx = classNames.bind(indexStyles);

const { Sider } = Layout;
const Option = Select.Option;
const { TextArea } = Input;
const { getMentions, toString, toContentState } = Mention;
const Nav = Mention.Nav;

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
    videoMeetingPopoverVisible: false
  };

  componentDidMount() {
    this.imInitOption()
  }

  imInitOption = () => {
    LingxiIm.hide();
    const { protocol, host } = window.location
    Im.option({ baseUrl: `${protocol}//${host}/`, APPKEY: "c3abea191b7838ff65f9a6a44ff5e45f" })
    if (Im) {
      Im.addEventListener('visible', (visible) => {
        this.handleImToggle(visible);
      });
      Im.addEventListener('clickDynamic', (data) => {
        this.imClickDynamic(data);
      });
    }
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
    this.props.dispatch({
      type: 'technological/updateDatas',
      payload: {
        siderRightCollapsed: this.state.collapsed
      }
    })
  }

  handleVideoMeetingSaveSelectChange = value => {
    this.setState({
      saveToProject: value
    });
  };

  handleVideoMeetingTopicChange = e => {
    this.setState({
      meetingTitle: e.target.value
    });
  };

  handleVideoMeetingMemberChange = value => {
    const { videoMeetingDefaultSuggesstions } = this.state;
    const searchValue = value.toLowerCase();
    const filtered = videoMeetingDefaultSuggesstions.filter(item =>
      item.toLowerCase().includes(searchValue)
    );
    const suggestions = filtered.map(suggestion => (
      <Nav value={suggestion} data={suggestion}>
        <span>{suggestion}</span>
      </Nav>
    ));
    this.setState({
      selectedSuggestions: suggestions
    });
  };
  handleTransMentionSelectedMember = () => {
    const { currentOrgAllMembers } = this.props;
    const { mentionSelectedMember } = this.state;
    //有可能存在 full_name(mobile) 和 full_name(email) 的情况
    return mentionSelectedMember.reduce((acc, curr) => {
      const isFindFullNameINCurr = full_name =>
        currentOrgAllMembers.find(item => item.full_name === full_name);
      const isFullNameWithMobleOrEmail = () =>
        curr.endsWith(")") && isFindFullNameINCurr(curr.split("(")[0]);
      if (isFullNameWithMobleOrEmail()) {
        const full_name = curr.split("(")[0];
        const getUserByFull_name = currentOrgAllMembers.find(
          item => item.full_name === full_name
        );
        const isUserHasMoblie = getUserByFull_name.mobile;
        const isUserHasEmail = getUserByFull_name.email;
        if (isUserHasMoblie || isUserHasEmail) {
          const mobileOrEmail = isUserHasMoblie
            ? isUserHasMoblie
            : isUserHasMoblie;
          return acc ? acc + "," + mobileOrEmail : mobileOrEmail;
        }
        return acc;
      } else {
        const getUserByFull_name = currentOrgAllMembers.find(
          item => item.full_name === curr
        );
        const isUserHasMoblie = getUserByFull_name.mobile;
        const isUserHasEmail = getUserByFull_name.email;
        const mobileOrEmail = isUserHasMoblie
          ? isUserHasMoblie
          : isUserHasEmail;
        return acc ? acc + "," + mobileOrEmail : mobileOrEmail;
      }
    }, "");
  };
  handleTransMentionSelectedOtherMembersMobileString = () => {
    const { selectedMemberTextAreaValue } = this.state;

    //去除空格
    const trimSpace = str => {
      return str.replace(/\s+/g, "");
    };
    //去除换行

    const trimLineBack = str => {
      return str.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "");
    };

    const trimSpaceAndLineBackArr = trimLineBack(
      trimSpace(selectedMemberTextAreaValue)
    )
      .replace(/；/g, ";")
      .split(";")
      .map(item => item.trim())
      .filter(item => item);
    const isEachMobileValid = arr => arr.every(item => validateTel(item));
    if (!isEachMobileValid(trimSpaceAndLineBackArr)) {
      return "error";
    } else {
      return trimSpaceAndLineBackArr.reduce((acc, curr) => {
        return acc ? acc + "," + curr : curr;
      }, "");
    }
  };
  openWinNiNewTabWithATag = url => {
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    document.querySelector("body").appendChild(aTag);
    aTag.click();
    aTag.parentNode.removeChild(aTag);
  };
  handleVideoMeetingSubmit = () => {
    const { dispatch } = this.props;
    const { meetingTitle, saveToProject } = this.state;
    const mentionSelectedMembersMobileOrEmailString = this.handleTransMentionSelectedMember();
    const mentionSelectedOtherMembersMobileString = this.handleTransMentionSelectedOtherMembersMobileString();
    if (mentionSelectedOtherMembersMobileString === "error") {
      message.error("组织外成员手机号格式有误，请检查");
      return;
    }
    const mergedMeetingMemberStr = [
      mentionSelectedMembersMobileOrEmailString,
      mentionSelectedOtherMembersMobileString
    ].reduce((acc, curr) => {
      return acc ? (curr ? acc + "," + curr : acc) : curr;
    }, "");
    if (!mergedMeetingMemberStr || !meetingTitle) {
      message.error("必须有【会议主题】和【参会人员】");
      return;
    }

    const data = {
      board_id: saveToProject,
      flag: 2,
      rela_id: saveToProject,
      topic: meetingTitle,
      user_for: mergedMeetingMemberStr
    };

    Promise.resolve(
      dispatch({
        type: "technological/initiateVideoMeeting",
        payload: data
      })
    ).then(res => {
      if (res.code === "0") {
        const { start_url } = res.data;
        message.success("发起会议成功");
        this.openWinNiNewTabWithATag(start_url);
        this.setState(
          {
            videoMeetingPopoverVisible: false
          },
          () => {
            this.initVideoMeetingPopover();
          }
        );
      } else if (res.code === "1") {
        message.error(res.message);
        this.setState(
          {
            videoMeetingPopoverVisible: false
          },
          () => {
            this.initVideoMeetingPopover();
          }
        );
      } else {
        message.error("发起会议失败");
      }
    });
  };
  handleVideoMeetingPopoverVisibleChange = flag => {
    this.setState(
      {
        videoMeetingPopoverVisible: flag
      },
      () => {
        if (flag === false) {
          this.initVideoMeetingPopover();
        }
      }
    );
  };
  initVideoMeetingPopover = () => {
    this.setState({
      // saveToProject: null,
      meetingTitle: "",
      // videoMeetingDefaultSuggesstions: [], //mention 原始数据
      // selectedSuggestions: [], //自定义的mention选择列表
      suggestionValue: toContentState(""), //mention的值
      mentionSelectedMember: [], //已经选择的 item,
      selectedMemberTextAreaValue: ""
    });
  };
  getInfoFromLocalStorage = item => {
    try {
      const userInfo = localStorage.getItem(item)
      return JSON.parse(userInfo)
    } catch (e) {
      message.error('从 Cookie 中获取用户信息失败, 当发起视频会议的时候')
    }
  }
  getCurrentUserNameThenSetMeetingTitle = () => {
    const currentUser = this.getInfoFromLocalStorage("userInfo");
    if (currentUser) {
      const meetingTitle = `${currentUser.name}发起的会议`;
      this.setState({
        meetingTitle
      });
    }
  };
  handleAssemVideoMeetingDefaultSuggesstions = (orgList = []) => {
    return orgList.reduce((acc, curr) => {
      const isHasRepeatedNameItem =
        orgList.filter(item => item.full_name === curr.full_name).length >= 2;
      //如果列表中有重复的名称职员存在，那么附加手机号或者邮箱
      //形式： full_name(mobile|email)
      if (isHasRepeatedNameItem) {
        const item = `${curr.full_name}(${
          curr.mobile ? curr.mobile : curr.email
          })`;
        return [...acc, item];
      }
      return [...acc, curr.full_name];
    }, []);
  };
  getVideoMeetingDefaultSuggesstions = key => {
    const { dispatch, projectTabCurrentSelectedProject } = this.props;
    const hasMemberInPropKey = () =>
      !!this.props[key] && this.props[key].length;
    Promise.resolve(hasMemberInPropKey())
      .then(flag => {
        if (!flag) {
          if (key === "currentSelectedProjectMembersList") {
            return dispatch({
              type: "workbench/fetchCurrentSelectedProjectMembersList",
              payload: { projectId: projectTabCurrentSelectedProject }
            });
          }
          return dispatch({
            type: "workbench/fetchCurrentOrgAllMembers",
            payload: {}
          });
        }
      })
      .then(() => {
        if (key === "currentSelectedProjectMembersList") {
          const { currentSelectedProjectMembersList } = this.props;
          if (
            currentSelectedProjectMembersList &&
            currentSelectedProjectMembersList.length
          ) {
            const videoMeetingDefaultSuggesstions = this.handleAssemVideoMeetingDefaultSuggesstions(
              currentSelectedProjectMembersList
            );
            this.setState({
              saveToProject:
                projectTabCurrentSelectedProject === "0"
                  ? null
                  : projectTabCurrentSelectedProject,
              videoMeetingDefaultSuggesstions
            });
          } else {
            this.setState({
              saveToProject:
                projectTabCurrentSelectedProject === "0"
                  ? null
                  : projectTabCurrentSelectedProject,
              videoMeetingDefaultSuggesstions: []
            });
          }
        } else {
          const { currentOrgAllMembers } = this.props;
          if (currentOrgAllMembers && currentOrgAllMembers.length) {
            const videoMeetingDefaultSuggesstions = this.handleAssemVideoMeetingDefaultSuggesstions(
              currentOrgAllMembers
            );
            this.setState({
              saveToProject:
                projectTabCurrentSelectedProject === "0"
                  ? null
                  : projectTabCurrentSelectedProject,
              videoMeetingDefaultSuggesstions
            });
          } else {
            this.setState({
              saveToProject:
                projectTabCurrentSelectedProject === "0"
                  ? null
                  : projectTabCurrentSelectedProject,
              videoMeetingDefaultSuggesstions: []
            });
          }
        }
      });
  };
  getCurrentSelectedProjectAndShouldMentionMember = () => {
    // const { projectTabCurrentSelectedProject } = this.props;
    this.getVideoMeetingDefaultSuggesstions("currentOrgAllMembers");
    // const hasSelectedProject = () => projectTabCurrentSelectedProject !== "0";

    //如果已经选择过具体的项目
    // if (hasSelectedProject()) {
    //   this.getVideoMeetingDefaultSuggesstions(
    //     "currentSelectedProjectMembersList"
    //   );
    // } else {
    //   this.getVideoMeetingDefaultSuggesstions("currentOrgAllMembers");
    // }
  };
  handleShowVideoMeeting = () => {
    this.getCurrentUserNameThenSetMeetingTitle();
    this.getCurrentSelectedProjectAndShouldMentionMember();
  };
  handleVideoMeetingMemberSelect = (suggestion, data) => {
    const { mentionSelectedMember } = this.state;
    const isSuggestionInMentionSelectedMemeber = () =>
      mentionSelectedMember.find(item => item === suggestion);
    if (!isSuggestionInMentionSelectedMemeber()) {
      this.setState(
        state => {
          return {
            mentionSelectedMember: [...state.mentionSelectedMember, suggestion]
          };
        },
        () => {
          // console.log(
          //   this.state.mentionSelectedMember,
          //   "mmmmmmmmmmmmmmmmmmmmmmm"
          // );
        }
      );
    }
  };
  filterHasDeletedMentionSelectedMember = oriStr => {
    const { mentionSelectedMember } = this.state;
    const shouldExistMentionSelectedMember = mentionSelectedMember.filter(
      item => oriStr.includes("@" + item)
    );
    if (
      shouldExistMentionSelectedMember.length !== mentionSelectedMember.length
    ) {
      this.setState({
        mentionSelectedMember: shouldExistMentionSelectedMember
      });
    }
  };
  getProjectPermission = (permissionType, board_id) => {
    const userBoardPermissions = this.getInfoFromLocalStorage('userBoardPermissions')
    if (!userBoardPermissions || !userBoardPermissions.length) {
      return false
    }
    const isFindedBoard = userBoardPermissions.find(board => board.board_id === board_id)
    if (!isFindedBoard) return false
    const { permissions = [] } = isFindedBoard
    return !!permissions.find(permission => permission.code === permissionType && permission.type === '1')
  }
  filterProjectWhichCurrentUserHasEditPermission = (projectList = []) => {
    return projectList.filter(({ board_id }) => this.getProjectPermission('project:team:board:edit', board_id))
  }
  handleVideoMeetingValueChange = value => {
    this.filterHasDeletedMentionSelectedMember(toString(value));
    this.setState({
      suggestionValue: value
    });
  };
  handleValidVideoMeetingMembers = value => {
    return value;
  };
  selectedMemberTextAreaValueChange = e => {
    this.setState({
      selectedMemberTextAreaValue: e.target.value
    });
  };
  handleToggleVideoMeetingPopover = e => {
    //需要重置项目标题
    if (e) e.stopPropagation();
    this.setState(state => {
      const { videoMeetingPopoverVisible } = state;
      return {
        videoMeetingPopoverVisible: !videoMeetingPopoverVisible
      };
    });
  };

  handleImToggle = (toggle) => {
    this.props.dispatch({
      type: 'technological/updateDatas',
      payload: {
        siderRightCollapsed: toggle
      }
    })
  }
  // 圈子点击
  imClickDynamic = (data = {}) => {
    const { dispatch } = this.props
    const { orgId, boardId, type, relaDataId, cardId } = data
    let else_params = ''
    switch (type) {
      case 'board':
        break
      case 'folder':
        break;
      case 'file':
        else_params = `&appsSelectKey=4&file_id=${relaDataId}`
        break
      case 'card':
        else_params = `&appsSelectKey=3&card_id=${cardId}`
        break;
      case 'flow':
        else_params = `&appsSelectKey=2&flow_id=${relaDataId}`
        break
      default:
        break
    }
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        isInOpenFile: false
      }
    })
    dispatch({
      type: 'technological/routingReplace',
      payload: {
        route: `/technological/projectDetail?board_id=${boardId}${else_params}`
      }
    })
  }
  render() {
    const {
      collapsed,
      saveToProject,
      meetingTitle,
      selectedSuggestions,
      suggestionValue,
      selectedMemberTextAreaValue,
      videoMeetingPopoverVisible
    } = this.state;
    let { projectList } = this.props;
    //过滤出来当前用户有编辑权限的项目
    projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)

    const ImMaskWhencollapsed = cx({
      [indexStyles.ImMaskCollapsed]: collapsed,
      [indexStyles.ImMaskExpand]: !collapsed
    });

    const videoMeetingPopoverContent = (
      <div>
        {videoMeetingPopoverVisible && (
          <div className={indexStyles.videoMeeting__wrapper}>
            <div className={indexStyles.videoMeeting__topic}>
              <p className={indexStyles.videoMeeting__topic_title}>会议主题:</p>
              <div className={indexStyles.videoMeeting__topic_content}>
                <span className={indexStyles.videoMeeting__topic_content_save}>
                  <Select
                    defaultValue={saveToProject}
                    onChange={this.handleVideoMeetingSaveSelectChange}
                    style={{ width: "140px" }}
                  >
                    <Option value={null}>不存入项目</Option>
                    {projectList.length !== 0 &&
                      projectList.map(project => (
                        <Option value={project.board_id} key={project.board_id}>
                          {project.board_name}
                        </Option>
                      ))}
                  </Select>
                </span>
                <span className={indexStyles.videoMeeting__topic_content_title}>
                  <Input
                    value={meetingTitle}
                    onChange={this.handleVideoMeetingTopicChange}
                  />
                </span>
              </div>
            </div>
            <div className={indexStyles.videoMeeting__memberNote}>
              <p className={indexStyles.videoMeeting__memberNote_title}>
                通知参会人：
              </p>
              <div className={indexStyles.videoMeeting__memberNote_content}>
                <div
                  className={
                    indexStyles.videoMeeting__memberNote_content_mention
                  }
                >
                  <Mention
                    style={{ width: "100%", height: "56px" }}
                    placeholder="使用@符号查找加入同一组织内的成员"
                    suggestions={selectedSuggestions}
                    multiLines
                    onSearchChange={this.handleVideoMeetingMemberChange}
                    placement="top"
                    onSelect={this.handleVideoMeetingMemberSelect}
                    value={suggestionValue}
                    onChange={this.handleVideoMeetingValueChange}
                  />
                </div>
                <div
                  className={
                    indexStyles.videoMeeting__memberNote_content_textarea
                  }
                >
                  <TextArea
                    placeholder="直接列举外部参会人的手机号，多号码请用“;”区分"
                    autosize={{ minRows: 2, maxRows: 4 }}
                    value={selectedMemberTextAreaValue}
                    onChange={this.selectedMemberTextAreaValueChange}
                  />
                </div>
              </div>
            </div>
            <p className={indexStyles.videoMeeting__prompt}>
              点击发起会议后即自动发送通知
            </p>
            <div className={indexStyles.videoMeeting__submitBtn}>
              <Button type="primary" onClick={this.handleVideoMeetingSubmit}>
                发起会议
              </Button>
            </div>
          </div>
        )}
      </div>
    );
    return (
      <div style={{ flex: "none", paddingBottom: '50px', position: 'relative', backgroundColor: '#fff', zIndex: '1010' }}>
        <LingxiIm token={Cookies.get('Authorization')} width='400px' />
        <div className={indexStyles.videoMeetingWapper} style={{ position: 'absolute', bottom: '10px' }}>
          <VideoMeetingPopoverContent />
        </div>
      </div>

      // <div id={"siderRight"} className={indexStyles.siderRight}>
      //   <Sider
      //     collapsible
      //     onCollapse={this.onCollapse.bind(this)}
      //     className={indexStyles.siderRight}
      //     defaultCollapsed={true}
      //     collapsed={collapsed}
      //     trigger={null}
      //     collapsedWidth={56}
      //     width={300}
      //     theme={"light"}
      //   >
      //     <div
      //       className={indexStyles.siderRightInner}
      //       style={{ width: collapsed ? 56 : 300 }}>
      //       <div
      //         className={indexStyles.handleBar}
      //         onClick={this.setCollapsed.bind(this)}
      //       >
      //         <p className={collapsed ? "" : indexStyles.rotate180} />
      //       </div>
      //       <div
      //         className={indexStyles.contain_1}
      //         onClick={this.setCollapsed.bind(this)}
      //       >
      //         <div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>
      //           &#xe795;
      //         </div>
      //         <div className={indexStyles.right}>通知</div>
      //       </div>
      //       <div
      //         style={{
      //           height: document.documentElement.clientHeight - 58,
      //           padding: "20px 12px",
      //           paddingBottom: "40px",
      //           position: "relative"
      //         }}
      //         onClick={this.setCollapsed.bind(this)}
      //       >
      //         <div
      //           style={{ height: document.documentElement.clientHeight - 108 }}
      //           className={ImMaskWhencollapsed}
      //         />
      //         {NODE_ENV != 'development' && (
      //           <iframe
      //           title="im"
      //           src={IM_HTTP_PATH}
      //           frameBorder="0"
      //           width="100%"
      //           height="100%"
      //           id={"iframImCircle"}/>

      //         ) }

      //       </div>
      //       <div className={indexStyles.videoMeetingWapper}>
      //         <VideoMeetingPopoverContent />
      //       </div>
      //       {/* <Popover
      //         visible={videoMeetingPopoverVisible}
      //         placement="leftBottom"
      //         content={videoMeetingPopoverContent}
      //         onVisibleChange={this.handleVideoMeetingPopoverVisibleChange}
      //         trigger="click"
      //       >
      //         <div
      //           className={indexStyles.videoMeeting__icon}
      //           onMouseEnter={this.handleShowVideoMeeting}
      //           onClick={this.handleToggleVideoMeetingPopover}
      //         />
      //       </Popover> */}
      //       {/*<div className={indexStyles.contain_2} style={{display:collapsed?'none':'flex'}}>*/}
      //       {/*<div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>*/}
      //       {/*&#xe710;*/}
      //       {/*</div>*/}
      //       {/*<div className={indexStyles.right}>*/}
      //       {/*<input className={indexStyles.input} placeholder={'查找团队成员或项目'} />*/}
      //       {/*</div>*/}
      //       {/*</div>*/}
      //       {/*<div className={`${indexStyles.contain_3}`} style={{display: collapsed?'block': 'none'}}>*/}
      //       {/*{data.map((value, key) => {*/}
      //       {/*return (*/}
      //       {/*<div key={key}>*/}
      //       {/*<InitialChat itemValue={value} />*/}
      //       {/*</div>*/}
      //       {/*)*/}
      //       {/*})}*/}
      //       {/*</div>*/}
      //       {/*<div className={`${indexStyles.contain_3}`} style={{display: !collapsed?'block': 'none'}}>*/}
      //       {/*{data.map((value, key) => {*/}
      //       {/*return (*/}
      //       {/*<div key={key}>*/}
      //       {/*<GroupChat collapsed={collapsed} itemValue={value} />*/}
      //       {/*</div>*/}
      //       {/*)*/}
      //       {/*})}*/}
      //       {/*</div>*/}
      //     </div>
      //   </Sider>
      // </div>
    );
  }
}

export default SiderRight;
