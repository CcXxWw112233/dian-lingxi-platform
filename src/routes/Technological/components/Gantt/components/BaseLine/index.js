import React, { useState, useMemo } from 'react';
import styles from './index.less';
import globalStyles from '../../../../../../globalset/css/globalClassName.less';
import { dateFormat } from '../../../../../../utils/util';
import { connect } from 'dva';
import { Button, Col, Dropdown, Empty, Input, Menu, message, Modal, Popover, Row } from 'antd';

// 基线列表的选项菜单
const DrapMenu = ({data, onEdit, onRemove})=>{
  const [ visible, setVisible ] = useState(false);
  const handleMenu = async ({key} )=>{
    setVisible(false);
    if(key === 'removeBaseLine'){
      onRemove && onRemove(data);
    }
    if(key === 'editBaseLine'){
      onEdit && onEdit(data);
    }
  }
  // 基线列表的设置项
  const Dmenu = ()=> (
    <Menu onClick={handleMenu}>
      <Menu.Item key="editBaseLine">
        编辑基线
      </Menu.Item>
      <Menu.Item key="removeBaseLine">
        <div className={styles.remove}>删除基线</div>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown
    trigger="click"
    visible={visible}
    onVisibleChange={(val)=> setVisible(val)}
    overlay={<Dmenu />}
    overlayStyle={{zIndex: 10000}}>
      <span className={`${styles.operation} ${globalStyles.authTheme}`}>&#xe66f;</span>
    </Dropdown>
  )
}
// 基线列表弹窗
function BaseLine (props){
  // eslint-disable-next-line global-require
  const EmptyImage = require('../../../../../../assets/gantt/empty-box-baseline.png');
  const { baseLine_datas, dispatch } = props;
  // 弹框的显示隐藏状态
  const [ visiblePopover, setVisiblePopover ] = useState(false);

  // 监听项目变更，获取列表数据
  useMemo(() => {
    if(visiblePopover)
    dispatch({
      type: "gantt/getBaseLineList",
      payload: {}
    });
  }, [visiblePopover])
  // 保存基线的名称数据
  let baseLineName = "";

  // 编辑基线的弹窗回调
  const toCreate = (isEdit)=>{
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: isEdit ? '编辑基线': '新增基线',
        content: (<div>
          <span style={{marginBottom: 5, display: "inline-block"}}>基线名称</span>
          <Input placeholder="请输入基线名称" defaultValue={baseLineName} type='text' allowClear onInput={(evt)=> {baseLineName = (evt.target.value)}}/>
        </div>),
        onOk: ()=>{
          if(!baseLineName) {
            message.warn('基线名称不能为空');
            return Promise.reject();
          }
          resolve(baseLineName);
        },
        onCancel: ()=>{
          reject('')
        },
        okText: "确定",
        cancelText: "取消"
      })
    })

  }

  // 创建基线的统一方法
  const createBaseLine = ( isEmpty = true )=>{
    const handleCreate = async ()=>{
      let name = dateFormat(new Date().getTime(), 'yyyy.MM.dd HH:mm');
      baseLineName = name;
      setVisiblePopover(false);
      let resp = await toCreate(false).catch(err => err);
      if(!resp) return ;
      let obj = {id: Math.random() * 10000, name: baseLineName};
      dispatch({
        type: "gantt/addBaseLineData",
        payload: {
          data: obj
        }
      })
      setVisiblePopover(true);
      message.success('创建成功');
    }
    if(isEmpty){
      return <Button type='primary' onClick={handleCreate}>立即创建</Button>
    }else {
      return (
        <Button type="link" onClick={handleCreate}>
          <span className={globalStyles.authTheme}>&#xe8fe;</span>
          创建基线
        </Button>
      )
    }
  }

  // 编辑基线
  const editBaseLine = async (val)=>{
    setVisiblePopover(false);
    baseLineName = val.name;
    let resp = await toCreate(true).catch(err => err);
    if(resp){
      if(baseLineName !== val.name){
        dispatch({
          type: "gantt/updateBaseLine",
          payload: {
            id: val.id,
            name: baseLineName
          }
        })
        message.success('更新成功')
      }
    }
    setVisiblePopover(true);
  }
  // 删除基线
  const removeBaseLine = (val)=>{
    setVisiblePopover(false);
    Modal.confirm({
      title: '删除提醒',
      content: `确定删除基线 ${val.name} 吗？`,
      okText: "删除",
      okButtonProps: {type: "danger"},
      cancelText: "取消",
      onOk: ()=>{
        dispatch({
          type: "gantt/deleteBaseLineData",
          payload: {
            id: val.id
          }
        })
        message.success('删除成功');
        setVisiblePopover(true);
      },
      onCancel: ()=>{
        setVisiblePopover(true);
      }
    })
  }

  // 渲染基线列表
  const renderBaseLineData = ()=> {

    if(baseLine_datas && baseLine_datas.length){
      return (
        <>
        <div className={styles.baseline_container}>
          {createBaseLine(false)}
          { baseLine_datas.map(item => {
            return (
              <div className={styles.baseline_item} key={item.id}>
                <div style={{width: '90%'}}>
                  <div className={styles.baseline_item_title}>
                    {item.name}
                  </div>
                  <div className={styles.baseline_item_creator}>
                    <Row gutter={8}>
                      <Col span={8}>
                        创建于
                      </Col>
                      <Col span={16}>
                        2020.08.31 15:51
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={styles.baseline_operation}>
                  <DrapMenu data={item} onEdit={editBaseLine} onRemove={removeBaseLine}/>
                </div>
              </div>
            )
          })}
        </div>
        </>
      )
    }else return (
      <div>
        <Empty
        image={EmptyImage}
        description={<span className={styles.notDatasTips}>当前未创建基线</span>}>
          {createBaseLine(true)}
        </Empty>
      </div>
    )
  }
  return (
    <Popover
    title="基线是当前任务的快照，用于回顾与复盘"
    trigger="click"
    placement="bottomLeft"
    visible={visiblePopover}
    onVisibleChange={(val)=> setVisiblePopover(val)}
    content={renderBaseLineData()}
    >
      <Button type='default' size='small'>
        基线对照
      </Button>
    </Popover>
  )
}

export default connect(
  ({
    gantt: { datas: { baseLine_datas } },
  }) =>
({ baseLine_datas }))(BaseLine)
