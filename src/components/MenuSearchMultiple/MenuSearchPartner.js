import React from 'react'
// import MenuSearchStyles from './MenuSearch.less'
import { Input, Menu, Spin } from 'antd'
import indexStyles from './MenuSearchPartner.less'
import ShowAddMenberModal from '@/routes/Technological/components/Project/ShowAddMenberModal'
import { checkIsHasPermissionInBoard, } from "../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_BOARD_MEMBER } from "@/globalset/js/constant";

export default class MenuSearchPartner extends React.Component {
    state = {
        resultArr: [],
        keyWord: '',
        selectedKeys: []
    }
    componentWillMount() {
        const { keyWord } = this.state
        const { listData, searchName, selectedKeys = [] } = this.props
        this.setState({
            resultArr: this.fuzzyQuery(listData, searchName, keyWord),
            selectedKeys
        })
    }
    componentWillReceiveProps(nextProps) {

    }
    //模糊查询
    handleMenuReallySelect = (e) => {
        this.setSelectKey(e)
    }
    handleMenuReallyDeselect(e) {
        this.setSelectKey(e)
    }
    setSelectKey(e) {
        const { key, selectedKeys } = e
        if (!key) {
            return false
        }
        this.setState({
            selectedKeys
        })
    }
    onCheck() {
        if (this.props.onCheck && typeof this.props.onCheck === 'function') {
            this.props.onCheck(this.state.selectedKeys)
        }
    }
    fuzzyQuery = (list, searchName, keyWord) => {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][searchName].indexOf(keyWord) !== -1) {
                arr.push(list[i]);
            }
        }
        return arr;
    }
    onChange = (e) => {
        const { listData, searchName } = this.props
        const keyWord = e.target.value
        const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
        this.setState({
            keyWord,
            resultArr
        })
    }
    setShowAddMenberModalVisibile() {

        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return false
        }
        this.setState({
            ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
        })
    }
    render() {
        const { keyWord, resultArr, selectedKeys = [] } = this.state


        const { Inputlaceholder = '搜索', searchName, menuSearchSingleSpinning, keyCode } = this.props

        return (
            <div>
                <Menu style={{ padding: 8 }}
                    selectedKeys={selectedKeys}
                    // onDeselect={this.handleMenuReallyDeselect}
                    onSelect={this.handleMenuReallySelect} multiple >

                    <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} style={{ marginBottom: 10 }} />
                    <div style={{ height: 32, lineHeight: '32px', color: 'rgb(73, 155, 230)' }} onClick={this.setShowAddMenberModalVisibile.bind(this)}>
                        邀请他人参与
                </div>
                    {
                        resultArr.map((value, key) => {
                            return (
                                <Menu.Item style={{ height: 32, lineHeight: '32px' }} key={value[keyCode]} >
                                    {value[searchName]}
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>

                <ShowAddMenberModal
                    // title={titleText}
                    _organization_id={localStorage.getItem('OrganizationId')}
                    addMenbersInProject={this.addMenbersInProject}
                    show_wechat_invite={true}
                    // {...this.props} board_id={board_id}
                    modalVisible={this.state.ShowAddMenberModalVisibile}
                    setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}
                />
            </div>

        )
    }

}

MenuSearchPartner.deafultProps = {

}
