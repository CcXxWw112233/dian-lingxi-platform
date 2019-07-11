import React, { Component } from 'react';
import { Menu, Dropdown, Input, Icon, Divider } from 'antd';
import { connect } from 'dva/index';
import styles from './index.less';

import globalStyles from '@/globalset/css/globalClassName.less'

class DropdownSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            addNew: false,
            inputValue: '',
            filteredList: this.props.list ? this.props.list : []
        };
    }

    handleSeletedMenuItem = (item) => {

    }

    renderAddMenuItem = (item) => {
        return (
            <Menu.Item key={item.id} style={{
                lineHeight: '30px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                boxShadow: 'none',
                borderRadius: '0',
                border: '0',
                borderRight: '0px!important',
            }}>
                <span onClick={item.selectHandleFun.bind(this, item)} style={{ color: '#1890FF' }}>
                    <Icon type={item.icon} style={{ fontSize: '17px' }} /><span style={{ paddingLeft: '10px' }}>{item.name}</span>
                </span>
            </Menu.Item>
        );
    }

    renderMenuItem = (filteredList) => {
        return filteredList.map((item, index) => (
            <Menu.Item key={item.id} style={{
                lineHeight: '30px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                boxShadow: 'none',
                borderRadius: '0',
                border: '0',
                borderRight: '0px!important',
            }}>
                <span onClick={this.handleSeletedMenuItem.bind(this, item)}>
                    {item.name}<span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>#{item.parentName}</span>
                </span>
            </Menu.Item>
        ));
    };



    content() {
        const addBoard = () => {
            const {dispatch} = this.props;
            console.log("Menu");
            dispatch({
                type: 'simplemode/updateDatas',
                payload: {
                    simpleHeaderVisiable: true,
                    myWorkbenchBoxsVisiable: false,
                    wallpaperSelectVisiable: true,
                    workbenchBoxSelectVisiable: false,
                    createNewBoardVisiable: true,
                    setWapperCenter: true,
                }
            });

        };
        const list = [{ 'name': '我参与的项目', 'parentName': '组织名称', 'value': '1' }, { 'name': '项目名称01', 'parentName': '组织名称', 'value': '101' }, { 'name': '项目名称02', 'value': '102' }]
        return (
            <Menu className>
                {this.renderAddMenuItem({ 'name': '新建项目', 'icon': 'plus-circle', 'selectHandleFun': addBoard })}
                {this.renderMenuItem(list)}

            </Menu>


        );
    }
    render() {
        const { visible } = this.state;
        return (
            <div className={styles.wrapper}>

                <Dropdown
                    overlay={this.content()}
                    trigger={['click']}
                //visible={visible}
                //onVisibleChange={this.handleVisibleChange}
                >
                    <div className={styles.titleClassName}
                        style={{
                            display: 'inline-block',
                            maxWidth: '248px',
                            width: '248px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>

                        <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '20px' }}>&#xe67d;</i> <span style={{ fontWeight: '500', fontSize: '16px' }}>我参与得项目 <Icon type="down" style={{ fontSize: '12px' }} /></span>

                    </div>
                </Dropdown>
            </div>
        );
    }
}

export default connect(({ }) => ({}))(DropdownSelect);
