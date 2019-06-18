import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';
import { Link } from 'dva/router'
import { connect } from 'dva'

@connect(({xczNews = []}) => ({xczNews}))
export default class Header extends Component {

    // onSearch
    onSearch = (value, onSearchButton) => {
        const { dispatch } = this.props;
        console.log(onSearchButton)
        dispatch({
            type: "xczNews/getHeaderSearch",
            payload: {
                value: value,
                onSearchButton: !onSearchButton
            }
        })
    }

    // onChange
    // onChange = (e) => {
    //     // console.log(e.target.value)
    //     const { dispatch } = this.props;
    //     let value = e.target.value
    //     dispatch({
    //         type: "xczNews/getHeaderSearch",
    //         payload: {
    //             value: value,
    //         }
    //     })

    // }

    render() {
        const { xczNews, location } = this.props;
        const { inputValue, onSearchButton } = xczNews;
        // console.log(inputValue)
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
                                    // value={ inputValue }
                                    allowClear={true}
                                    // onChange={ (e) => { this.onChange(e) } }
                                    placeholder="请输入"
                                    style={{ width: 200,height: 32, marginRight: 16 }}
                                    onSearch={(inputValue) => this.onSearch(inputValue, onSearchButton)}
                                />
                            </div>
                        )
                    }
                </div>   
            </div>
        )
    }
}
