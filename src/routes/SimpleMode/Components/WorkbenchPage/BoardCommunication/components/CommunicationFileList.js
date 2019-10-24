import React, { Component } from 'react';
import { connect } from 'dva';
import { Collapse, Icon, message } from 'antd';
import { getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard } from '../../../../../../utils/businessFunction';
// import FileListContent from './FileListContent';
import { getFileList } from '@/services/technological/file.js'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';
import CommunicationFileItem from './CommunicationFileItem';
import SubFileItem from './CommunicationFileItem/SubFileItem';
import styles from './CommunicationFileList.less';
import { log } from 'util';

const { Panel } = Collapse;

@connect(mapStateToProps)

export default class CommunicationFileList extends Component{
    constructor(props){
        super(props);
        // const first_paths_item = {
        //     name: board_name,
        //     id: board_id,
        //     type: 'board',
        //     folder_id
        // }
        this.state = {
            collapseActiveKeys: [], // 折叠面板展示列keys
            visible: true, // 是否显示/隐藏文件列表，默认显示
            isShowSub: false, // 当前组件显示，false 第一级组件 true 子集组件
            fileData: null, // 子组件数据
            currentSubId: '', // 当前子集文件id
            currentBoardId: '', // 当前子集文件所属项目id
            currentBoardName: '', // 当前子集文件名
            bread_paths: {}, // 面包屑路径
            first_paths_item: {}, // 默认一级路径
            currentOrg_id: '', // 当前组织id
        }
    }

    componentDidMount(){
        const { visible } = this.props;
        const {
            // is_show_board_file_area,
            boards_flies = [],
        } = this.props;
    }

    // 设置第一个路径
    setFirstPaths=(first_paths_item, bread_paths)=>{
        this.setState({
            first_paths_item: first_paths_item,
            bread_paths: bread_paths,
            isShowSub: false,
        });
    }


    // 显示隐藏文件列表
    isVisible = () => {
        const { visible } = this.state;
        this.setState({ visible: !this.state.visible});
    }

    // 显示项目目录名（一级）
    showHeader=(item, isShowCompanyName)=>{
        const {currentUserOrganizes = []} = this.props;
        return(
            <div className={styles.panelHeader}>
                <div className={styles.name}>{item.board_name}</div>
                {
                    isShowCompanyName &&
                    (
                        <div className={styles.org_name}>
                            #{getOrgNameWithOrgIdFilter(item.org_id, currentUserOrganizes)}
                        </div>
                    )
                }
            </div>
        )
        
    }


    // 显示一级目录组件还是子集组件
    showWhatComponent =(type, {path_item = {}})=>{
        const { id, board_id, name} = path_item;
        if(type="2"){
            this.setState({
                isShowSub: true,
                currentSubId: id,
                // currentBoardId: first_paths_item.id,
                currentBoardName: name,
            }, ()=>{
                // this.getSubFileData(id,board_id);
                this.changeBreadPath(path_item);
            });
        }
    }


    // 更新路径
    // changeBreadPath=({path_item = {}})=>{
    changeBreadPath=(path_item)=>{
        const { bread_paths = [], first_paths_item } = this.state;
        const { id, type } = path_item;
        let new_bread_paths = [...bread_paths]
        if (type == 'board') { //项目
            new_bread_paths = [first_paths_item]
            this.getBoardFileList()
        } else { //文件夹
            const index = bread_paths.findIndex(item => item.id == id)
            if (index == -1) { //如果不存在就加上
                new_bread_paths.push(path_item)
            } else { //如果存在就截取
                new_bread_paths = bread_paths.slice(0, index + 1)
            }
            // debugger;
            this.getSubFileData(id, first_paths_item.id);
        }
        this.setState({
            bread_paths: new_bread_paths
        })
    }

    getBoardFileList = () => { // 获取项目根目录文件列表
        const { first_paths_item: { folder_id = ' ' } } = this.state
        this.getSubFileData({ id: folder_id })
    }

    // 获取子集组件数据
    getSubFileData = async (folderId, boardId)=>{
        const res = await getFileList({ folder_id: folderId, board_id: boardId });
        if (isApiResponseOk(res)) {
            const data = res.data;
            const files = data.file_data.map(item => {
                let new_item = { ...item }
                new_item['name'] = item['file_name']
                new_item['id'] = item['file_id']
                return new_item
            });
            const folders = data.folder_data.map(item => {
                let new_item = { ...item }
                new_item['name'] = item['folder_name']
                new_item['id'] = item['folder_id']
                return new_item
            });
            const file_data = [].concat(folders, files);
            this.setState({
                fileData: file_data
            });

        } else {
            message.error('获取数据失败');
        }
    }

    panelOnClick=(item)=>{
        this.setState({currentOrg_id: item.org_id});
        // debugger;
    }

    // 返回上一个
    goBackPrev=(folderId)=>{
        const { bread_paths = [], first_paths_item } = this.state;
        const index = bread_paths.findIndex(item => item.id === folderId);
        let currentPath = bread_paths[index-1];
        if(currentPath.firstType && currentPath.firstType == 'first'){
            // console.log('回去第一层');
            this.setState({
                isShowSub: false,
            }, ()=>{
                this.props.queryCommunicationFileData();
            });
        } else{
            this.setState({
                currentBoardName: currentPath.name,
                currentSubId: currentPath.id,
            });
            this.getSubFileData(currentPath.id, first_paths_item.id);
        }
    }

    collapseOnchange=(keys)=>{
        console.log('eee', keys);
        this.setState({ collapseActiveKeys: keys });
    }

    render(){
        const {
            collapseActiveKeys,
            visible,
            isShowSub,
            fileData,
            currentSubId,
            currentBoardId,
            currentBoardName,
            currentOrg_id,
            bread_paths,
            first_paths_item,
        } = this.state;
        const {
            boards_flies = [],
            is_show_org_name,
            is_all_org,
            currentUserOrganizes,
            selectBoardFileModalVisible,
        } = this.props;
        // console.log('新的数据', {boards_flies})
        const isShowCompanyName = is_show_org_name && is_all_org; // 是否显示归属组织
        return(
            <div className={styles.communicationFileList}>
                {/* 这里是左侧的项目交流列表 */}
                {
                    visible && (
<div className={styles.fileList}>
                        <div className={styles.listHeaderName}>文件列表</div>
                        {/* 文件列表 */}
                        <div className={`${styles.fileListContent} ${isShowCompanyName && styles.arrowPosition}`}>
                            {
                                !isShowSub ? (
<Collapse
                                    bordered={false}
                                    // defaultActiveKey={boards_flies && boards_flies[0] && [boards_flies[0].id]}
                                    // defaultActiveKey={collapseActiveKeys}
                                    activeKey={collapseActiveKeys}
                                    // activeKey={["1184383015095242752_7"]}
                                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                    onChange={this.collapseOnchange.bind(this)}
                                >
                                    {
                                        boards_flies && boards_flies.map((item, key) => {
                                            const { board_name, id, type, file_data = [] } = item;
                                            return(
                                                // <Panel header={this.showHeader(item,isShowCompanyName)} key={item.id} onClick={()=>this.panelOnClick(item)}>
                                                <Panel header={this.showHeader(item, isShowCompanyName)} key={`${item.id}_${item.file_data.length}`} onClick={()=>this.panelOnClick(item)}>
                                                    <CommunicationFileItem
                                                        isShowSub={isShowSub}
                                                        changeIsShowSub={this.changeIsShowSub}
                                                        itemValue={item}
                                                        item={key}
                                                        board_id={id}
                                                        board_name={board_name}
                                                        showWhatComponent={this.showWhatComponent}
                                                        setFirstPaths={this.setFirstPaths}
                                                        getSubFileData={this.getSubFileData}
                                                        queryCommunicationFileData={this.props.queryCommunicationFileData}
                                                        showUpdatedFileDetail={this.props.showUpdatedFileDetail}
                                                        // setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
                                                        // fileDetailModalDatas={this.props.fileDetailModalDatas}
                                                        {...this.props}
                                                    />
                                                </Panel>
                                            )
                                        })
                                    }
                                </Collapse>
): (
<div className={styles.fileListContent}>
                                    <SubFileItem
                                        isShowSub={isShowSub}
                                        fileData={fileData}
                                        folderId={currentSubId}
                                        boardId={first_paths_item.id}
                                        boardName={currentBoardName}
                                        currentOrg_id={currentOrg_id}
                                        bread_paths={bread_paths}
                                        currentUserOrganizes={currentUserOrganizes}
                                        isShowCompanyName={isShowCompanyName}
                                        getSubFileData={this.getSubFileData}
                                        showHeader={this.showHeader}
                                        showWhatComponent={this.showWhatComponent}
                                        goBackPrev={this.goBackPrev}
                                        queryCommunicationFileData={this.props.queryCommunicationFileData}
                                        showUpdatedFileDetail={this.props.showUpdatedFileDetail}
                                    />
                                </div>
)}
                        </div>
                    </div>
)}
                <div
                    className={styles.operationBtn}
                    style={{ left: visible ? '299px' : '0'}}
                    onClick={this.isVisible}
                >
                    <Icon type="left" />
                </div>
            </div>
        );
    }
}

function mapStateToProps({
    gantt: {
        datas: {
            is_show_board_file_area,
            boards_flies = []
        }
    },
    technological: {
        datas: {
            currentUserOrganizes = [],
            is_show_org_name,
            is_all_org
        }
    },
}) {
    return {
        is_show_board_file_area,
        boards_flies,
        currentUserOrganizes,
        is_show_org_name,
        is_all_org
    }
}