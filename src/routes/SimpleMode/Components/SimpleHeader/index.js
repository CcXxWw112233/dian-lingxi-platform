import React, { Component, lazy, Suspense } from 'react'
import dva, { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
// import VideoMeeting from '@/routes/Technological/Sider/comonent/videoMeetingPopoverContent/index'
import { Tooltip, Dropdown, Modal, Popover, Avatar } from 'antd'
import Cookies from 'js-cookie'
import SimpleNavigation from './Components/SimpleNavigation/index'
// import SimpleDrawer from './Components/SimpleDrawer/index'
// import TaskDetailModal from '@/components/TaskDetailModal'
import {
  setBoardIdStorage,
  getSubfixName,
  currentNounPlanFilterName
} from '../../../../utils/businessFunction'
// import Organization from '@/routes/organizationManager'
// import FileDetailModal from '@/components/FileDetailModal'
// import ProcessDetailModal from '@/components/ProcessDetailModal'
// import Guide from '../Guide/index'
import { NODE_ENV, PROJECTS } from '../../../../globalset/js/constant'
import LingxiIm, { lx_utils, Im } from 'lingxi-im'
import small_routine_code from '../../../../assets/sider_right/small_routine_code.png'
import official_accounts_code from '../../../../assets/sider_right/official_accounts_code.png'
import ExpireVip from '../../../../components/ExpireVip'
import { ExpireType } from '../../../../components/ExpireVip/constans'
import { ExpireModel } from '../../../../models/technological/expireRenew'
import { debounce } from 'lodash'

const VideoMeeting = lazy(() =>
  import(
    '@/routes/Technological/Sider/comonent/videoMeetingPopoverContent/index'
  )
)
// const SimpleNavigation = lazy(() =>
//   import('./Components/SimpleNavigation/index')
// )
const SimpleDrawer = lazy(() => import('./Components/SimpleDrawer/index'))
// const Organization = lazy(() => import('@/routes/organizationManager'))
const TaskDetailModal = lazy(() => import('@/components/TaskDetailModal'))
const FileListRightBarFileDetailModal = lazy(() =>
  import(
    '../../../Technological/components/ProjectDetail/FileModule/FileListRightBarFileDetailModal'
  )
) //lazy(() => import('@/components/FileDetailModal'))
const ProcessDetailModal = lazy(() => import('@/components/ProcessDetailModal'))
const Guide = lazy(() => import('../Guide/index'))

class SimpleHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leftNavigationVisible: false,
      simpleDrawerVisible: false,
      // simpleDrawerContent: null,
      simpleDrawerTitle: '',
      whetherShowTaskDetailModalVisible: false, // 控制引用的任务弹窗多次渲染
      whetherShowFileDetailModalVisible: false,
      whetherShowProcessDetailModalVisible: false, // 控制引用的流程弹窗多次渲染
      guideImageMoadlVisible: false, //协作引导图片全屏预览
      guideImgSrc: '' //协作引导图片全屏预览资源
    }
    this.scrollToTop = debounce(this.scrollToTop, 100)
  }

  openGuideModal = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        guideModalVisiable: true
      }
    })
  }

  openOrCloseImChatModal = val => {
    // console.log(val)
    const { dispatch, chatImVisiable } = this.props
    let flag = val !== undefined ? !!val : !chatImVisiable
    const width = document.body.scrollWidth
    let workbenchBoxContentWapperModalStyle = flag
      ? { width: width - 400 + 'px' }
      : { width: '100%' }
    // console.log(workbenchBoxContentWapperModalStyle)
    if (flag) {
      LingxiIm.show()
    }
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        chatImVisiable: flag,
        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
      }
    })
  }

  handleVisibleChange = flag => {
    this.setState({ leftNavigationVisible: flag })
    if (flag) {
      this.scrollToTop()
    }
  }

  /** 滚动到指定位置 */
  scrollToTop = () => {
    const dom = document.querySelector('#org_selected')
    if (dom && dom.parentElement) {
      dom.parentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  openOrCloseMainNav = e => {
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
  updateStates = data => {
    this.setState({
      ...data
    })
  }

  closeDrawer = () => {
    this.setState({
      simpleDrawerVisible: false,
      simpleDrawerTitle: ''
    })
  }

  componentWillReceiveProps(nextProps) {
    const { OrganizationId: nextOrg } = nextProps
    const { OrganizationId: lastOrg } = this.props
    if (nextOrg != lastOrg) {
      const filterId = nextOrg == '0' ? '' : nextOrg
      lx_utils.filterUserList(filterId)
    }
  }
  componentDidMount() {
    this.imInitOption()
    // this.openDrawDefault()
  }

  //圈子
  imInitOption = () => {
    const { protocol, host } = window.location
    // 设置组织id过滤
    const { dispatch, OrganizationId } = this.props
    const filterId = OrganizationId == '0' ? '' : OrganizationId

    lx_utils.filterUserList(filterId)
    let ImOptions = { baseUrl: `${protocol}//${host}/` }
    if (
      ['test.lingxi.new-di.com', 'localhost'].includes(window.location.host) ||
      NODE_ENV === 'development'
    ) {
      ImOptions.APPKEY = '3a4464b3ff2767d3e9bf76e77de762c7'
    }
    Im.option({
      ...ImOptions
      // APPKEY: 'c3abea191b7838ff65f9a6a44ff5e45f'
      // APPKEY: '3a4464b3ff2767d3e9bf76e77de762c7' //'6b5d044ca33c559b9b91f02e29573f79',//ceshi//"ab3db8f71133efc21085a278db04e7e7", //
    })
    const clickDynamicFunc = data => {
      // 需要延时打开，因为IM先调用关闭，在打开的，而关闭比打开的走的慢
      setTimeout(() => this.imClickDynamic(data), 100)
    }
    const visibleFunc = val => {
      if (!val) {
        this.openOrCloseImChatModal(false)
      }
    }
    if (Im) {
      Im.on('visible', visibleFunc)
      Im.on('clickDynamic', clickDynamicFunc)
      Im.on('hasNewImMsg', ({ data, unread }) => {
        //最新一条未读消息推送过来
        if (!data.hasOwnProperty('action')) {
          //首次进入不处理
          // console.log('ssss_初始化首次', unread)
          dispatch({
            type: 'imCooperation/getImUnReadAllMessages',
            payload: {
              messages: unread
            }
          })
          return
        }
        dispatch({
          type: 'imCooperation/listenImUnReadLatestMessage',
          payload: {
            message_item: data
          }
        })
        // console.log('ssss_最新未读', data)
      })
      Im.on('readImMsg', data => {
        //最新已读消息推送过来
        dispatch({
          type: 'imCooperation/listenImLatestAreadyReadMessages',
          payload: {
            messages: data
          }
        })
        // console.log('ssss_最新已读', data)
      })
      Im.on('updateImUnread', function(number) {
        dispatch({
          type: 'imCooperation/updateDatas',
          payload: {
            im_alarm_no_reads_total: number
          }
        })
      })
      Im.on('fileCancel', ({ id }) => {
        if (id == this.props.card_id) {
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawerVisible: false,
              drawContent: {},
              card_id: '',
              boardTagList: []
            }
          })
        }
        if (id == this.props.filePreviewCurrentFileId) {
          dispatch({
            type: 'publicFileDetailModal/updateDatas',
            payload: {
              filePreviewCurrentFileId: '',
              fileType: '',
              isInOpenFile: false,
              filePreviewCurrentName: ''
            }
          })
        }
        if (id == this.props.processInfo.id) {
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              process_detail_modal_visible: false,
              currentFlowInstanceName: '', // 当前流程实例的名称
              currentFlowInstanceDescription: '', // 当前的实例描述内容
              isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
              isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
              processPageFlagStep: '1', // "1", "2", "3", "4" 分别对应 新建， 编辑， 启动
              processEditDatas: [],
              node_type: '1', // 当前的节点类型
              processCurrentEditStep: 0, // 当前的编辑步骤 第几步
              templateInfo: {}, // 模板信息
              processInfo: {}, // 流程实例信息
              currentProcessInstanceId: '', // 当前查看的流程实例名称
              currentTempleteIdentifyId: '', // 当前查看的模板ID
              not_show_create_node_guide: '1', // 添加节点步骤的引导
              not_show_create_form_guide: '1', // 配置表项的引导
              not_show_create_rating_guide: '0', // 配置评分节点的引导
              currentOrgAllMembers: [] // 组织成员
            }
          })
        }
      })
      this.setState({
        whetherShowTaskDetailModalVisible: false
      })
    }
  }
  // 圈子点击
  imClickDynamic = (data = {}) => {
    const { dispatch } = this.props
    const {
      orgId,
      boardId,
      type,
      relaDataId,
      cardId,
      relaDataName,
      relaDataId2,
      relaDataName2
    } = data
    if (!!boardId) {
      dispatch({
        type: 'projectDetail/projectDetailInfo',
        payload: {
          id: boardId
        }
      })
    }
    setBoardIdStorage(boardId)
    switch (type) {
      case 'board':
        break
      case 'folder':
        break
      case 'file':
        if (this.props.isInOpenFile) {
          dispatch({
            type: 'publicFileDetailModal/updateDatas',
            payload: {
              isInOpenFile: false,
              filePreviewCurrentFileId: '',
              fileType: '',
              filePreviewCurrentName: ''
            }
          })
          this.setState({
            whetherShowFileDetailModalVisible: false
          })
        }
        if (this.props.drawerVisible) {
          // 防止弹窗多层覆盖
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawerVisible: false,
              card_id: ''
            }
          })
          this.setState({
            whetherShowTaskDetailModalVisible: false
          })
        }
        if (this.props.process_detail_modal_visible) {
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              process_detail_modal_visible: false,
              processInfo: {},
              currentProcessInstanceId: ''
            }
          })
        }
        // dispatch({
        //     type: 'projectDetail/projectDetailInfo',
        //     payload: {
        //         id: boardId
        //     }
        // })
        // dispatch({
        //     type: 'projectDetail/getRelationsSelectionPre',
        //     payload: {
        //         _organization_id: orgId
        //     }
        // })
        setTimeout(() => {
          dispatch({
            type: 'publicFileDetailModal/updateDatas',
            payload: {
              isInOpenFile: true,
              filePreviewCurrentFileId: relaDataId,
              fileType: getSubfixName(relaDataName),
              filePreviewCurrentName: relaDataName
            }
          })
          this.setState({
            whetherShowFileDetailModalVisible: true
          })
        }, 200)
        // dispatch({
        //     type: 'projectDetailFile/getCardCommentListAll',
        //     payload: {
        //         id: relaDataId
        //     }
        // })
        // dispatch({
        //     type: 'projectDetailFile/updateDatas',
        //     payload: {
        //         isInOpenFile: true,
        //         seeFileInput: 'fileModule',
        //         // currentPreviewFileData: data,
        //         filePreviewCurrentFileId: relaDataId,
        //         // filePreviewCurrentId: file_resource_id,
        //         // filePreviewCurrentVersionId: version_id,
        //         pdfDownLoadSrc: '',
        //         fileType: getSubfixName(relaDataName)
        //     }
        // })
        // if (getSubfixName(relaDataName) == '.pdf') {
        //     dispatch({
        //         type: 'projectDetailFile/getFilePDFInfo',
        //         payload: {
        //             id: relaDataId
        //         }
        //     })
        // } else {
        //     dispatch({
        //         type: 'projectDetailFile/filePreview',
        //         payload: {
        //             file_id: relaDataId
        //         }
        //     })
        //     // 这里调用是用来获取以及更新访问控制文件弹窗详情中的数据, 一开始没有的
        //     // 但是这样会影响 文件路径, 所以传递一个参数来阻止更新
        //     dispatch({
        //         type: 'projectDetailFile/fileInfoByUrl',
        //         payload: {
        //             file_id: relaDataId,
        //             isNotNecessaryUpdateBread: true
        //         }
        //     })
        // }
        break
      case 'card':
        if (this.props.drawerVisible) {
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawerVisible: false,
              card_id: ''
            }
          })
          this.setState({
            whetherShowTaskDetailModalVisible: false
          })
        }
        if (this.props.isInOpenFile) {
          // 防止弹窗多层覆盖
          dispatch({
            type: 'publicFileDetailModal/updateDatas',
            payload: {
              isInOpenFile: false,
              filePreviewCurrentFileId: '',
              fileType: '',
              filePreviewCurrentName: ''
            }
          })
          this.setState({
            whetherShowFileDetailModalVisible: false
          })
        }
        if (this.props.process_detail_modal_visible) {
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              process_detail_modal_visible: false,
              processInfo: {},
              currentProcessInstanceId: ''
            }
          })
        }
        // dispatch({
        //     type: 'projectDetail/updateDatas',
        //     payload: {
        //         projectDetailInfoData: { board_id: boardId }
        //     }
        // })
        setTimeout(() => {
          this.setState(
            {
              whetherShowTaskDetailModalVisible: true
            },
            () => {
              dispatch({
                type: 'publicTaskDetailModal/updateDatas',
                payload: {
                  drawerVisible: true,
                  card_id: cardId
                }
              })
            }
          )
        }, 200)
        break
      case 'flow':
        if (this.props.process_detail_modal_visible) {
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              process_detail_modal_visible: false,
              processInfo: {},
              currentProcessInstanceId: ''
            }
          })
        }
        if (this.props.drawerVisible) {
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawerVisible: false,
              card_id: ''
            }
          })
          this.setState({
            whetherShowTaskDetailModalVisible: false
          })
        }
        if (this.props.isInOpenFile) {
          // 防止弹窗多层覆盖
          dispatch({
            type: 'publicFileDetailModal/updateDatas',
            payload: {
              isInOpenFile: false,
              filePreviewCurrentFileId: '',
              fileType: '',
              filePreviewCurrentName: ''
            }
          })
          this.setState({
            whetherShowFileDetailModalVisible: false
          })
        }
        setTimeout(() => {
          dispatch({
            type: 'publicProcessDetailModal/getProcessInfo',
            payload: {
              id: relaDataId,
              calback: () => {
                dispatch({
                  type: 'publicProcessDetailModal/updateDatas',
                  payload: {
                    process_detail_modal_visible: true,
                    currentProcessInstanceId: relaDataId,
                    processPageFlagStep: '4'
                  }
                })
              }
            }
          })
          this.setState({
            whetherShowProcessDetailModalVisible: true
          })
        }, 200)
        break
      default:
        break
    }
  }

  // 文件弹窗的关闭回调
  setPreviewFileModalVisibile = () => {
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: '',
        fileType: '',
        isInOpenFile: false,
        filePreviewCurrentName: ''
      }
    })
  }

  // 如果捕获到参数，默认打开组织管理后台
  openDrawDefault = () => {
    const session_name = 'simplemode_home_open_key'
    const open_draw_name = window.sessionStorage.getItem(session_name)
    if (!open_draw_name) return
    // this.openOrgManagerDraw()
    window.sessionStorage.removeItem(session_name)
  }
  openOrgManagerDraw = () => {
    //isHasManagerBack() && this.routingJump(`/organizationManager?nextpath=${window.location.hash.replace('#', '')}`)
    const currentSelectOrganize = localStorage.getItem('currentSelectOrganize')
      ? JSON.parse(localStorage.getItem('currentSelectOrganize'))
      : {} //JSON.parse(localStorage.getItem('currentSelectOrganize'))
    const {
      name,
      member_join_model,
      member_join_content,
      logo,
      logo_id,
      id
    } = currentSelectOrganize
    const { dispatch } = this.props
    dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentOrganizationInfo: {
          //组织信息
          name,
          member_join_model,
          member_join_content,
          logo,
          logo_id,
          id,
          management_Array: [] //地图管理人员数组
        },
        content_tree_data: [], //可访问内容
        function_tree_data: [],
        orgnization_role_data: [], //组织角色数据
        project_role_data: [], //项目角色数据
        tabSelectKey: '1',
        // permission_data: [], //权限数据
        //名词定义
        current_scheme_local: '', //已选方案名称
        current_scheme: '', //当前方案名称
        current_scheme_id: '',
        scheme_data: [],
        field_data: [],
        editable: '0' //当前是否在自定义编辑状态 1是 0 否
      }
    })

    dispatch({
      type: 'organizationManager/getRolePermissions',
      payload: {
        type: '1'
      }
    })
    dispatch({
      type: 'organizationManager/getRolePermissions',
      payload: {
        type: '2'
      }
    })
    dispatch({
      type: 'organizationManager/getNounList',
      payload: {}
    })
    dispatch({
      type: 'organizationManager/getNounList',
      payload: {}
    })
    const OrganizationId = localStorage.getItem('OrganizationId')
    if (OrganizationId !== '0') {
      dispatch({
        type: 'organizationManager/getPayingStatus',
        payload: { orgId: OrganizationId }
      })
    }
    this.updateStates({
      simpleDrawerVisible: true,
      // simpleDrawerContent: (
      //   <Suspense fallback={''}>
      //     {' '}
      //     <Organization showBackBtn={false} />
      //   </Suspense>
      // ),
      simpleDrawerTitle: '后台管理'
    })
    this.handleVisibleChange(false)
  }

  opGuiImage = src => {
    this.setState({
      guideImageMoadlVisible: true,
      guideImgSrc: src[0]
    })
  }

  closedGuideImageModal = () => {
    this.setState({
      guideImageMoadlVisible: false
    })
  }

  // 渲染小程序/公众号内容
  renderLingxiPlantformCode = () => {
    return (
      <div className={indexStyles.popover_plantform_content}>
        <div className={indexStyles.popover_plantform_small_routine}>
          <div className={indexStyles.popover_small_routine_code}>
            <img src={small_routine_code} width="120px" height="120px" />
          </div>
          <div className={indexStyles.popover_code_text}>
            <p>聆悉协作・小程序</p>
            <span>扫码关注小程序，获取你的移动工作台</span>
          </div>
        </div>
        <div className={indexStyles.popover_plantform_official_accounts}>
          <div className={indexStyles.popover_plantform_official_accounts_code}>
            <img src={official_accounts_code} width="120px" height="120px" />
          </div>
          <div className={indexStyles.popover_code_text}>
            <p>聆悉协作・公众号</p>
            <span>扫码关注二维码，随时掌握项目动态</span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      chatImVisiable = false,
      leftMainNavIconVisible,
      drawerVisible,
      isInOpenFile,
      filePreviewCurrentFileId,
      fileType,
      process_detail_modal_visible,
      dispatch,
      im_alarm_no_reads_total,
      guideModalVisiable
    } = this.props
    const {
      simpleDrawerVisible,
      // simpleDrawerContent,
      leftNavigationVisible,
      simpleDrawerTitle,
      guideImgSrc,
      simpleDrawerContentKey
    } = this.state
    const {
      current_org = {},
      name,
      avatar,
      user_set = {}
    } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    return (
      <div className={indexStyles.headerWapper}>
        {/* {false && (
          <Tooltip placement="bottom" title={'退出极简模式'}>
            <div
              className={indexStyles.miniNavigation}
              onClick={this.openOrCloseMainNav}
            >
              <i
                className={`${globalStyles.authTheme}`}
                style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }}
              >
                &#xe69d;
              </i>
            </div>
          </Tooltip>
        )} */}
        {leftMainNavIconVisible && (
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            overlay={
              <SimpleNavigation
                updateStates={this.updateStates}
                dropdownHandleVisibleChange={this.handleVisibleChange}
              />
            }
            onVisibleChange={this.handleVisibleChange}
            visible={leftNavigationVisible}
            getPopupContainer={() =>
              document.getElementById('technologicalLayoutWrapper')
            }
          >
            <div
              className={`${indexStyles.miniNavigation} ${globalStyles.normal_icon_mouse_event}`}
            >
              <div>
                <Avatar src={avatar} size={40}>
                  <i
                    className={`${globalStyles.authTheme}`}
                    style={{ fontSize: '32px' }}
                  >
                    &#xe69f;
                  </i>
                </Avatar>
              </div>
              <div className={indexStyles.user_msg}>
                <div
                  className={`${indexStyles.user_name} text_showdow_alpha_black`}
                >
                  {name}
                </div>
                <div
                  className={`${indexStyles.current_org} text_showdow_alpha_black`}
                >
                  <ExpireVip
                    releaShow={ExpireType.Expired === this.props.expireType}
                  >
                    <span>{current_org?.name}</span>
                  </ExpireVip>
                </div>
              </div>
            </div>
          </Dropdown>
        )}

        <Popover
          trigger={['click']}
          title={null}
          content={this.renderLingxiPlantformCode()}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          <div className={`${indexStyles.plantformCode}`}>
            <span
              style={{
                fontSize: '22px',
                marginRight: '4px',
                verticalAlign: 'middle'
              }}
              className={globalStyles.authTheme}
            >
              &#xe634;
            </span>
            <span
              style={{
                verticalAlign: 'middle',
                fontSize: '12px',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'
              }}
            >
              小程序/公众号
            </span>
          </div>
        </Popover>

        <Tooltip title="操作指引">
          <div
            className={`${indexStyles.guideButton} ${globalStyles.normal_icon_mouse_event}`}
            onClick={this.openGuideModal}
          >
            <i
              className={`${globalStyles.authTheme}`}
              style={{ fontSize: '26px' }}
            >
              &#xe845;
            </i>
          </div>
        </Tooltip>
        <Suspense fallback={''}>
          <VideoMeeting />
        </Suspense>
        {/* 项目圈 */}
        <Tooltip
          title={`${currentNounPlanFilterName(
            PROJECTS,
            this.props.currentNounPlan
          )}圈`}
        >
          <div
            style={{ zIndex: !chatImVisiable && 1009 }}
            className={indexStyles.miniImMessage}
            onClick={this.openOrCloseImChatModal}
          >
            {im_alarm_no_reads_total > 0 && (
              <div className={indexStyles.no_reads}>
                {im_alarm_no_reads_total > 99 ? '99+' : im_alarm_no_reads_total}
              </div>
            )}
            <i
              className={`${globalStyles.authTheme}`}
              style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }}
            >
              &#xe6df;
            </i>
          </div>
        </Tooltip>

        <div
          className={indexStyles.chatWapper}
          style={{ display: `${chatImVisiable ? '' : 'none'}` }}
        >
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
          <LingxiIm token={Cookies.get('Authorization')} width="400px" />

          {/* <div className={indexStyles.videoMeetingWapper}>
            <VideoMeeting />
          </div> */}
        </div>
        <Suspense fallback={''}>
          {simpleDrawerVisible && (
            <SimpleDrawer
              style={{ height: 'auto' }}
              updateState={this.updateStates}
              closeDrawer={this.closeDrawer}
              // simpleDrawerContent={simpleDrawerContent}
              simpleDrawerContentKey={simpleDrawerContentKey}
              drawerTitle={simpleDrawerTitle}
              visible={simpleDrawerVisible}
            />
          )}
          {this.state.whetherShowTaskDetailModalVisible && drawerVisible && (
            <TaskDetailModal
              task_detail_modal_visible={
                drawerVisible && this.state.whetherShowTaskDetailModalVisible
              }
              // setTaskDetailModalVisible={this.setTaskDetailModalVisible}
              // handleTaskDetailChange={this.handleChangeCard}
              // handleDeleteCard={this.handleDeleteCard}
            />
          )}
          {isInOpenFile && this.state.whetherShowFileDetailModalVisible && (
            <FileListRightBarFileDetailModal
              setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
              fileType={fileType}
              filePreviewCurrentFileId={filePreviewCurrentFileId}
              file_detail_modal_visible={
                isInOpenFile && this.state.whetherShowFileDetailModalVisible
              }
            />
          )}
          {process_detail_modal_visible &&
            this.state.whetherShowProcessDetailModalVisible && (
              <ProcessDetailModal
                process_detail_modal_visible={
                  process_detail_modal_visible &&
                  this.state.whetherShowProcessDetailModalVisible
                }
                notburningProcessFile={true}
              />
            )}
          {guideModalVisiable && (
            <Guide opGuiImage={this.opGuiImage.bind(this)} />
          )}
        </Suspense>
        <Modal
          visible={this.state.guideImageMoadlVisible}
          closable={false}
          destroyOnClose={true}
          maskClosable={true}
          footer={null}
          zIndex={10000}
          onCancel={this.closedGuideImageModal}
          centered={true}
          height={'80%'}
          width={'80%'}
        >
          <img
            src={this.state.guideImgSrc}
            style={{ width: '100%', height: '100%' }}
          />
        </Modal>
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  simplemode: { chatImVisiable, leftMainNavIconVisible, guideModalVisiable },
  modal,
  loading,
  publicTaskDetailModal: { drawerVisible, card_id },
  publicFileDetailModal: { filePreviewCurrentFileId, fileType, isInOpenFile },
  publicProcessDetailModal: { processInfo = {}, process_detail_modal_visible },
  imCooperation: { im_alarm_no_reads_total = 0 },
  technological: {
    datas: { OrganizationId = '0' }
  },
  organizationManager: {
    datas: { currentNounPlan }
  },
  [ExpireModel.namespace]: { expireType }
}) {
  return {
    currentNounPlan,
    OrganizationId,
    chatImVisiable,
    guideModalVisiable,
    leftMainNavIconVisible,
    modal,
    loading,
    drawerVisible,
    card_id,
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    processInfo,
    process_detail_modal_visible,
    im_alarm_no_reads_total,
    expireType
  }
}
export default connect(mapStateToProps)(SimpleHeader)
