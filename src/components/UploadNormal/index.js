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
import { checkFileMD5WithBack } from '../../services/technological/file'
import oss from 'ali-oss';
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
            swich_render_upload: false
        })
        setTimeout(() => {
            this.setState({
                swich_render_upload: true
            })
        }, 1000)
        this.setShowUploadNotification(false)
        this.setUploadingFileList([])
    }
    setShowUploadNotification = (bool) => {
        this.setState({
            show_upload_notification: bool
        })
    }
    setUploadingFileList = (uploading_file_list) => {
        this.setState({
            uploading_file_list
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
        } else {
            // this.setShowUploadNotification(false)
            this.setUploadNotiVisible()
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
                    that.setUploadingFileList(fileList_will)
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
            const { data: { is_live, access = {} } } = await this.checkFileMD5({ md5_str, file_name: file.name }) //检查后台是否存在相同md5的文件
            if (is_live) { //如果后端已经存在了该文件，只需调用接口将文件关联
                const relation_res = await this.checkRelationFile()
                if (relation_res) {
                    onProgress({ percent: 100 }, file);
                    setTimeout(() => {
                        onSuccess(relation_res, file);
                    }, 500)
                }
            } else {
                // 直传（废弃）
                // data = {
                //     ...data,
                //     ...this.getExtraData(file)
                // }
                // action = OSSData.host

                // 对象上传
                const params = { access, file, hash: md5_str, file_name: file.name }
                this.UploadToOss(params).then(res => {
                }).catch(err => {
                })
            }
            return
        }

        // 小文件上传
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
    checkFileMD5 = ({ md5_str, file_name }) => {
        const { uploadProps = {}, source_type = '1' } = this.props
        const { data: { board_id, folder_id, upload_type, file_version_id } } = uploadProps
        const params = {
            // board_id,
            // folder_id,
            file_hash: md5_str,
            file_name,
            // upload_type, // 1 / 2新文件上传 / 版本更新
        }
        if (upload_type == '2') {
            param.file_version_id = file_version_id
        }
        const p = new Promise(async (resolve, reject) => {
            checkFileMD5WithBack(params).then(res => {
                resolve(res)
            }).catch(err => {
                resolve({})
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
    checkRelationFile = () => {
        const p = new Promise((resolve, reject) => {
            getUSerInfo().then(res => {
                resolve(res)
            }).catch(err => {
                resolve('error')
            })
        })
        return p
    }

    // 新建阿里云oss客户端 --设置参数
    ossClient = (access = {}) => {
        const { access_key_id, access_key_secret, bucket, security_token } = access
        // ali-oss v6.x版本的写法
        const params = {
            accessKeyId: access_key_id,
            accessKeySecret: access_key_secret,
            region: 'cn-beijing', //
            bucket,
            stsToken: security_token,
            endpoint: 'http://oss-cn-beijing.aliyuncs.com',
            secure: true
        }
        console.log('sssss_client', params)
        return new oss(params);
    }
    UploadToOss = ({ access, file, hash, file_name }) => {
        const url = this.uploadPath({ hash, file_name })
        console.log('sssss_multipart_param', {
            url,
            file
        })
        return new Promise((resolve, reject) => {
            this.ossClient(access).multipartUpload(url, file).then(res => {
                console.log('sssss_multipart_success', error)
                resolve(data);
            }).catch(error => {
                console.log('sssss_multipart_error', error)
                reject(error)
            })
        })
    }
    uploadPath = ({ hash, file_name }) => {
        // 上传文件的路径，使用日期命名文件目录
        const subfix = file_name.substr(file_name.lastIndexOf('.'))
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}-${month}-${day}/${hash}${subfix}`
    }
    // 新建阿里云oss客户端 ---end

    // oss数据获取 ---------直传方式（废弃）
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
    // ----------直传方式end

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

// 该组件为支持上传大文件的组件
UploadNormal.defaultProps = {
    uploadProps: { //上传文件的基本数据, 必传
        action: '',
        data: {
            board_id: '',
            folder_id: '',
            upload_type: '1', //1/2  新文件上传，版本更新  
            type: '1'
        }
    },
    source_type: '1', // 1/2/3 网盘文件/流程文件/任务附件
    is_need_parent_notification: false, //进度条弹窗是否在父组件内引用
    setUploadingFileList: function () { //设置上传文件的列表(is_need_parent_notification == true时传入)

    },
    setUploadNotiVisible: function () { //关闭弹窗（is_need_parent_notification == true时传入)

    },
    uploadCompleteCalback: function () { //上传完成的回调，（比如查询列表）

    }
}