import React, { Component } from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less'
import { Modal, Dropdown, Button, Select, Icon, TreeSelect, Tree } from 'antd';
const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;

class BoardCommunication extends Component {
    state = {
        selectBoardFileModalVisible: false,
        value: undefined,
    };

    constructor(props) {
        super(props)
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

    treeData = [
        {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
                {
                    title: 'Child Node1',
                    value: '0-0-1',
                    key: '0-0-1',
                },
                {
                    title: 'Child Node2',
                    value: '0-0-2',
                    key: '0-0-2',
                },
            ],
        },
        {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
        },
    ];

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

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
    renderSelectBoardFileTreeList = () => {
        // return(
        //     <>
        //     </>
        // )
        return (
            <>
                <div style={{ backgroundColor: '#FFFFFF' }} className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}>
                    <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                        <TreeNode title="parent 0" key="0-0">
                            <TreeNode title="leaf 0-0ffffffffffffffffffffffffffffffffffffffffffff" key="0-0-0" isLeaf />
                            <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                        </TreeNode>
                        <TreeNode title="parent 1" key="0-1">
                            <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                            <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                        </TreeNode>
                        <TreeNode title="parent 2" key="0-2">
                            <TreeNode title="leaf 2-0" key="0-2-0" isLeaf />
                            <TreeNode title="leaf 2-1" key="0-2-1" isLeaf />
                        </TreeNode>
                        <TreeNode title="parent 3" key="0-3">
                            <TreeNode title="leaf 3-0" key="0-3-0" isLeaf />
                            <TreeNode title="leaf 3-1" key="0-3-1" isLeaf />
                        </TreeNode>
                    </DirectoryTree>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className={indexStyles.boardCommunicationWapper}>
                <div className={indexStyles.indexCoverWapper}>
                    <div className={indexStyles.icon}>
                        <img src='/src/assets/simplemode/communication_cover_icon@2x.png' style={{ width: '80px', height: '84px' }} />
                    </div>
                    <div className={indexStyles.descriptionWapper}>
                        <div className={indexStyles.linkTitle}>选择 <a className={indexStyles.alink} onClick={this.selectBoardFile}>项目文件</a> 或 <a className={indexStyles.alink}>点击上传</a> 文件</div>
                        <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                    </div>
                </div>

                <Modal
                    width={248}
                    bodyStyle={{ padding: '0px' }}
                    footer={
                        <div style={{ width: '100%' }}>
                            <Button type="primary" disabled style={{ width: '100%' }}>完成</Button>
                        </div>
                    }
                    title={
                        <div style={{ textAlign: 'center' }}>{'选择文件'}</div>
                    }
                    visible={this.state.selectBoardFileModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className={`${indexStyles.selectWapper} ${indexStyles.borderBottom}`}>
                        <Dropdown overlay={this.renderSelectBoardFileTreeList} trigger={['click']} className={`${indexStyles.dropdownSelect}`}>
                            <div className={indexStyles.dropdownLinkWapper}>
                                <span style={{ display: 'block', width: '28px' }}>项目</span>
                                <span className="ant-dropdown-link" style={{ display: 'block', width: '196px' }}>
                                    请选择 <Icon type="down" />
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                    <div className={indexStyles.selectWapper}>
                        <Dropdown overlay={this.renderSelectBoardFileTreeList} trigger={['click']} className={`${indexStyles.dropdownSelect}`}>
                            <div className={indexStyles.dropdownLinkWapper}>
                                <span style={{ display: 'block', width: '28px' }}>文件</span>
                                <span className="ant-dropdown-link" style={{ display: 'block', width: '196px' }}>
                                    请选择 <Icon type="down" />
                                </span>
                            </div>
                        </Dropdown>
                    </div>

                </Modal>
            </div>
        )
    }

}

export default connect(({ }) => ({}))(BoardCommunication)
