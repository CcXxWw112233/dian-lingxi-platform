import react, { Component } from 'react';
import {
    REQUEST_DOMAIN,
    REQUEST_DOMAIN_FILE,
    UPLOAD_FILE_SIZE,
    FILE_TYPE_UPLOAD_WHITELISTED
} from "@/globalset/js/constant";
import {
    setUploadHeaderBaseInfo
} from "@/utils/businessFunction";
import Cookies from 'js-cookie'
import coverIconSrc from '@/assets/simplemode/communication_cover_icon@2x.png';
import { Upload, Button, Icon, message } from 'antd';
import indexStyles from './index.less';

const { Dragger } = Upload;

class UploadTemporaryFile extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    uploadProps = ()=>{
        return {
            name: 'file',
            withCredentials: true,
            // action: `${REQUEST_DOMAIN}/organization/logo_upload`,
            action: `${REQUEST_DOMAIN_FILE}/file/upload`,
            data: {
                // board_id,
                // folder_id: current_folder_id,
                // type: '1',
                // upload_type: '1'
                test: 'test'
            },
            headers: {
                Authorization: Cookies.get('Authorization'),
                refreshToken: Cookies.get('refreshToken'),
                ...setUploadHeaderBaseInfo({}),
            },
            beforeUpload(e) {
                // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD, board_id)) {
                //     message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                //     return false
                // }
                if (e.size == 0) {
                    message.error(`不能上传空文件`)
                    return false
                } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
                    message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
                    return false
                }
                let loading = message.loading('正在上传...', 0)
            },
            // beforeUpload(file, fileList) {
            //     if (fileList.length > 1) {
            //         message.error("项目交流一次只能上传一个文件");
            //         //console.log(fileList);
            //         return false;
        
            //     }
        
            //     const { dispatch, simplemodeCurrentProject = {} } = this.props;
            //     if (file.size == 0) {
            //         message.error(`不能上传空文件`)
            //         return false
            //     } else if (file.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
            //         message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
            //         return false
            //     }
            //     const lastIndex = file.name.lastIndexOf('.');
            //     //console.log(file.name.substr(lastIndex) + 1);
            //     if (!file.name || FILE_TYPE_UPLOAD_WHITELISTED.indexOf(file.name.substr(lastIndex + 1)) == -1) {
            //         message.error('暂不支持该文件格式上传')
            //         return false
            //     }
            //     this.setState(state => ({
            //         awaitUploadFile: file,
            //         selectBoardFileModalVisible: true,
            //         is_selectFolder: true,
            //         dragEnterCaptureFlag: false,
            //         currentfile: {}
            //     }));
        
            //     let currentBoardDetail = {}
            //     if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
            //         currentBoardDetail = { ...simplemodeCurrentProject };
            //         dispatch({
            //             type: 'simpleWorkbenchbox/updateDatas',
            //             payload: {
            //                 currentBoardDetail: currentBoardDetail
            //             }
            //         });
            //     }
        
            //     dispatch({
            //         type: 'simpleBoardCommunication/updateDatas',
            //         payload: {
            //             is_file_tree_loading: true
            //         }
            //     });
        
        
            //     if (currentBoardDetail.board_id) {
            //         dispatch({
            //             type: 'simpleWorkbenchbox/getFolderList',
            //             payload: {
            //                 board_id: currentBoardDetail.board_id
            //             }
            //         });
        
            //     }
            //     return false;
            // },
            onChange({ file, fileList, event }) {
                if (file.status === 'uploading') {

                } else {
                    // message.destroy()
                }
                if (file.status === 'done') {

                    if (file.response && file.response.code == '0') {
                        message.success(`上传成功。`);
                        // that.props.getFolderFileList({ id: current_folder_id })
                        // isShowSub ? getSubFileData(current_folder_id, board_id) : queryCommunicationFileData();
                    } else {
                        message.error(file.response && file.response.message || '上传失败');
                    }
                } else if (file.status === 'error') {
                    message.error(`上传失败。`);
                    setTimeout(function () {
                        message.destroy()
                    }, 2000)
                }
            },
        }

    }

    render(){
        const {
            isRightBarShowFileList,
            dragEnterCaptureFlag
        } = this.props;

        // const uploadProps = {
        //     name: 'file',
        //     withCredentials: true,
        //     action: `${REQUEST_DOMAIN}/organization/logo_upload`,
        //     headers: {
        //       Authorization: Cookies.get('Authorization'),
        //       refreshToken: Cookies.get('refreshToken'),
        //       ...setUploadHeaderBaseInfo({}),
        //     },
        //     beforeUpload(e) {
        //       if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_EDIT)) {
        //         message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
        //         return false
        //       }
        //       if (e.size == 0) {
        //         message.error(`不能上传空文件`)
        //         return false
        //       } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
        //         message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
        //         return false
        //       }
        //     },
        //     onChange({ file, fileList, event }) {
        //       // console.log(file)
        //       if (file.status === 'uploading') {
        //         that.setState({
        //           uploading: true
        //         })
        //       }
        //       if (file.status !== 'uploading') {
        //         that.setState({
        //           uploading: false
        //         })
        //         if (file.response && file.response.data) {
        //           that.storeChange('logo', file.response.data.logo)
        //           that.storeChange('logo_id', file.response.data.logo_id)
        //         }
        //       }
        //       if (file.status === 'done') {
        //         message.success(`上传成功。`);
        //         that.setState({
        //           uploading: false
        //         })
        //       } else if (file.status === 'error') {
        //         message.error(`上传失败。`);
        //         that.setState({
        //           uploading: false
        //         })
        //       }
        //       if (file.response && file.response.code == '0') {
        //         const obj = { ...currentOrganizationInfo }
        //         obj.logo = file.response.data.url
        //         that.props.updateDatas({
        //           currentOrganizationInfo: obj
        //         })
        //       }
        //     },
        //   };


        return(
            <div className={`${indexStyles.temporaryFile} ${isRightBarShowFileList ? indexStyles.changeContentWidth : null}`}>
                <div className={indexStyles.keepMiddleBox}>
                    {/* 上传本地文件 */}
                    {/* <div className={indexStyles.draggerContainerStyle}>
                        <Dragger multiple={false} {...this.props.getDraggerProps()} beforeUpload={this.props.onBeforeUpload}>
                            <div className={`${indexStyles.indexCoverWapper} ${dragEnterCaptureFlag ? indexStyles.draging : ''}`}>

                                {
                                    dragEnterCaptureFlag ? (
                                        <div className={indexStyles.iconDescription}>
                                            <img src={uploadIconSrc} style={{ width: '48px', height: '48px' }} />
                                            <span className={indexStyles.iconDescription}>松开鼠标左键即可上传文件</span>
                                        </div>
                                    ) : (
                                            <>
                                                <div className={indexStyles.icon}>
                                                    <img src={coverIconSrc} style={{ width: '80px', height: '84px' }} />
                                                </div>
                                                <div className={indexStyles.descriptionWapper}>
                                                    <div className={indexStyles.linkTitle}>
                                                        // 选择 <a className={indexStyles.alink} onClick={this.selectBoardFile}>项目文件</a> 或  // 
                                                        <a className={indexStyles.alink}>点击上传</a> 文件</div>
                                                    <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                                                </div>
                                            </>
                                        )}

                            </div>
                        </Dragger>
                    </div> */}

                    <div className={indexStyles.draggerContainerStyle}>
                        <div className={indexStyles.icon}>
                            <img src={coverIconSrc} style={{ width: '80px', height: '84px' }} />
                        </div>
                        <div className={indexStyles.descriptionWapper}>
                            <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                            <div className={indexStyles.linkTitle}>
                                {/* <a className={indexStyles.alink}>点击上传</a> 文件 */}
                                <Upload {...this.uploadProps()} showUploadList={false}>
                                    <Button>
                                    <Icon type="upload" />上传本地文件
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                    </div>

                    {/* 临时文件保存组件 */}
                    {/* <TemporaryFilePart /> */}

                </div>
                

                {/* {
                    !this.state.previewFileModalVisibile && (
                        <div className={`${indexStyles.draggerContainerStyle} ${isRightBarShowFileList ? indexStyles.changeDraggerWidth : null}`}>
                            <Dragger multiple={false} {...this.getDraggerProps()} beforeUpload={this.onBeforeUpload}>
                                <div className={`${indexStyles.indexCoverWapper} ${dragEnterCaptureFlag ? indexStyles.draging : ''}`}>

                                    {
                                        dragEnterCaptureFlag ? (
                                            <div className={indexStyles.iconDescription}>
                                                <img src={uploadIconSrc} style={{ width: '48px', height: '48px' }} />
                                                <span className={indexStyles.iconDescription}>松开鼠标左键即可上传文件</span>
                                            </div>
                                        ) : (
                                                <>
                                                    <div className={indexStyles.icon}>
                                                        <img src={coverIconSrc} style={{ width: '80px', height: '84px' }} />
                                                    </div>
                                                    <div className={indexStyles.descriptionWapper}>
                                                        <div className={indexStyles.linkTitle}>
                                                            // 选择 <a className={indexStyles.alink} onClick={this.selectBoardFile}>项目文件</a> 或  //
                                                            <a className={indexStyles.alink}>点击上传</a> 文件</div>
                                                        <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                                                    </div>
                                                </>
                                            )}

                                </div>
                            </Dragger>
                        </div>
                    )} */}
            </div>
        )
    }
}

export default UploadTemporaryFile;