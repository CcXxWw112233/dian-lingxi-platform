import React, { Component } from 'react'
import indexStyles from './index.less'
import Header from './components/header/Header'
import Hot from './components/hot/Hot'

export default class index extends Component {
    render() {
        return (
            <div>
                <Header />
                <Hot />
            </div>
        )
    }
}
