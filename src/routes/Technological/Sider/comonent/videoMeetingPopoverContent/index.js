import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from "@/globalset/css/globalClassName.less";
import {
    Popover,
    Select,
    Input,
    Mention,
    Button,
    message,
    DatePicker, Dropdown, Menu, Icon
} from 'antd'
import { connect } from 'dva'
import { validateTel } from "@/utils/verify";
import { getCurrentSelectedProjectMembersList } from '@/services/technological/workbench'
import { timestampToTime, compareTwoTimestamp, timeToTimestamp, timestampToTimeNormal, isSamDay } from '@/utils/util'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import zoom_logo from '@/assets/sider_right/zoom_logo.png'
import xiaoyuyilian_logo from '@/assets/sider_right/xiaoyuyilian_logo.png'
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
        // currentSelectedProjectMembersList:
        //     workbench.datas && workbench.datas.currentSelectedProjectMembersList
        //         ? workbench.datas.currentSelectedProjectMembersList
        //         : [],
        // currentOrgAllMembers: technological.datas.currentOrgAllMembersList
    };
})
class VideoMeetingPopoverContent extends React.Component {
    state = {
        saveToProject: null, // 用来保存存入的项目
        meetingTitle: "", // 会议名称
        videoMeetingDefaultSuggesstions: [], //mention 原始数据
        selectedSuggestions: [], //自定义的mention选择列表
        suggestionValue: toContentState(""), //mention的值
        mentionSelectedMember: [], //已经选择的 item,
        selectedMemberTextAreaValue: "",
        videoMeetingPopoverVisible: false,
        currentSelectedProjectMembersList: [], //当前选择项目的项目成员
        currentOrgAllMembers: [], //当前组织的职员
        org_id: '0'
    }

    // 获取项目用户
    getProjectUsers = ({ projectId }) => {
        if (!projectId) return
        this.setVideoMeetingDefaultSuggesstionsByBoardUser({ board_users: [] })
        getCurrentSelectedProjectMembersList({ projectId }).then(res => {
            if (res.code == '0') {
                const board_users = res.data
                this.setState({
                    currentSelectedProjectMembersList: board_users,
                    currentOrgAllMembers: board_users
                }, () => {
                    this.setVideoMeetingDefaultSuggesstionsByBoardUser({ board_users })
                })
            } else {
                message.error(res.message)
            }
        })
    }

    // 设置mention组件提及列表
    setVideoMeetingDefaultSuggesstionsByBoardUser = ({ board_users = [] }) => {
        const videoMeetingDefaultSuggesstions = this.handleAssemVideoMeetingDefaultSuggesstions(board_users);
        this.setState({
            selectedSuggestions: videoMeetingDefaultSuggesstions,
            videoMeetingDefaultSuggesstions,
            suggestionValue: toContentState(""), //mention的值
        }, () => {
            // console.log({
            //     videoMeetingDefaultSuggesstions,
            //     suggestionValue: this.state.suggestionValue
            // })
        })
    }

    // 选择项目的下拉回调
    handleVideoMeetingSaveSelectChange = value => {
        const { projectList = [] } = this.props
        // console.log('ssssssss__',{ value,  projectList})
        this.getProjectUsers({ projectId: value })
        this.setState({
            saveToProject: value,
            org_id: !value ? '0' : projectList.find(item => item.board_id == value).org_id || '0'
        });
    };

    // 修改创建会话的名称回调
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
        const { currentOrgAllMembers } = this.state;
        const { mentionSelectedMember } = this.state;
        //有可能存在 name(mobile) 和 name(email) 的情况
        return mentionSelectedMember.reduce((acc, curr) => {
            const isFindFullNameINCurr = name =>
                currentOrgAllMembers.find(item => item.name === name);
            const isFullNameWithMobleOrEmail = () =>
                curr.endsWith(")") && isFindFullNameINCurr(curr.split("(")[0]);
            if (isFullNameWithMobleOrEmail()) {
                const name = curr.split("(")[0];
                const getUserByFull_name = currentOrgAllMembers.find(
                    item => item.name === name
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
                    item => item.name === curr
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
        const { meetingTitle, saveToProject, org_id } = this.state;
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
            _organization_id: org_id,
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
    // 初始化数据
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

    // 获取当前用户的会议名称
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
                orgList.filter(item => item.name === curr.name).length >= 2;
            //如果列表中有重复的名称成员存在，那么附加手机号或者邮箱
            //形式： name(mobile|email)
            if (isHasRepeatedNameItem) {
                const item = `${curr.name}(${
                    curr.mobile ? curr.mobile : curr.email
                    })`;
                return [...acc, item];
            }
            return [...acc, curr.name];
        }, []);
    };
    getVideoMeetingDefaultSuggesstions = key => {
        const { dispatch, projectTabCurrentSelectedProject } = this.props;
        const hasMemberInPropKey = () =>
            !!this.props[key] && this.props[key].length;
        Promise.resolve(hasMemberInPropKey())
            .then(flag => {
            })
            .then(() => {
                if (key === "currentSelectedProjectMembersList") {
                    const { currentSelectedProjectMembersList } = this.state;
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
                    const { currentOrgAllMembers } = this.state;
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
        this.getVideoMeetingDefaultSuggesstions("currentOrgAllMembers");
    };

    // 监听回车事件
    handleShowVideoMeeting = () => {
        this.getCurrentUserNameThenSetMeetingTitle();
        this.getCurrentSelectedProjectAndShouldMentionMember();
    };
    // filterHasDeletedMentionSelectedMember = oriStr => {
    //     const { mentionSelectedMember } = this.state;
    //     const shouldExistMentionSelectedMember = mentionSelectedMember.filter(
    //         item => oriStr.includes("@" + item)
    //     );
    //     if (
    //         shouldExistMentionSelectedMember.length !== mentionSelectedMember.length
    //     ) {
    //         this.setState({
    //             mentionSelectedMember: shouldExistMentionSelectedMember
    //         });
    //     }
    // };

    // 获取项目权限
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
    // 查询当前用户是否有权限
    filterProjectWhichCurrentUserHasEditPermission = (projectList = []) => {
        return projectList.filter(({ board_id }) => this.getProjectPermission('project:team:board:edit', board_id))
    }
    // handleVideoMeetingValueChange = value => {
    //     this.filterHasDeletedMentionSelectedMember(toString(value));
    //     this.setState({
    //         suggestionValue: value
    //     });
    // };
    // handleValidVideoMeetingMembers = value => {
    //     return value;
    // };
    // selectedMemberTextAreaValueChange = e => {
    //     this.setState({
    //         selectedMemberTextAreaValue: e.target.value
    //     });
    // };

    // popover显示隐藏
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

    renderSelectedTime = () => {
        return (
            <div>
                <Menu>
                    <Menu.Item>30分钟</Menu.Item>
                </Menu>
            </div>
        )
    }
    // 获取当前推迟时间
    getCurrentDelayTimestampToTime = (timestamp, flag) => {
        if (!timestamp) {
            return false
        }
        const timestampNew = timestamp.length === 10 ? Number(timestamp) * 1000 : Number(timestamp)
        let date = new Date(timestampNew);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const now_year = new Date().getFullYear()
        // let Y = now_year == date.getFullYear() ? '' : date.getFullYear() + '年';
        let Y = date.getFullYear() + '年';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
        let D = date.getDate() < 10 ? '0' + date.getDate() + '日 ' : date.getDate() + '日 ';
        let h = (date.getMinutes() >= 0 && date.getMinutes() < 30) ? date.getHours() + ':' : date.getHours() + 1 + ':';
        let m = date.getMinutes() >= 0 && date.getMinutes() < 30 ? '30' : '00'
        return flag ? Y + M + D + h + m : Y + M + D;
    }

    getCurrentTimeStamp = () => {
        const nowDate = new Date()
        return this.getCurrentDelayTimestampToTime(timeToTimestamp(nowDate), true)
    }

    renderPopover = () => {
        const {
            saveToProject,
            meetingTitle,
            selectedSuggestions,
            suggestionValue,
            selectedMemberTextAreaValue,
            videoMeetingPopoverVisible,
        } = this.state;
        let { projectList, start_time, data, board_id } = this.props;

        const currentDelayTime = this.getCurrentTimeStamp()

        //过滤出来当前用户有编辑权限的项目
        projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)

        const videoMeetingPopoverContent_ = (
            <div>
                {videoMeetingPopoverVisible && (
                    <div className={indexStyles.videoMeeting__wrapper}>
                        <div className={indexStyles.videoMeeting__topic}>
                            <div className={indexStyles.videoMeeting__topic_content}>
                                <span className={indexStyles.videoMeeting__topic_content_save}>
                                    <Select
                                        defaultValue={saveToProject}
                                        onChange={this.handleVideoMeetingSaveSelectChange}
                                        style={{ width: "100%" }}
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
                                <span key={currentDelayTime} className={indexStyles.videoMeeting__topic_content_time}>
                                    <span className={indexStyles.videoMeeting__topic_content_datePicker} style={{ position: 'relative', zIndex: 0, minWidth: '200px', lineHeight: '38px', display: 'inline-block', textAlign: 'center' }}>
                                        <span>
                                            <Input
                                                value={currentDelayTime}
                                            />
                                        </span>
                                        <DatePicker
                                            // onChange={this.startDatePickerChange.bind(this)}
                                            // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={currentDelayTime}
                                            format="YYYY/MM/DD HH:mm"
                                            showTime={{ format: 'HH:mm' }}
                                            style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                                        <span className={indexStyles.videoMeeting__topic_content_rightnow}>现在</span>
                                    </span>
                                    <span>
                                        <Select style={{ width: '136px' }} defaultValue={['1']}>
                                            <Option value="1">持续1小时</Option>
                                        </Select>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className={indexStyles.videoMeeting__remind}>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ color: 'rgba(0,0,0,0.45)' }}>提醒谁参与?</span>
                                <span>
                                    <Dropdown overlay={this.renderSelectedTime()}>
                                        <span className={`${globalStyles.authTheme}`}>开始前5分钟提醒 &#xe7ee;</span>
                                    </Dropdown>
                                </span>
                            </div>
                            <div>
                                <div style={{ flex: '1', position: 'relative' }}>
                                    <Dropdown overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                                        overlayStyle={{ maxWidth: '200px' }}
                                        overlay={
                                            <MenuSearchPartner
                                                isInvitation={true}
                                                listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={[]}
                                                board_id={board_id}
                                                chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                                        }
                                    >
                                        {/* 添加通知人按钮 */}

                                        <div className={indexStyles.addNoticePerson}>
                                            <Icon type="plus-circle" style={{ fontSize: '40px', color: '#40A9FF' }} />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <div className={indexStyles.videoMeeting__submitBtn}>
                            <Button type="primary" onClick={this.handleVideoMeetingSubmit}>
                                发起预约
												</Button>
                        </div>
                        <div className={indexStyles.videoMeeting__remarks}>
                            <span>灵犀推荐使用以下方式开展远程会议: (点击前往下载）</span>
                            <span>
                                <img src={zoom_logo} alt="" />
                                <img src={xiaoyuyilian_logo} alt="" />
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
        return videoMeetingPopoverContent_
    }

    renderPopoverHeader = () => {
        const {
            saveToProject,
            meetingTitle,
            selectedSuggestions,
            suggestionValue,
            selectedMemberTextAreaValue,
            videoMeetingPopoverVisible,
        } = this.state;
        let { projectList } = this.props;

        //过滤出来当前用户有编辑权限的项目
        projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)

        const videoMeetingPopoverContent_ = (
            <div>
                {videoMeetingPopoverVisible && (
                    <div className={indexStyles.videoMeeting__header}>
                        <div className={`${globalStyles.authTheme} ${indexStyles.videoMeeting__mark}`}>&#xe6de;</div>
                        <div className={indexStyles.videoMeeting__title}>预约在线会议</div>
                    </div>
                )}
            </div>
        );
        return videoMeetingPopoverContent_
    }

    render() {
        const { videoMeetingPopoverVisible } = this.state
        return (
            <Popover
                visible={videoMeetingPopoverVisible}
                placement="leftBottom"
                title={this.renderPopoverHeader()}
                content={
                    this.renderPopover()
                }
                onVisibleChange={this.handleVideoMeetingPopoverVisibleChange}
                trigger="click"
                getPopupContainer={triggerNode => triggerNode.parentNode}
            >
                <div
                    className={indexStyles.videoMeeting__icon}
                    onMouseEnter={this.handleShowVideoMeeting}
                    onClick={this.handleToggleVideoMeetingPopover}
                />
            </Popover>
        )
    }
}

export default VideoMeetingPopoverContent