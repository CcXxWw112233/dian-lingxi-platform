import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';
import { Route, Link, NavLink } from 'dva/router'
import { connect } from 'dva'
import { getHeaderTabs } from '@/services/technological/xczNews'

@connect(({xczNews = []}) => ({xczNews}))
export default class Header extends Component {

    render() {
        // console.log(this.props)
        const { xczNews } = this.props
        // console.log('ssssssss', xczNews)
        const { location } = this.props;
        // console.log(location)
        return (
            <div className={headerStyles.header}>
                <div className={headerStyles.nav}>
                    <div className={headerStyles.tab}>
                        {
                            xczNews.topTabs.map((item, index) => {
                                console.log(item)
                                if (item.path === location.pathname) {
                                    return (
                                        <NavLink className={headerStyles.active} to={item.path}>{item.text}</NavLink>
                                    )
                                } else {
                                    return (
                                        <NavLink to={item.path}>{item.text}</NavLink>
                                    )
                                }
                                
                            })
                        }
                        {/* <NavLink to="/technological/xczNews/hot">热点</NavLink>
                        <NavLink to="/technological/xczNews/highRise">高层</NavLink>
                        <NavLink to="/technological/xczNews/authority">权威</NavLink>
                        <NavLink to="/technological/xczNews/area">地区</NavLink>
                        <NavLink to="/technological/xczNews/dataBase">资料库</NavLink> */}
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
        )
    }
}
