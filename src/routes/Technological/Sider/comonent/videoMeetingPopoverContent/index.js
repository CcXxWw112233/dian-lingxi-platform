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
import { currentNounPlanFilterName } from "@/utils/businessFunction";
import { PROJECTS } from '@/globalset/js/constant'
const Option = Select.Option;
const { TextArea } = Input;
const { getMentions, toString, toContentState } = Mention;
const Nav = Mention.Nav;
let currentDelayDueTime

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
    };
})
class VideoMeetingPopoverContent extends React.Component {
    state = {
        saveToProject: null, // 用来保存存入的项目
        saveProjectName: null,// 用来保存项目名称
        meetingTitle: "", // 会议名称
        videoMeetingDefaultSuggesstions: [], //mention 原始数据
        selectedSuggestions: [], //自定义的mention选择列表
        suggestionValue: toContentState(""), //mention的值
        videoMeetingPopoverVisible: false,// 视频会议的显示隐藏
        currentSelectedProjectMembersList: [], //当前选择项目的项目成员
        currentOrgAllMembers: [], //当前组织的职员
        org_id: '0',
        dueTimeList: [
          { remind_time_type: 'm', txtVal: '30' },
          { remind_time_type: 'h', txtVal: '1' },
          { remind_time_type: 'm', txtVal: '90' },
          { remind_time_type: 'h', txtVal: '2' },
          { remind_time_type: 'h', txtVal: '3' },
          { remind_time_type: 'h', txtVal: '4' },
          { remind_time_type: 'h', txtVal: '5' },
          { remind_time_type: 'h', txtVal: '6' },
				], // 持续结束时间
				remindTimeList: [
					{ remind_time_value: '5' },
					{ remind_time_value: '15' },
					{ remind_time_value: '30' },
					{ remind_time_value: '45' },
				],// 设置的提醒时间
    }

    // 获取项目用户
    getProjectUsers = ({ projectId }) => {
        if (!projectId) return
        this.setVideoMeetingDefaultSuggesstionsByBoardUser({ board_users: [] })
        getCurrentSelectedProjectMembersList({ projectId }).then(res => {
            if (res.code == '0') {
                const board_users = res.data
                this.setState({
                    currentSelectedProjectMembersList: board_users, // 当前选择项目成员列表
                    currentOrgAllMembers: board_users// 当前组织所有成员?
                }, () => {
                    this.setVideoMeetingDefaultSuggesstionsByBoardUser({ board_users })
                })
            } else {
                message.error(res.message)
            }
        })
		}

		componentWillReceiveProps(nextProps) {
			let { projectList = [] } = nextProps
			if (projectList && projectList.length) {
				//过滤出来当前用户有编辑权限的项目
				projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)
				let new_projectList = [...projectList]
				let gold_id =  (new_projectList.find(item => item.is_my_private == '1') || {}).board_id
				this.getProjectUsers({ projectId: gold_id})
			}
		}

    // 设置mention组件提及列表
    setVideoMeetingDefaultSuggesstionsByBoardUser = ({ board_users = [] }) => {
        const videoMeetingDefaultSuggesstions = this.handleAssemVideoMeetingDefaultSuggesstions(board_users);
        this.setState({
            selectedSuggestions: videoMeetingDefaultSuggesstions,
            videoMeetingDefaultSuggesstions,
            suggestionValue: toContentState(""), //mention的值
        })
    }

    // 选择项目的下拉回调
    handleVideoMeetingSaveSelectChange = (value, option) => {
        const { props: { children } } = option
        const { projectList = [] } = this.props
        // console.log('ssssssss__',{ value,  projectList, option})
        this.getProjectUsers({ projectId: value })
        this.setState({
            saveToProject: value,
            saveProjectName: children,
            org_id: !value ? '0' : projectList.find(item => item.board_id == value).org_id || '0'
        });
    };

    // 修改创建会话的名称回调
    handleVideoMeetingTopicChange = e => {
        this.setState({
            meetingTitle: e.target.value
        });
    };

		// 获取指定日期格式的时间
		getAppointDelayTimestampToTime = (timestamp, flag) => {
			if (!timestamp) {
					return false
			}
			const timestampNew = timestamp.length === 10 ? Number(timestamp) * 1000 : Number(timestamp)
			let date = new Date(timestampNew);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			const now_year = new Date().getFullYear()
			// let Y = now_year == date.getFullYear() ? '' : date.getFullYear() + '年';
			let Y = date.getFullYear() + '/';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
			let D = date.getDate() < 10 ? '0' + date.getDate() + '/ ' : date.getDate() + '/ ';
			let h = (date.getMinutes() >= 0 && date.getMinutes() < 30) ? date.getHours() + ':' : date.getHours() + 1 + ':';
			let m = date.getMinutes() >= 0 && date.getMinutes() < 30 ? '30' : '00'
			return flag ? Y + M + D + h + m : Y + M + D;
	}
		
    handleVideoMeetingSubmit = () => {
        const { dispatch } = this.props;
				const { saveToProject, org_id, meetingTitle, meeting_start_time, due_time } = this.state;
				const defaultMeetingTitle = this.getCurrentUserNameThenSetMeetingTitle()
				const defaultValue = this.filterCurrentDefaultValue()
				const temp_time = this.getAppointDelayTimestampToTime(timeToTimestamp(new Date()), true)
				const currentDelayTime =  timeToTimestamp(temp_time)//  获取当前推迟的时间

				const data = {
					_organization_id: org_id,
					board_id: defaultValue ? defaultValue : saveToProject,
					flag: 2,
					rela_id: defaultValue ? defaultValue : saveToProject,
					topic: meetingTitle ? meetingTitle : defaultMeetingTitle,
					start_time: meeting_start_time ? meeting_start_time : currentDelayTime,
					// user_for: mergedMeetingMemberStr
				};
				// console.log(data, 'ssssssss')
				return

        Promise.resolve(
            dispatch({
                type: "technological/initiateVideoMeeting",
                payload: data
            })
        ).then(res => {
            if (res.code === "0") {
                const { start_url } = res.data;
                message.success("发起会议成功");
                // this.openWinNiNewTabWithATag(start_url);
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
            // this.setState({
            //     meetingTitle
						// });
						return meetingTitle
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

		// 提醒时间的选择
		handleMenuReallySelect = (e) => {
			const { key, selectedKeys } = e
			this.setState({
				selectedKeys: selectedKeys
			})
		}

		// 选择的时间
    renderSelectedRemindTime = () => {
			const { remindTimeList = [], selectedKeys = [] } = this.state
			return (
				<div>
					<Menu selectedKeys={selectedKeys} onSelect={this.handleMenuReallySelect.bind(this)}>
						{
							remindTimeList.map(item => (
								<Menu.Item key={item.remind_time_value}>{item.remind_time_value}</Menu.Item>
							))
						}
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
        let Y = now_year == date.getFullYear() ? '' : date.getFullYear() + '年';
        // let Y = date.getFullYear() + '年';
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
		
		// 设置会议开始时间
		startDatePickerChange = (timeString) => {
			const start_timeStamp = timeToTimestamp(timeString)
			this.setState({
				start_time: timestampToTime(start_timeStamp, true),
				meeting_start_time: start_timeStamp
			})
		}

		// 设置会议的结束时间
		handleEndDateChange = (e, type) => {
			console.log(e, type, 'ssssssss')
			e && e.domEvent && e.domEvent.stopPropagation()
			const temp_time = this.getAppointDelayTimestampToTime(timeToTimestamp(new Date()), true)
			const currentDelayStartTime =  timeToTimestamp(temp_time)//  获取当前推迟的时间
			const { key } = e
			console.log(currentDelayStartTime, 'sssssss')
			
			if (type == 'm') {
				currentDelayDueTime = currentDelayStartTime + key * 60000
			} else if (type == 'h') {
				currentDelayDueTime = currentDelayStartTime + key * 3600000
			}
		}

		filterCurrentDefaultValue = () => {
			let { projectList = [] } = this.props
			//过滤出来当前用户有编辑权限的项目
			projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)
			let new_projectList = [...projectList]
			let gold_id =  (new_projectList.find(item => item.is_my_private == '1') || {}).board_id
			return gold_id
		}

    renderPopover = () => {
        const {
            saveToProject,
						videoMeetingPopoverVisible,
						dueTimeList = [],
						start_time,
						selectedKeys,
						currentSelectedProjectMembersList = []
        } = this.state;
				let { projectList, board_id } = this.props;
				const meetingTitle = this.getCurrentUserNameThenSetMeetingTitle()
        const currentDelayTime = this.getCurrentTimeStamp()//  获取当前推迟的时间

        //过滤出来当前用户有编辑权限的项目
				projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)

				const defaultValue = this.filterCurrentDefaultValue()

        const videoMeetingPopoverContent_ = (
            <div>
                {videoMeetingPopoverVisible && (
                    <div className={indexStyles.videoMeeting__wrapper}>
                        <div className={indexStyles.videoMeeting__topic}>
                            <div className={indexStyles.videoMeeting__topic_content}>
															{/* 项目选择 S */}
                                <span className={indexStyles.videoMeeting__topic_content_save}>
                                    <Select
                                        defaultValue={defaultValue ? defaultValue : saveToProject}
                                        onChange={this.handleVideoMeetingSaveSelectChange}
                                        style={{ width: "100%" }}
                                    >
                                        {/* <Option value={null}>不存入项目</Option> */}
                                        {projectList.length !== 0 &&
                                            projectList.map(project => (
                                                <Option value={project.board_id} key={project.board_id}>
                                                    {project.board_name}
                                                </Option>
                                            ))}
                                    </Select>
                                </span>
																{/* 项目选择 E */}

																{/* 会议名称 S */}
                                <span className={indexStyles.videoMeeting__topic_content_title}>
                                    <Input
                                        value={meetingTitle}
                                        onChange={this.handleVideoMeetingTopicChange}
                                    />
                                </span>
																{/* 会议名称 E */}

																{/* 时间选择 S */}
                                <span className={indexStyles.videoMeeting__topic_content_time}>
                                    <span className={indexStyles.videoMeeting__topic_content_datePicker} style={{ position: 'relative', zIndex: 0, minWidth: '200px', lineHeight: '38px', display: 'inline-block', textAlign: 'center' }}>
                                        <span>
                                            <Input
                                                value={start_time ? start_time : currentDelayTime}
                                            />
                                        </span>
                                        <DatePicker
                                            onChange={this.startDatePickerChange.bind(this)}
                                            // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={start_time ? start_time : currentDelayTime}
                                            format="YYYY/MM/DD HH:mm"
                                            showTime={{ format: 'HH:mm' }}
                                            style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                                        <span className={indexStyles.videoMeeting__topic_content_rightnow}>现在</span>
                                    </span>
                                    <span style={{position: 'relative'}}>
																				<Select 
																				// onChange={this.handleEndDateChange} 
																				
																					getPopupContainer={triggerNode => triggerNode.parentNode} dropdownClassName={`${indexStyles.select_overlay} ${globalStyles.global_vertical_scrollbar}`} style={{ width: '136px' }} defaultValue={['1']}>
                                            {/* <Option value="1">持续1小时</Option> */}
																						{
																							dueTimeList && dueTimeList.map((item,index) => (
																								<Option onClick={(e) => { this.handleEndDateChange(e, item.remind_time_type) }} value={item.txtVal}>{ `持续 ${item.txtVal} ${item.remind_time_type == 'm' ? '分钟':'小时'}`}</Option>
																							))
																						}
                                        </Select>
                                    </span>
                                </span>
																{/* 时间选择 E */}
                            </div>
                        </div>

												{/* 设置通知提醒 S */}
                        <div className={indexStyles.videoMeeting__remind}>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ color: 'rgba(0,0,0,0.45)' }}>提醒谁参与?</span>
                                <span>
                                    <Dropdown overlay={this.renderSelectedRemindTime()}>
                                        <span className={`${globalStyles.authTheme}`}>开始前 {selectedKeys ? selectedKeys : '5'} 分钟提醒 &#xe7ee;</span>
                                    </Dropdown>
                                </span>
                            </div>
                            <div>
                                <div style={{ flex: '1', position: 'relative' }}>
                                    <Dropdown overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                                        overlayStyle={{ maxWidth: '200px',minWidth: '200px' }}
                                        overlay={
                                            <MenuSearchPartner
                                                isInvitation={true}
                                                listData={currentSelectedProjectMembersList} keyCode={'user_id'} searchName={'name'} currentSelect={[]}
                                                board_id={board_id}
                                                chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                                        }
                                    >
																				<div className={indexStyles.addNoticePerson}>
																						<Icon type="plus-circle" style={{ fontSize: '40px', color: '#40A9FF' }} />
																				</div>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
												{/* 设置通知提醒 E */}

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
        const { videoMeetingPopoverVisible, saveProjectName, saveToProject } = this.state;
        const videoMeetingPopoverContent_ = (
            <div>
                {videoMeetingPopoverVisible && (
                    <div className={indexStyles.videoMeeting__header}>
                        <div className={`${globalStyles.authTheme} ${indexStyles.videoMeeting__mark}`}>&#xe6de;</div>
                        <div className={indexStyles.videoMeeting__title}>预约 {saveToProject && saveProjectName && `${saveProjectName}${currentNounPlanFilterName(PROJECTS)}`} 在线会议</div>
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