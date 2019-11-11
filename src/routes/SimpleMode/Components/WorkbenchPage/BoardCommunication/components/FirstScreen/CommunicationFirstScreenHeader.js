import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Breadcrumb, Icon } from 'antd';
import styles from './CommunicationFirstScreenHeader.less';


const { Search } = Input;
const BreadcrumbItem = Breadcrumb.Item
// @connect(mapStateToProps)
// @connect()

export default class CommunicationFirstScreenHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchValue: '', // 搜索框输入值
        }
    }

    // 分割符
    showSeparator = () => <Icon type="caret-right" />

    // 改变面包屑路径
    chooseBreadItem = (item) => {
        // this.props.setBreadPaths && this.props.setBreadPaths({ path_item: item })
    }

    // 获取焦点时触发
    selectOnblur = () => {
        
    }

    // onChange
    inputOnChange = (e) => {
        console.log('value', e.target.value);
        this.setState({ searchValue: e.target.value },()=>{
            this.isShowSearchComponent();
        });
    }

    // 根据input 输入值判断是否显示搜索详情组件
    isShowSearchComponent = ()=> {
        const { searchValue } = this.state;
        const isShow = searchValue !== '' ? true : false;
        this.props.isShowSearchOperationDetail(isShow, searchValue);
        this.props.getThumbnailFilesData();
    }

    // 获取input search焦点
    inputOnFocus = () => {
        // console.log('获取焦点了');
        // this.isShowSearchComponent();
    }


    // 失去input search焦点
    inputOnBlur= () => {
        // console.log('失去焦点了');
    }

    // 搜索
    onSearch = () => {
        this.props.getThumbnailFilesData();
    }

    render(){
        const {
            bread_paths,
            currentSelectBoardId,
            currentItemIayerId
        } = this.props;
        const { searchValue } = this.state;
        return(
            <div className={styles.communicationFirstScreenHeader}>
                {/* 面包屑 */}
                <div className={styles.breadPath}>
                    {
                        bread_paths && bread_paths.length ?
                        (
                            <Breadcrumb separator={this.showSeparator()}>
                                <BreadcrumbItem key={'allFiles'}>
                                    全部文件
                                </BreadcrumbItem>
                                {
                                    bread_paths.map((item, index) => {
                                        const { id, folder_id, board_name, folder_name, type } = item
                                        return (
                                            <BreadcrumbItem key={ id || folder_id } onClick={() => this.chooseBreadItem(item)}>
                                                <span style={{color: 'rgba(0,0,0,.65)'}}>{board_name || folder_name}</span>
                                            </BreadcrumbItem>
                                        )
                                    })
                                }
                            </Breadcrumb>
                        ) : ( <div className={styles.projectName}>项目文件</div> )
                    }
                </div>

                {/* 搜索 */}
                <div className={styles.rightSearch}>
                    <Search
                        style={{ width: '100%', resize: 'none' }}
                        autoFocus={true}
                        autosize={true}
                        onChange={(e) => { this.inputOnChange(e) }}
                        onBlur={() => { this.inputOnBlur() }}
                        onFocus={()=>{ this.inputOnFocus()}}
                        // onClick={(e) => { this.handleStopPro(e) }}
                        // onKeyDown={(e) => { this.handleKeyDown(list, file_id, e) }}
                        // maxLength={50}
                        onSearch={()=>this.onSearch()}
                        value={searchValue}
                        allowClear={true}
                        // onSearch={(inputValue) => this.onSearch(inputValue, onSearchButton)}
                    />
                </div>
            </div>
        )
    }
}