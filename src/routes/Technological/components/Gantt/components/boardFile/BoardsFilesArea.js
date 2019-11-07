import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import BoardsFilesItem from './BoardsFilesItem'

@connect(mapStateToProps)
export default class BoardsFilesArea extends Component {
    state = {
        previewFileModalVisibile: false
    }
    //弹窗
    setPreviewFileModalVisibile = () => {
        this.setState({
            previewFileModalVisibile: !this.state.previewFileModalVisibile
        });
    }
    setFileModalProps = () => {
        const { previewFileModalVisibile } = this.state
        const { model, modal, dispatch } = this.props
        const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`

        const FileModuleProps = {
            modal,
            model,
            updateFileDatas(payload) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateDatas'),
                    payload: payload
                })
            },
            getFileList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getFileList'),
                    payload: params
                })
            },
            fileCopy(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileCopy'),
                    payload: data
                })
            },
            fileDownload(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileDownload'),
                    payload: params
                })
            },
            fileRemove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileRemove'),
                    payload: data
                })
            },
            fileMove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileMove'),
                    payload: data
                })
            },
            fileUpload(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileUpload'),
                    payload: data
                })
            },
            fileVersionist(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileVersionist'),
                    payload: params
                })
            },
            recycleBinList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('recycleBinList'),
                    payload: params
                })
            },
            deleteFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteFile'),
                    payload: data
                })
            },
            restoreFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('restoreFile'),
                    payload: data
                })
            },
            getFolderList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getFolderList'),
                    payload: params
                })
            },
            addNewFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('addNewFolder'),
                    payload: data
                })
            },
            updateFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateFolder'),
                    payload: data
                })
            },
            filePreview(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('filePreview'),
                    payload: params
                })
            },
            getPreviewFileCommits(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getPreviewFileCommits'),
                    payload: params
                })
            },
            addFileCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('addFileCommit'),
                    payload: params
                })
            },
            deleteCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteCommit'),
                    payload: params
                })
            },
        }

        const updateDatasFile = (payload) => {
            dispatch({
                type: getEffectOrReducerByName_5('updateDatas'),
                payload: payload
            })
        }

        const fileDetailModalDatas = {
            ...this.props,
            ...FileModuleProps,
            updateDatasFile,
            model,
            previewFileModalVisibile
        }
        return fileDetailModalDatas
    }

    render() {
        const { is_show_board_file_area, boards_flies = [] } = this.props

        return (
            <div className={` ${globalStyles.global_vertical_scrollbar} ${styles.boards_files_area}
            ${is_show_board_file_area == '1' && styles.boards_files_area_show}
            ${is_show_board_file_area == '2' && styles.boards_files_area_hide}
            `}>
                <div>
                    {
                        boards_flies.map((item, key) => {
                            const { id, board_name } = item
                            return (
                                <div key={id}>
                                    <BoardsFilesItem
                                        itemValue={item}
                                        item={key}
                                        board_id={id}
                                        board_name={board_name}
                                        setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
                                        fileDetailModalDatas={this.setFileModalProps()} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
function mapStateToProps({
    gantt: { datas: { is_show_board_file_area, boards_flies = [] } },
    workbenchTaskDetail, workbenchFileDetail, workbenchDetailProcess, workbenchPublicDatas, publicTaskDetailModal
}) {
    const modelObj = {
        datas: { ...workbenchFileDetail['datas'], ...workbenchPublicDatas['datas'], ...publicTaskDetailModal }
    }
    return { is_show_board_file_area, boards_flies, model: modelObj }
}


