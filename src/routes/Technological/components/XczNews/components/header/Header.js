import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';
import { Link } from 'dva/router'
import { connect } from 'dva'

@connect(({xczNews = []}) => ({xczNews}))
export default class Header extends Component {

    // onSearch 搜索框
    onSearch = (value, onSearchButton, hotFlag) => {
        const { dispatch } = this.props;
        // console.log(value)
        dispatch({
            type: "xczNews/getHeaderSearch",
            payload: {
                contentVal: value,
                onSearchButton: true,
                hotFlag: false
            }
        })
    }

    onChange = (e) => {
        const value = e.target.value
        const { dispatch } = this.props
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                inputValue: value,
                // onSearchButton: false,
            }
        })
    }

    render() {
        const { xczNews, location } = this.props;
        const { onSearchButton, inputValue, hotFlag } = xczNews;
        return (
            <div className={headerStyles.header}>
                <div className={headerStyles.mainContainer}>
                    <div className={headerStyles.nav}>
                        <div className={headerStyles.tab}>
                            {
                                xczNews.topTabs.map((item, index) => {
                                    // console.log(item)
                                    if (item.path == location.pathname) {
                                        return (
                                            <Link className={headerStyles.active} to={item.path}>{item.text}</Link>
                                        )
                                    } else {
                                        return (
                                            <Link to={item.path}>{item.text}</Link>
                                        )
                                    }
                                    
                                })
                            }
                        </div>
                    </div>
                    {
                        location.pathname !== '/technological/xczNews/area' && (
                            <div className={headerStyles.Search}>
                                <Input.Search 
                                    type="text"
                                    value={inputValue}
                                    allowClear={true}
                                    placeholder="请输入"
                                    style={{ width: 200,height: 32, marginRight: 16 }}
                                    autocomplete="off"
                                    onChange={this.onChange}
                                    onSearch={(inputValue) => this.onSearch(inputValue, onSearchButton, hotFlag)}
                                />
                            </div>
                        )
                    }
                </div>   
            </div>
        )
    }
}
