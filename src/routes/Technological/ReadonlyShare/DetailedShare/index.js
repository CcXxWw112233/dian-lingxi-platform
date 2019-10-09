import React from 'react'
import indexStyles from './index.less'
import CustormModal from '../../../../components/CustormModal'
import FileModule from '../FileModule'

export default class DetailedShare extends React.Component {
    state = {
        drawerVisible: false,
    }

    render() {
        return (
            <CustormModal
                visible={true}
                width={'80%'}
                zIndex={1006}
                maskClosable={false}
                footer={null}
                destroyOnClose
                overInner={<FileModule />}
            />
        )
    }
}
