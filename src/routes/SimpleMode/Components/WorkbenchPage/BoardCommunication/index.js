import React, { Component } from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less'
import FileDetail from '@/routes/Technological/components/Workbench/CardContent/Modal/FileDetail/index'
import { Modal, Dropdown, Button, Select, Icon, TreeSelect, Tree } from 'antd';
import {
    checkIsHasPermission, checkIsHasPermissionInBoard, getSubfixName, openPDF, setBoardIdStorage, getOrgNameWithOrgIdFilter
} from "../../../../../utils/businessFunction";
const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;


const getEffectOrReducerByName = name => `technological/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`
const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`
const getEffectOrReducerByName_6 = name => `workbenchPublicDatas/${name}`

class BoardCommunication extends Component {
    state = {
        selectBoardFileModalVisible: false,
        selectBoardDropdownVisible: false,
        selectBoardFileDropdownVisible: false,
        boardTreeData: [],
        boardFileTreeData: [],
        currentfile: {},
        selectBoardFileCompleteDisabled: true,
        previewFileModalVisibile: false,

    };

    constructor(props) {
        super(props)
        const { dispatch } = this.props;
    }



    componentWillReceiveProps(nextProps) {
        const { dispatch, currentBoardDetail: oldCurrentBoardDetail } = this.props;
        const { currentBoardDetail } = nextProps;
        console.log(currentBoardDetail);
        if ((!oldCurrentBoardDetail && currentBoardDetail) || (oldCurrentBoardDetail && oldCurrentBoardDetail.board_id != currentBoardDetail.board_id)) {
            dispatch({
                type: 'simpleWorkbenchbox/getFileList',
                payload: {
                    folder_id: currentBoardDetail.folder_id,
                    board_id: currentBoardDetail.board_id
                }
            });
        }

    }

    getBoardTreeData = (projectList) => {
        let list = []
        projectList.map((board, key) => {
            list.push({ key: board.board_id, title: board.board_name, isLeaf: true });
        });
        return list;
    }

    getBoardFileTreeData = (data) => {
        let list = []
        let { folder_data = [], file_data = [] } = data;
        folder_data.map((folder, key) => {
            list.push({ key: folder.folder_id, title: folder.folder_name, type: 1 });
        });
        file_data.map((file, key) => {
            console.log(file);
            list.push({ key: file.file_id, title: file.file_name, type: 2, version_id: file.version_id, file_resource_id: file.file_resource_id, folder_id: file.belong_folder_id, isLeaf: true });
        });
        return list;
    }

    componentWillMount() {

    }

    selectBoardFile = () => {
        this.setState({
            selectBoardFileModalVisible: true
        });
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            selectBoardFileModalVisible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            selectBoardFileModalVisible: false,
        });
    };

    onChange = value => {
        console.log(value);
        this.setState({ value });
    };

    onSelectBoard = (keys, event) => {
        //console.log('Trigger Select', keys, event);
        const { dispatch } = this.props;
        console.log("boardid", keys[0]);

        dispatch({
            type: 'simpleWorkbenchbox/getBoardDetail',
            payload: {
                id: keys[0]
            }
        });
        this.setState({ selectBoardDropdownVisible: false });
    };

    onSelectFile = (keys, event) => {
        //console.log('Trigger Select', keys, event);
        const { dispatch } = this.props;
        console.log("fileid", keys[0]);
        console.log("selectedNodes", event.selectedNodes[0].props.title);

        this.setState({
            selectBoardFileDropdownVisible: false,
            currentfile: { fileId: keys[0], fileName: event.selectedNodes[0].props.title, versionId: event.selectedNodes[0].props.version_id, fileResourceId: event.selectedNodes[0].props.file_resource_id, folder_id: event.selectedNodes[0].props.folder_id },
            selectBoardFileCompleteDisabled: false
        });
    };

    handleSelectBoardDropdownVisibleChange = flag => {
        this.setState({ selectBoardDropdownVisible: flag });
    };

    handleSelectBoardFileDropdownVisibleChange = flag => {
        this.setState({ selectBoardFileDropdownVisible: flag });
    };

    onLoadFileTreeData = treeNode => {

        return (new Promise(resolve => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];
                this.setState({
                    boardFileTreeData: [...this.state.boardFileTreeData],
                    boardTreeData: [...this.state.boardTreeData],
                });
                resolve();
            }, 1000);
        }));
    }


    renderSelectBoardTreeList = () => {
        return (
            <TreeSelect
                style={{ width: 196 }}
                value={this.state.value}
                dropdownClassName={indexStyles.dropdownClass}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto', border: '0px' }}
                treeData={this.treeData}
                placeholder="Please select"
                treeDefaultExpandAll
                onChange={this.onChange}
            />
        );
    }
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item} selectable={false} >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });

    renderSelectBoardTreeList = () => {
        const { projectList = [] } = this.props;
        const boardTreeData = this.getBoardTreeData(projectList);
        return (
            <>
                <div style={{ backgroundColor: '#FFFFFF' }} className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}>
                    <Tree loadData={this.onLoadFileTreeData} onSelect={this.onSelectBoard}>
                        {this.renderTreeNodes(boardTreeData)}
                    </Tree>
                </div>
            </>
        );
    }

    renderSelectBoardFileTreeList = () => {
        const { boardFileListData = {} } = this.props;
        const boardFileTreeData = this.getBoardFileTreeData(boardFileListData);

        return (
            <>
                <div style={{ backgroundColor: '#FFFFFF' }} className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}>
                    <DirectoryTree loadData={this.onLoadData} onSelect={this.onSelectFile}>
                        {this.renderTreeNodes(boardFileTreeData)}
                    </DirectoryTree>
                </div>
            </>
        );
    }

    openFileModal = () => {
        const { dispatch } = this.props;
        const { currentBoardDetail = {} } = this.props;
        const { currentfile = {} } = this.state;
        console.log(currentfile);
        const { fileId, versionId, fileResourceId, folderId, fileName } = currentfile;
        const id = fileId;
        const { board_id } = currentBoardDetail;

       dispatch({
            type: 'workbenchFileDetail/getCardCommentListAll',
            payload: {
                id: id
            }
        });
        dispatch({
            type: 'workbenchFileDetail/getFileType',
            payload: {
                file_id: id
            }
        });

        this.setState({
            selectBoardFileModalVisible: false,
            previewFileModalVisibile: true
        });
        this.getFileModuleProps().updateFileDatas({
            seeFileInput: 'fileModule',
            board_id,
            filePreviewCurrentId: fileResourceId,
            currentParrentDirectoryId: folderId,
            filePreviewCurrentFileId: fileId,
            filePreviewCurrentVersionId: versionId, //file_id,
            pdfDownLoadSrc: '',
        });
        if (getSubfixName(fileName) == '.pdf') {
            dispatch({
                type: 'workbenchFileDetail/getFilePDFInfo',
                payload: {
                    id
                }
            })
        } else {
            this.getFileModuleProps().filePreview({ id: fileResourceId, file_id: id })
        }
        this.getFileModuleProps().fileVersionist({
            version_id: versionId, //file_id,
            isNeedPreviewFile: false,
        })
        this.updatePublicDatas({ board_id })
        this.getFileModuleProps().getBoardMembers({ id: board_id })


    }
    setPreviewFileModalVisibile() {
        this.setState({
            previewFileModalVisibile: !this.state.previewFileModalVisibile
        })
    }

    getFileModuleProps() {
        const { dispatch } = this.props;
        return {

            getBoardMembers (payload) {
                dispatch({
                    type: getEffectOrReducerByName_4('getBoardMembers'),
                    payload: payload
                })
            },        
            updateFileDatas(payload) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateDatas'),
                    payload: payload
                })
            },
            getFileList(params) {
                dispatch({
                    type: getEffectOrReducerByName('getFileList'),
                    payload: params
                })
            },
            fileCopy(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileCopy'),
                    payload: data
                })
            },
            fileDownload(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileDownload'),
                    payload: params
                })
            },
            fileRemove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileRemove'),
                    payload: data
                })
            },
            fileMove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileMove'),
                    payload: data
                })
            },
            fileUpload(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileUpload'),
                    payload: data
                })
            },
            fileVersionist(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileVersionist'),
                    payload: params
                })
            },
            recycleBinList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('recycleBinList'),
                    payload: params
                })
            },
            deleteFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteFile'),
                    payload: data
                })
            },
            restoreFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('restoreFile'),
                    payload: data
                })
            },
            getFolderList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getFolderList'),
                    payload: params
                })
            },
            addNewFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('addNewFolder'),
                    payload: data
                })
            },
            updateFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateFolder'),
                    payload: data
                })
            },
            filePreview(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('filePreview'),
                    payload: params
                })
            },
            getPreviewFileCommits(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getPreviewFileCommits'),
                    payload: params
                })
            },
            addFileCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('addFileCommit'),
                    payload: params
                })
            },
            deleteCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteCommit'),
                    payload: params
                })
            },
        }
    }

    updateDatasFile = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName_5('updateDatas'),
            payload: payload
        })
    }

    updateDatas = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName('updateDatas'),
            payload: payload
        })
    }
    updatePublicDatas = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName_6('updateDatas'),
            payload: payload
        })
    }

    render() {
        const { currentBoardDetail = {} } = this.props;
        const { currentfile = {} } = this.state;
        console.log("previewFileModalVisibile", this.state.previewFileModalVisibile);
        return (
            <div className={indexStyles.boardCommunicationWapper}>
                {
                    this.state.previewFileModalVisibile &&
                    <FileDetail {...this.props} updateDatasFile={this.updateDatasFile} updatePublicDatas={this.updatePublicDatas} {...this.getFileModuleProps()} offsetTopDeviation={85} modalTop={0} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)} />
                }
                {
                    !this.state.previewFileModalVisibile && (
<div className={indexStyles.indexCoverWapper}>
                        <div className={indexStyles.icon}>
                            <img src='/src/assets/simplemode/communication_cover_icon@2x.png' style={{ width: '80px', height: '84px' }} />
                        </div>
                        <div className={indexStyles.descriptionWapper}>
                            <div className={indexStyles.linkTitle}>选择 <a className={indexStyles.alink} onClick={this.selectBoardFile}>项目文件</a> 或 <a className={indexStyles.alink}>点击上传</a> 文件</div>
                            <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                        </div>
                    </div>
)}

                <Modal
                    width={248}
                    bodyStyle={{ padding: '0px' }}
                    footer={
                        <div style={{ width: '100%' }}>
                            <Button type="primary" disabled={this.state.selectBoardFileCompleteDisabled} style={{ width: '100%' }} onClick={this.openFileModal}>完成</Button>
                        </div>
                    }
                    title={<div style={{ textAlign: 'center' }}>{'选择文件'}</div>}
                    visible={this.state.selectBoardFileModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className={`${indexStyles.selectWapper} ${indexStyles.borderBottom}`}>
                        <Dropdown
                            overlay={this.renderSelectBoardTreeList}
                            trigger={['click']}
                            className={`${indexStyles.dropdownSelect}`}
                            onVisibleChange={this.handleSelectBoardDropdownVisibleChange}
                            visible={this.state.selectBoardDropdownVisible}>
                            <div className={indexStyles.dropdownLinkWapper}>
                                <span style={{ display: 'block', width: '28px' }}>项目</span>
                                <span className="ant-dropdown-link" style={{ display: 'block', width: '196px' }}>
                                    {currentBoardDetail.board_id ? currentBoardDetail.board_name : '请选择'} <Icon type="down" />
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                    <div className={indexStyles.selectWapper}>
                        <Dropdown
                            overlay={this.renderSelectBoardFileTreeList}
                            trigger={['click']}
                            className={`${indexStyles.dropdownSelect}`}
                            onVisibleChange={this.handleSelectBoardFileDropdownVisibleChange}
                            visible={this.state.selectBoardFileDropdownVisible}>
                            <div className={indexStyles.dropdownLinkWapper}>
                                <span style={{ display: 'block', width: '28px' }}>文件</span>
                                <span className="ant-dropdown-link" style={{ display: 'block', width: '196px' }}>
                                    {currentfile.fileId ? currentfile.fileName : '请选择'} <Icon type="down" />
                                </span>
                            </div>
                        </Dropdown>
                    </div>

                </Modal>


            </div>
        )
    }

}


function mapStateToProps({
    workbenchFileDetail,
    simpleWorkbenchbox: {
        boardListData,
        currentBoardDetail,
        boardFileListData
    },
    workbench: {
        datas: { projectList }
    },
}) {
    const modelObj = {
        datas: { ...workbenchFileDetail['datas'] }
    }
    return {
        model: modelObj,
        projectList,
        boardListData,
        currentBoardDetail,
        boardFileListData
    }
}
export default connect(mapStateToProps)(BoardCommunication)

