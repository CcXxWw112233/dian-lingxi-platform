import React, { Component } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import styles from './CommunicationFirstScreenHeader.less';


const { Search } = Input;
// @connect(mapStateToProps)
// @connect()

export default class CommunicationFirstScreenHeader extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div className={styles.communicationFirstScreenHeader}>
                <div className={styles.breadPath}>
                    首屏-面包屑/路径
                </div>
                <div className={styles.rightSearch}>
                <Search
                    placeholder="搜索"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                />
                </div>
            </div>
        )
    }
}