import React, { Component } from 'react'
import { connect } from 'dva'
import { message, Upload, Modal, Button, Dropdown, Icon, Checkbox, TreeSelect } from 'antd'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { getFolderList } from '@/services/technological/file'
import { isApiResponseOk } from "@/utils/handleResponseData"
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  getSubfixName, setUploadHeaderBaseInfo
} from "@/utils/businessFunction";
const { TreeNode } = TreeSelect;
/**上传附件组件 */
@connect(mapStateToProps)
export default class UploadAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFileVisible: false,
      fileList: [],
      uploadFileList: [],
      toNoticeList: [],
      isOnlyNoticePersonsVisit: false,
      boardFolderTreeData: [],
      fileSavePath: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, board_id } = nextProps;
    const { board_id: old_board_id } = this.props;
    if (board_id && board_id != old_board_id) {
      this.getProjectFolderList(board_id)
    }
  }


  //获取项目里文件夹列表
  getProjectFolderList = (board_id) => {
    getFolderList({ board_id }).then((res) => {
      console.log("获取项目里文件夹列表", res);
      if (isApiResponseOk(res)) {

        this.setState({
          boardFolderTreeData: res.data
        });
      } else {
        message.error(res.message)
      }
    })
  }

  //确定，上传开始
  handleOk = e => {
    this.handleUpload();
  };

  closeUploadAttachmentModal = (e) => {
    e.stopPropagation()
    this.setState({
      uploadFileList: []
    }, () => {
      this.setUploadFileVisible(false);

    });

  };

  setUploadFileVisible = (visible) => {
    console.log(visible);
    this.setState({
      uploadFileVisible: visible
    });
  }

  handleUpload = () => {

    const { org_id, board_id, card_id } = this.props;
    const { fileSavePath = 0, fileList = [], toNoticeList, isOnlyNoticePersonsVisit } = this.state;

    const formData = new FormData();
    formData.append("file", fileList[0]);

    let loading = message.loading('文件正在上传中...', 0);
    let notify_user_ids = new Array;
    for (var i = 0; i < toNoticeList.length; i++) {
      notify_user_ids.push(toNoticeList[i].user_id);
    }
    axios({
      url: `/api/projects/v2/card/attachment/upload`,
      method: 'post',
      //processData: false,
      data: formData,
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),

        ...setUploadHeaderBaseInfo({ orgId: org_id, boardId: board_id, aboutBoardOrganizationId: org_id, contentDataType: "card", contentDataId: card_id }),

      },
      params: {
        board_id: board_id,
        card_id: card_id,
        folder_id: fileSavePath,
        is_limit_access: isOnlyNoticePersonsVisit ? 1 : 0,
        notify_user_ids: notify_user_ids.join(','),

      }
    }).then(res => {
      console.log("上传结果", res);
      // this.setState({
      //     awaitUploadFile: {},
      //     uploading: false,
      // });
      const apiResult = res.data;

      if (isApiResponseOk(apiResult)) {
        message.destroy()
        message.success('上传成功');
        try {
          this.setUploadFileVisible(false);
          this.props.onFileListChange(apiResult.data);
         
        }catch (err) {
        
        }
      
      } else {
        message.warn(apiResult.message)
      }

    }).catch((error, e) => {
      // console.log(error);
      message.destroy()
      message.error('上传失败');
    });
  }

  getUploadProps = () => {
    let $that = this;
    return {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      withCredentials: true,
      multiple: true,
      showUploadList: false,
      beforeUpload: this.onBeforeUpload,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          $that.onCustomPreviewFile(info);
        } else if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
  }

  onBeforeUpload = (file) => {
    this.setState(state => ({
      fileList: [...state.fileList, file],
    }));
    console.log("onBeforeUpload:上传附件设置");
    this.setUploadFileVisible(true)
    return false;
  }
  onCustomPreviewFile = (info) => {
    this.setState({
      uploadFileList: info.fileList
    });
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { projectDetailInfoData = {} } = this.props;
    // 多个任务执行人
    const membersData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newNoticeUserList = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newNoticeUserList.push(membersData[j])
        }
      }
    }

    this.setState({
      toNoticeList: newNoticeUserList
    });

    if (data.type === "add") {

    } else if (data.type === "remove") {
      //toNoticeList.add();
    }

  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    console.log("移除", shouldDeleteItem);
  }
  // 移除执行人的回调 E

  onChangeOnlyNoticePersonsVisit = (e) => {
    this.setState({
      isOnlyNoticePersonsVisit: e.target.checked
    });
  }

  renderFolderTreeNodes = data => {
    console.log("renderFolderTreeNodes", data);

    return data.map(item => {
      if (item.child_data && item.child_data.length > 0) {
        return (
          <TreeNode title={item.folder_name} key={item.folder_id} value={item.folder_id} dataRef={item} >
            {this.renderFolderTreeNodes(item.child_data)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.folder_name} key={item.folder_id} value={item.folder_id} dataRef={item} />;
      }

    });

  }


  renderSelectBoardFileTreeList = () => {
    const { is_file_tree_loading } = this.props;
    const { boardFolderTreeData } = this.state;
    console.log('is_selectFolder', boardFolderTreeData);
    if (is_file_tree_loading) {
      return (
        <div style={{ backgroundColor: '#FFFFFF', textAlign: 'center', height: '50px', lineHeight: '48px', overflow: 'hidden', color: 'rgba(0, 0, 0, 0.25)' }} className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}>
          数据加载中
        </div>
      )
    }

    return this.renderFolderTreeNodes([{ folder_id: 0, folder_name: '任务附件默认目录' }, boardFolderTreeData]);
  }

  onChangeFileSavePath = (value) => {
    //console.log("onChangeFileSavePath",value);
    this.setState({
      fileSavePath: value
    });
  }


  render() {
    // 父组件传递的值
    const { visible, children, board_id, card_id, projectDetailInfoData = {} } = this.props;
    const { uploadFileVisible, uploadFileList = [], toNoticeList = [], fileSavePath } = this.state;
    //console.log("toNoticeList",toNoticeList);
    const { data: projectMemberData } = projectDetailInfoData;
    console.log("fileSavePath", fileSavePath);
    return (

      <div>
        <Upload {...this.getUploadProps()} className={styles.uploadBtn} key={Math.random()}>
          {children}
        </Upload>

        <Modal
          title={<div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>上传附件设置</div>}
          visible={uploadFileVisible || visible}
          onOk={this.handleOk}
          onCancel={this.closeUploadAttachmentModal}
          zIndex={1007}
          width={556}
        >
          <div>
            <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe6b3;</span>附件列表：
                </div>
          <div className={styles.fileListWrapper}>
            {
              uploadFileList.length > 0 ?
                uploadFileList.map((file) => {
                  return (<div key={file.uid} className={styles.fileItem}>{file.name}</div>)
                })
                : ''
            }
            {/* <div className={styles.fileItem}><div className={styles.itemLeft}>结构方案.pdf</div><div className={styles.itemRight}> <Button size={'small'}>取消</Button></div></div>
                        <div className={styles.fileItem}>结构方案1.pdf</div> */}

          </div>
          <div style={{ marginTop: '14px' }}>
            <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe7b2;</span>通知人:
                    </div>
          <div className={styles.noticeUsersWrapper}>
            {/* 通知人添加与显示区域 */}
            <span style={{ flex: '1' }}>
              {
                !toNoticeList.length ? (
                  <div style={{ flex: '1', position: 'relative' }}>
                    <Dropdown overlayClassName={styles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlay={
                        <MenuSearchPartner
                          handleSelectedAllBtn={this.handleSelectedAllBtn}
                          invitationType='4'
                          invitationId={card_id}
                          listData={projectMemberData} keyCode={'user_id'} searchName={'name'} currentSelect={toNoticeList}
                          board_id={board_id}
                          chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                      }
                    >
                      {/* 添加通知人按钮 */}

                      <div className={styles.addNoticePerson}>
                        <Icon type="plus-circle" style={{ fontSize: '40px', color: '#40A9FF' }} />
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                    <div style={{ flex: '1', position: 'relative' }}>
                      <Dropdown overlayClassName={styles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                        overlay={
                          <MenuSearchPartner
                            handleSelectedAllBtn={this.handleSelectedAllBtn}
                            invitationType='4'
                            invitationId={card_id}
                            listData={projectMemberData} keyCode={'user_id'} searchName={'name'} currentSelect={toNoticeList} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                            board_id={board_id} />
                        }
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                          {/* 添加通知人按钮 */}
                          <div className={styles.addNoticePerson}>
                            <Icon type="plus-circle" style={{ fontSize: '40px', color: '#40A9FF' }} />
                          </div>


                          {toNoticeList.map((value) => {
                            const { avatar, name, user_name, user_id } = value
                            return (
                              <div style={{ display: 'flex', flexWrap: 'wrap' }} key={user_id}>

                                <div className={`${styles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 0', textAlign: 'center' }} key={user_id}>
                                  {avatar ? (
                                    <img style={{ width: '40px', height: '40px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                  ) : (
                                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                        <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                      </div>
                                    )}
                                  <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div>
                                  <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${styles.userItemDeleBtn}`}></span>
                                </div>

                              </div>
                            )
                          })}
                        </div>
                      </Dropdown>
                    </div>
                  )
              }
            </span>

          </div>
          <div style={{ marginTop: '16px' }}>
            <Checkbox checked={this.state.isOnlyNoticePersonsVisit} onChange={this.onChangeOnlyNoticePersonsVisit}>仅通知人可访问</Checkbox>
          </div>
          <div style={{ marginTop: '32px' }}>
            任务附件临时目录
                    </div>
          <div style={{ marginTop: '16px' }}>
            <div className={styles.selectFolderWapper}>
              <TreeSelect
                defaultValue={fileSavePath}
                value={fileSavePath}
                showSearch={false}
                style={{ width: 508 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="任务附件临时目录"
                allowClear
                treeDefaultExpandAll
                onChange={this.onChangeFileSavePath}
              >
                {this.renderSelectBoardFileTreeList()}
              </TreeSelect>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
// 只关联public弹窗内的数据
function mapStateToProps({ }) {
  return {}
}


