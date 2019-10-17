
import React from 'react'
import BraftEditor from 'braft-editor'
import styles from './index.less'
import { Button } from 'antd'

export default class RichTextEditor extends React.Component {

    constructor(props) {
        super(props);
        const { value } = this.props;
        console.log("value", value);

        this.state = {
            isInEdit: false,
            editorState: BraftEditor.createEditorState(value),
        }
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        const { value: oldValue } = this.props;
        if (value !== oldValue) {
            this.setState({
                editorState: BraftEditor.createEditorState(value)
            });
        }
       
    }

    getEditorProps = () => {
        const editorState = this.state.editorState;
        const { value } = this.props;

        return {
            contentClassName: styles.editor_content,
            contentFormat: 'html',
            value: editorState,
            media: { uploadFn: this.myUploadFn },
            onChange: (e) => {
                this.setState({
                    editorState: e
                })
            },
            fontSizes: [14],
            controls: [
                'text-color', 'bold', 'italic', 'underline', 'strike-through',
                'text-align', 'list_ul',
                'list_ol', 'blockquote', 'code', 'split', 'media'
            ]
        };
    }

    setIsInEdit = (isInEdit) => {
        this.setState({
            isInEdit: isInEdit
        });
    }

    saveHandle = (e) => {
        e.stopPropagation();
        const { dispatch } = this.props

        let { editorState } = this.state
        if (typeof editorState === 'object') {
            let brafitEditHtml = editorState.toHTML()
            this.props.saveBrafitEdit(brafitEditHtml);

        }
        this.setState({
            isInEdit: false
        });

    }

    render() {
        const { children } = this.props;
        const { isInEdit } = this.state;
        return (
            <div>
                {!isInEdit ?
                    <div onClick={() => { this.setIsInEdit(true) }}>
                        {children}
                    </div>
                    :
                    <div>
                        <div className={styles.editor_wrapper_default}>
                            <BraftEditor {...this.getEditorProps()} />
                        </div>
                        <div className={styles.editor_footer_wrapper}>
                            <a onClick={() => { this.setIsInEdit(false) }}>取消</a>
                            <Button size={'large'} type="primary" style={{ marginLeft: '16px' }} onClick={(e) => { this.saveHandle(e) }}>保存</Button>
                        </div>
                    </div>
                }



            </div>
        )
    }

    handleChange = (editorState) => {
        console.log(editorState);

        this.setState({ editorState })
    }

}