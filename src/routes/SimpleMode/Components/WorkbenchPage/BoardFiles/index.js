import React, { Component } from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less'
import FileDetail from '@/routes/Technological/components/Workbench/CardContent/Modal/FileDetail/index'
import FileIndex from '@/routes/Technological/components/ProjectDetail/FileModule'
import { Modal, Dropdown, Button, Select, Icon, TreeSelect, Tree } from 'antd';

const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;
import {
    checkIsHasPermission, checkIsHasPermissionInBoard, getSubfixName, openPDF, setBoardIdStorage, getOrgNameWithOrgIdFilter
} from "../../../../../utils/businessFunction";
import { height } from 'window-size';

class BoardFiles extends Component {
    state = {
        boardSelectVisible: true,
        boardFileContentVisible: false,

    };

    constructor(props) {
        super(props)
        //const { dispatch } = this.props;
    }



    componentWillReceiveProps(nextProps) {


    }

    componentWillMount() {
        console.log("BoardFiles进来初始化数据");
        const { dispatch } = this.props;
        dispatch({
            type: 'simplemode/getOrgBoardData'
        });
    }

    openBoardFiles = (board) => {
        console.log(board);
        this.setState({
            boardSelectVisible: false,
            boardFileContentVisible: true
        });

        this.initialget(board.id);

    }

    initialget(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'simpleWorkbenchbox/loadBoardFileInitData',
            payload: {
                id
            }
        });
    }

    render() {
        const { dispatch } = this.props
        const updateDatasFile = (payload) => {
            dispatch({
                type: 'projectDetailFile/updateDatas',
                payload
            })
        }
        const { boardSelectVisible, boardFileContentVisible } = this.state;
        const { orgBoardList = [] } = this.props;
        const workbenchBoxContentElementInfo = document.getElementById('container_workbenchBoxContent');
        let contentHeight = workbenchBoxContentElementInfo ? workbenchBoxContentElementInfo.offsetHeight : 0;
        return (
            <div className={indexStyles.boardFilesContainer}>
                {
                    boardSelectVisible &&
                    <div className={indexStyles.boardSelectOutWapper} style={{ maxHeight: contentHeight + 'px' }}>
                        <div className={indexStyles.boardSelectWapper}>
                            {
                                orgBoardList.map((org, orgkey) => {

                                    return org.board_list && org.board_list.length > 0 && (
                                        <div key={org.id}>
                                            <div className={indexStyles.groupName}>{org.name}</div>
                                            <div className={indexStyles.boardItemWapper}>
                                                {
                                                    org.board_list.map((board, key) => {
                                                        return (
                                                            <div key={board.id} className={indexStyles.boardItem} onClick={e => this.openBoardFiles(board)}>
                                                                <i className={`${globalStyles.authTheme} ${indexStyles.boardIcon}`}>&#xe67d;</i>
                                                                <span className={indexStyles.boardName}>{board.name}</span>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                }


                {
                    boardFileContentVisible &&
                    <div className={indexStyles.boardFileContentWapper}>
                        <FileIndex {...this.props}/>
                    </div>
                }

            </div>
        );
    }

}


function mapStateToProps({
    modal, projectDetail, projectDetailTask, projectDetailFile, projectDetailProcess, loading,
    simpleWorkbenchbox: {
        boardListData,
        currentBoardDetail,
        boardFileListData
    },
    simplemode: {
        orgBoardList
    }
}) {

    const modelObj = {
        datas: { ...projectDetail['datas'], ...projectDetailTask['datas'], ...projectDetailFile['datas'], ...projectDetailProcess['datas'], }
      }

    return {
        modal, model: modelObj,loading,
        boardListData,
        currentBoardDetail,
        boardFileListData,
        orgBoardList
    }
}
export default connect(mapStateToProps)(BoardFiles)


