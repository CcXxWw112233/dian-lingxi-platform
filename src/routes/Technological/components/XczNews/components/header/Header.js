import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';
import { Link } from 'dva/router'
import { connect } from 'dva'

@connect(({xczNews = []}) => ({xczNews}))
export default class Header extends Component {

    render() {
        const { xczNews, location } = this.props
        // console.log(location)
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
                                    placeholder="请输入"
                                    style={{ width: 200,height: 32, marginRight: 16 }}
                                    onSearch={value => console.log(value)}
                                />
                            </div>
                        )
                    }
                </div>   
            </div>
        )
    }
}
