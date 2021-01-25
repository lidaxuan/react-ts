/**
 * @file 富文本
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import { FileImageOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import Upload from 'src/components/upload/index';

interface Props{
  value?: string;
  onChange?: (e: any) => void;
  [key: string]: any;
  readOnly?: boolean; // 是否只读
}

interface State {
  text: string;
  editorState: EditorState;
  imageUploadVisible: boolean;
  focus?: boolean;
}

const controls: string[] = [
  'bold',
  'italic',
  'underline',
  'line-height',
  'letter-spacing',
  'font-size',
  'text-color',
  'remove-styles',
  'separator',
  'link',
];

export default class EditorTextarea extends React.Component<Props, State> {
  constructor (props: any) {
    super(props);
    this.submitContent = this.submitContent.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.imageFileUploadSuccess = this.imageFileUploadSuccess.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      focus: false,
      text: props.value || '',
      editorState: void 0,
      imageUploadVisible: false,
    };
  }
  componentDidMount () {
    this.updateEditorState(this.props.value);
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps (next: Props) {
    const state = this.state;
    if (next.value !== state.text) {
      this.updateEditorState(next.value);
    }
  }
  // 更新 editor 对象
  private updateEditorState(value?: string): EditorState {
    const editorState = this.createEditorState(value);
    const text = this.getEditorContent(editorState);
    if (this.state.editorState) {
      if (this.state.text === text) {
        return this.state.editorState;
      }
    }
    this.setState({ text, editorState });
    return editorState;
  }
  // 获取 editor 内容
  private getEditorContent(editorState?: EditorState): string {
    const editor = editorState || this.state.editorState;
    const text = _.trim(editor.toHTML());
    return text === '<p></p>' ? '' : text;
  }
  submitContent (value?: string): void {
    if (this.props.onChange) {
      const text = value ? value : this.getEditorContent();
      this.props.onChange(text);
    }
  }
  // 点击图片上传
  private onClickImage() {
    this.setState({
      imageUploadVisible: true
    });
  }
  // 隐藏图片上传
  private async onVisibleChange (): Promise<void> {
    return new Promise((resolve) => {
      this.setState({
        imageUploadVisible: false
      }, resolve);
    });
  }
  // 图片上传
  private async imageFileUploadSuccess(url: string): Promise<void> {
    await this.onVisibleChange();
    const img = `<img src="${url}"/>`;
    const value = this.getEditorContent();
    const html = value ? `<div>${img}</div>` : `<p>${img}</p>`;
    const editorState = this.insertValue(html);
    this.handleEditorChange(editorState);
  }
  private insertValue(value: string): EditorState {
    if (this.state.focus) {
      const editorState = ContentUtils.insertHTML(this.state.editorState, value);
      return editorState;
    } else {
      const text = this.getEditorContent();
      const editorState = this.createEditorState(`${text}${value}`);
      return editorState;
    }
  }
  // 创建 editor 对象
  private createEditorState(html?: string | number): BraftEditor {
    if (html || html === 0) {
      return BraftEditor.createEditorState(String(html));
    }
    return BraftEditor.createEditorState('');
  }
  // 获取图片上传功能节点
  private getImageUploadNode(): React.ReactNode {
    const data = { type: 'goods' };
    return (<div>
      <Upload accept="image/*" data={ data } onSuccess={ this.imageFileUploadSuccess }></Upload>
    </div>);
  }
  private getImageNode(): any {
    const comp = {
      type: 'button',
      key: 'custom-button-img',
      onClick: this.onClickImage,
      text: (
        <div className="dropdown-handler" data-title="图片上传">
          <Popover content={ this.getImageUploadNode() } placement="bottom" trigger="click" visible={this.state.imageUploadVisible} onVisibleChange={this.onVisibleChange}>
            <FileImageOutlined />
          </Popover>
        </div>
      ),
    };
    return comp;
  }
  // 获取富文本功能列表
  private getControls(): Array<any> {
    const list = [].concat(controls, this.getImageNode());
    return _.compact(list);
  }
  private onFocus (): void {
    this.setState({ focus: true });
  }
  private onBlur(): void {
    this.setState({ focus: false });
  }
  // 富文本内容修改事件
  private handleEditorChange (editorState: EditorState): void {
    const text = this.getEditorContent(editorState);
    this.setState({ text, editorState }, () => {
      this.submitContent(text);
    });
  }
  render () {
    const { editorState } = this.state;
    const props: any = {
      value: editorState,
      language: 'zh', // 中文
      readOnly: this.props.readOnly,
      controls: this.getControls(),
      onChange: this.handleEditorChange,
      onSave: this.submitContent,
      onFocus: this.onFocus, 
      onBlur: this.onBlur
    };
    return (
      <div className="editor-box border">
        <BraftEditor { ...props }/>
      </div>
    );
  }
}