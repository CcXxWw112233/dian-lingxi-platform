import React, { Component } from 'react';
import { connect } from 'dva';
import { Collapse, Icon, message, Tree, Button } from 'antd';
import { getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard } from '@/utils/businessFunction';
import { getFileList } from '@/services/technological/file.js'
import { isApiResponseOk } from '@/utils/handleResponseData';
import styles from './index.less';
import { log } from 'util';

const { Panel } = Collapse;
const { TreeNode, DirectoryTree } = Tree;

@connect(mapStateToProps)

export default class CommunicationTreeList extends Component{
    constructor(props){
        super(props);
        this.state = {
            // collapseActiveKeys: [], // 折叠面板展示列keys
            // isVisibleFileList: true, // 是否显示/隐藏文件列表，默认显示
            // isShowSub: false, // 当前组件显示，false 第一级组件 true 子集组件
            // fileData: null, // 子组件数据
            // currentSubId: '', // 当前子集文件id
            // currentBoardId: '', // 当前子集文件所属项目id
            // currentBoardName: '', // 当前子集文件名
            // bread_paths: {}, // 面包屑路径
            // first_paths_item: {}, // 默认一级路径
            // currentOrg_id: '', // 当前组织id
            expandedKeys: [], // （受控）展开指定的树节点
            // autoExpandParent: false, // 是否自动展开父节点
            selectedKeys: [], // 设置选中的树节点
        }
    }

    componentDidMount(){
        const { isVisibleFileList } = this.props;
        const {
            // is_show_board_file_area,
            boards_flies = [],
        } = this.props;
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

    // 点击折叠面板
    // collapseOnchange=(keys,data)=>{
    //     // this.setState({ collapseActiveKeys: keys });
    //     this.props.setCollapseActiveKeys(keys);
    //     // this.props.getCommunicationFolderList(keys); // 获取项目交流目录下子集数据
    // }


    // 渲染当前项目子节点树
    renderTreeNodes = communicationSubFolderData =>
    communicationSubFolderData.map(item => {
      if (item.child_data) {
        return (
          <TreeNode title={item.folder_name} key={item.folder_id} dataRef={item}>
            {this.renderTreeNodes(item.child_data)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.folder_name} key={item.folder_id} {...item} />;
    });

    // 展开/收起节点时触发
    onExpand = expandedKeys => {
        // console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    };

    // 点击树节点触发
    onSelect =(first_item, selectedKeys, info)=> {
        const currentInfo = info.selectedNodes[0].props.dataRef;
        this.setState({ selectedKeys });
        this.props.onSelectTree(currentInfo,first_item);
    }

    render(){
        const {
            // collapseActiveKeys,
            // isVisibleFileList,
            // isShowSub,
            // fileData,
            // currentSubId,
            // currentBoardId,
            // currentBoardName,
            // currentOrg_id,
            // bread_paths,
            // first_paths_item,
            selectedKeys
        } = this.state;
        const {
            boards_flies = [],
            is_show_org_name,
            is_all_org,
            // currentUserOrganizes,
            // selectBoardFileModalVisible,
            isVisibleFileList,
            communicationSubFolderData=[],
            collapseActiveKeys,
        } = this.props;
        const isShowCompanyName = is_show_org_name && is_all_org; // 是否显示归属组织
        // console.log('subcom...',communicationSubFolderData);
        const { child_data = [] } = communicationSubFolderData;
        return(
            <div className={styles.communicationTreeList}>
                {/* 这里是左侧的项目交流列表 */}
                {
                    isVisibleFileList && (
                        <div className={styles.fileList}>
                            <div className={`${styles.fileListContent} ${isShowCompanyName && styles.arrowPosition}`}>
                                <Collapse
                                    bordered={false}
                                    accordion
                                    defaultActiveKey={collapseActiveKeys}
                                    // activeKey={this.setNewActiveKeys(collapseActiveKeys)}
                                    // activeKey={collapseActiveKeys}
                                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                    onChange={this.props.setCollapseActiveKeys}
                                >
                                    {
                                        boards_flies && boards_flies.map((item, key) => {
                                            const { board_name, id, type, file_data = [] } = item;
                                            return(
                                                // <Panel header={this.showHeader(item, isShowCompanyName)} key={`${item.id}_${item.file_data.length}`} onClick={()=>this.panelOnClick(item)}>
                                                <Panel header={this.showHeader(item, isShowCompanyName)} key={`${item.id}`} onClick={()=>this.panelOnClick(item)}>
                                                    {
                                                        child_data && (
                                                            <DirectoryTree
                                                                multiple
                                                                defaultExpandAll
                                                                // onSelect={()=>this.onSelect(first_item)}
                                                                onSelect={this.onSelect.bind(this,item)}
                                                                onExpand={this.onExpand}
                                                                // expandedKeys={this.state.expandedKeys}
                                                                // autoExpandParent={this.state.autoExpandParent}
                                                                // selectedKeys={this.state.selectedKeys}
                                                            >
                                                                { this.renderTreeNodes(child_data) }
                                                            </DirectoryTree>
                                                        )
                                                    }
                                                    
                                                </Panel>
                                            )
                                        })
                                    }
                                </Collapse>
                            </div>
                        </div>
                    )
                }

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
    // projectCommunication:{
    //     count,
    // }
    projectCommunication:{
        currentBoardId,
        communicationProjectListData,
        communicationSubFolderData,
    }
}) {
    return {
        is_show_board_file_area,
        boards_flies,
        currentUserOrganizes,
        is_show_org_name,
        is_all_org,
        // count
        communicationSubFolderData,
    }
}