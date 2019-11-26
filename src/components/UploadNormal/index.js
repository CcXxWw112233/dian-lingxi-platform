import React, { Component } from 'react'
import UploadNotification from '../UploadNotification'
import { Upload, message } from 'antd'
import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '../../globalset/js/constant'
import Cookies from 'js-cookie'
import { setUploadHeaderBaseInfo } from '../../utils/businessFunction'
import axios from 'axios'
import BMF from 'browser-md5-file';
import { resolve, reject } from '_any-promise@1.3.0@any-promise'
import { getUSerInfo } from '../../services/technological'
export default class UploadNormal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uploading_file_list: [],
            swich_render_upload: true, //是否显示上传开关
            OSSData: {},
        }
    }
    // 设置右边弹窗出现
    setUploadNotiVisible = () => {
        const { show_upload_notification } = this.state
        this.setState({
            show_upload_notification: !show_upload_notification,
            uploading_file_list: []
        })
    }
    setShowUploadNotification = (bool) => {
        this.setState({
            show_upload_notification: bool
        })
    }
    uploadCompleted = () => {
        const { is_need_parent_notification, setShowUploadNotification, setUploadingFileList } = this.props

        this.setState({
            swich_render_upload: false
        })
        setTimeout(() => {
            this.setState({
                swich_render_upload: true
            })
        }, 1000)

        if (is_need_parent_notification) {
            setShowUploadNotification(false)
            setUploadingFileList([])
        }
    }
    normalUploadProps = () => {
        const that = this
        const { uploading_file_list } = this.state
        const { uploadProps = {}, uploadCompleteCalback, setShowUploadNotification, is_need_parent_notification, setUploadingFileList } = this.props
        const { data: { board_id } } = uploadProps
        const propsObj = {
            name: 'file',
            withCredentials: true,
            multiple: true,
            // fileList: uploading_file_list,
            showUploadList: false,
            headers: {
                Authorization: Cookies.get('Authorization'),
                refreshToken: Cookies.get('refreshToken'),
                ...setUploadHeaderBaseInfo({ boardId: board_id }),
            },
            ...uploadProps,
            transformFile: this.transformFile,
            beforeUpload: (e) => {
                if (e.size == 0) {
                    message.error(`不能上传空文件`)
                    return false
                } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
                    message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
                    return false
                }
                if (is_need_parent_notification) {
                    setShowUploadNotification(true)
                } else {
                    that.setShowUploadNotification(true)
                }
            },
            onChange: ({ file, fileList }) => {
                let fileList_will = [...fileList]
                fileList_will = fileList_will.filter(item => {
                    if (item.status == 'done') {
                        if (item.response && item.response.code == '0') {

                        } else {
                            item.status = 'error'
                        }
                    }
                    return item
                })
                if (is_need_parent_notification) { //由父组件渲染进度弹窗
                    setUploadingFileList(fileList_will)
                } else {
                    that.setState({
                        uploading_file_list: fileList
                    })
                }
                // console.log('sssss_fileList', fileList)
                const is_has_uploading = fileList_will.length && (fileList_will.findIndex(item => item.status == 'uploading') != -1)
                if (!is_has_uploading) { //没有上传状态了
                    if (typeof uploadCompleteCalback == 'function') {
                        uploadCompleteCalback()
                    }
                    that.uploadCompleted()
                }
            },
            customRequest: this.customRequest
        };
        return propsObj
    }

    // 自定义上传
    customRequest = async (e) => {
        let {
            action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess,
            withCredentials,
        } = e
        const { OSSData } = this.state
        const formData = new FormData();
        formData.append(filename, file);

        /*
        1.是大文件
        2.解码生成md5
        3.生成的md5与后端校验，如果存在相同md5格式的文件，仅需关联。否则上传到阿里云oss
        */
        if (file.size >= 50 * 1024 * 1024) {
            const md5_str = await this.handleBMF(file) //解码md5文件
            const is_has_md5 = await this.checkFileMD5() //检查后台是否存在相同md5的文件
            console.log('sssss_is_has_md5', is_has_md5)
            console.log('sssss_md5_str', md5_str)
            if (is_has_md5) { //如果后端已经存在了该文件，只需调用接口将文件关联
                const relation_res = await this.relationFile()
                if (relation_res) {
                    onProgress({ percent: 100 }, file);
                    setTimeout(() => {
                        onSuccess(relation_res, file);
                    }, 500)
                }
                return
            } else {
                data = {
                    ...data,
                    ...this.getExtraData(file)
                }
                action = OSSData.host
            }
        }

        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
        }

        // 进行文件上传
        axios
            .post(action, formData, {
                withCredentials,
                headers,
                timeout: 0,
                onUploadProgress: ({ total, loaded }) => {
                    onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
                },
            })
            .then(({ data: response }) => {
                onSuccess(response, file);
            })
            .catch(onError);

        return {
            abort() {
                console.log('upload progress is aborted.');
            },
        };
    }
    // 检查文件md5是否保存在后台
    checkFileMD5 = () => {
        const p = new Promise((resolve, reject) => {
            getUSerInfo().then(res => {
                resolve(res)
            }).catch(err => {
                resolve('error')
            })
        })
        return p
    }
    // 处理md5
    handleBMF = (file) => {
        const bmf = new BMF()
        const p = new Promise((resolve, reject) => {
            bmf.md5(
                file,
                (err, md5) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(md5)
                    }
                },
                progress => {
                    // console.log('progress number:', progress);
                },
            );
        })
        return p
    }
    // 关联文件到后端
    relationFile = () => {
        const p = new Promise((resolve, reject) => {
            getUSerInfo().then(res => {
                resolve(res)
            }).catch(err => {
                resolve('error')
            })
        })
        return p
    }


    // oss上传
    async componentDidMount() {
        await this.init();
    }
    init = async () => {
        try {
            const OSSData = await this.mockGetOSSData();
            this.setState({
                OSSData,
            });
        } catch (error) {
            message.error(error);
        }
    };
    mockGetOSSData = () => {
        return {
            dir: 'user-dir/',
            expire: '1577811661',
            host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
            accessId: 'c2hhb2RhaG9uZw==',
            policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
            signature: 'ZGFob25nc2hhbw==',
        };
    };
    transformFile = file => {
        const { OSSData } = this.state;
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.url = OSSData.dir + filename;
        return file;
    };
    getExtraData = file => {
        const { OSSData } = this.state;
        return {
            key: file.url,
            OSSAccessKeyId: OSSData.accessId,
            policy: OSSData.policy,
            Signature: OSSData.signature,
        };
    };

    render() {
        const { children, is_need_parent_notification } = this.props
        const { show_upload_notification, uploading_file_list = [], swich_render_upload } = this.state

        return (
            <>
                {
                    swich_render_upload ?
                        (<Upload {...this.normalUploadProps()}>
                            {children}
                        </Upload>) : (
                            children
                        )
                }
                {
                    !is_need_parent_notification && show_upload_notification && (
                        <UploadNotification uploading_file_list={uploading_file_list} setUploadNotiVisible={this.setUploadNotiVisible} />
                    )
                }
            </>
        )
    }
}
