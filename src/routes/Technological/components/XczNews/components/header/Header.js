import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';
import { Route, Link } from 'dva/router'
import { connect } from 'dva'
import { getHeaderTabs } from '@/services/technological/xczNews'

@connect(({xczNews}) => ({xczNews}))
export default class Header extends Component {

    render() {
        // console.log(this.props)
        const { xczNews } = this.props
        console.log('ssssssss', xczNews)
        const { location } = this.props;
        return (
            <div className={headerStyles.header}>
                <div className={headerStyles.nav}>
                    <div className={headerStyles.tab}>
                        <Link className={headerStyles.active} to="/technological/xczNews/hot">热点</Link>
                        <Link to="/technological/xczNews/highRise">高层</Link>
                        <Link to="/technological/xczNews/authority">权威</Link>
                        <Link to="/technological/xczNews/area">地区</Link>
                        <Link to="/technological/xczNews/dataBase">资料库</Link>
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
