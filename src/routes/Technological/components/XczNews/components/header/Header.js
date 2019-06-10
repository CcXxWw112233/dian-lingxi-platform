import React, { Component } from 'react'
import headerStyles from './header.less'
import { Input } from 'antd';

export default class Header extends Component {
    render() {
        return (
            <div className={headerStyles.header}>
                <div className={headerStyles.nav}>
                    <div className={headerStyles.tab}>
                        <a className={headerStyles.active} href="#">热点</a>
                        <a href="#">高层</a>
                        <a href="#">权威</a>
                        <a href="#">地区</a>
                        <a href="#">资料库</a>
                    </div>
                </div>
                <div className="search">
                    <Input.Search 
                        placeholder="请输入"
                        style={{ width: 200,height: 32 }}
                        onSearch={value => console.log(value)}
                    />
                </div>
            </div>
        )
    }
}
