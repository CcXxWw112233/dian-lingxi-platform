import React from 'react';
import FileDetail from './FileDetail/index';
import styles from './FileListRightBarFileDetailModal.less';

class FileListRightBarFileDetailModal extends React.Component {

    render(){
        const container_FileListRightBarFileDetailModal = document.getElementById('container_FileListRightBarFileDetailModal');
        const zommPictureComponentHeight = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
        const zommPictureComponentWidth = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
        
        return(
            <div id="container_FileListRightBarFileDetailModal" className={styles.fileListRightBarFileDetailModal}>
                <FileDetail
                    {...this.props}
                    {...this.props.fileDetailModalDatas}
                    componentHeight={zommPictureComponentHeight}
                    componentWidth={zommPictureComponentWidth}
                    setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
                    modalTop={20}
                />
            </div>
        );
    }
}

export default FileListRightBarFileDetailModal;