import React, { Component } from 'react'
import { connect } from 'react-redux'
import indexStyles from './index.less';
import { Modal, Button, Progress } from 'antd';

export class PayUpgrade extends Component {

    componentWillMount(){

    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    toPay = () => {
        const OrganizationId = localStorage.getItem('OrganizationId');
        window.open(`/pay/organization/${OrganizationId}/orders/new`, '_blank')
    }

    handleCancel = e => {
        const { setPayUpgradeModalVisible } = this.props;
        setPayUpgradeModalVisible(false);
    };


    render() {
        const itemList = [
            { icon: '', name: '行业模板' },
            { icon: '', name: 'PDF图评' },
            { icon: '', name: '视频会议' },
            { icon: '', name: '甘特图' },
            { icon: '', name: '存储空间' },
            { icon: '', name: '优秀案例' },
            { icon: '', name: '政策法规' },
            { icon: '', name: '投资地图' },
            { icon: '', name: '风采展示' },
        ]
        const infoData = {
            person: {
                currentNum: 5,
                limit: 10,
            },
            project: {
                currentNum: 10,
                limit: 15,
            }
        }
        return (
            <Modal
                title={<div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>用量与付费功能</div>}
                visible={true}
                footer={null}
                width={903}
                onCancel={this.handleCancel}
            >
                <div className={indexStyles.infoTitle}>协作人数与项目数统计</div>
                <div className={indexStyles.infoBox}>

                    <div className={indexStyles.organizationInfoWrapper}>
                        <div className={indexStyles.organizationInfo}>
                            <div className={indexStyles.organizationInfoRow}>
                                <div className={indexStyles.leftInfo}>
                                    协作人数
                                </div>
                                <div className={indexStyles.centerInfo}>
                                    <Progress
                                        strokeWidth={16}
                                        strokeColor={'#FFC069'}
                                        percent={(infoData.person.currentNum / infoData.person.limit) * 100}
                                        showInfo={false}
                                    />
                                </div>
                                <div className={indexStyles.rightInfo}>
                                    {infoData.person.currentNum}/ {infoData.person.limit}
                                </div>
                            </div>
                            <div className={indexStyles.organizationInfoRow}>
                                <div className={indexStyles.leftInfo}>
                                    项目数
                                </div>
                                <div className={indexStyles.centerInfo}>
                                    <Progress
                                        strokeWidth={16}
                                        strokeColor={'#69C0FF'}
                                        percent={(infoData.project.currentNum / infoData.project.limit) * 100}
                                        showInfo={false}
                                    />
                                </div>
                                <div className={indexStyles.rightInfo}>
                                    {infoData.project.currentNum}/ {infoData.project.limit}
                                </div>
                            </div>

                        </div>

                        <div className={indexStyles.upgradeBtnWrapper}>
                            <Button type="primary" size={'default'} onClick={() => this.toPay()} > 付费升级</Button>
                        </div>
                    </div>
                </div>
                <div className={indexStyles.infoTitle}>付费功能</div>
                <div className={indexStyles.infoBox}>
                    <div className={indexStyles.featureList}>
                        {
                            itemList.map((item, index) => {
                                return (
                                    <div key={index} className={indexStyles.item}>
                                        <div className={indexStyles.iconWrapper}>
                                        </div>
                                        <div className={indexStyles.itemTitle}>
                                            {item.name}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Modal >
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PayUpgrade)
