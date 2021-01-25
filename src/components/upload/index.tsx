/**
 * @file 封装文件上传
 * @description
 */

import _ from 'lodash';
import React from 'react';
import * as Antd from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { uploadFile } from 'src/model/common';

interface Props extends UploadProps {
  value?: string;
  onChange?: (e: any) => void;
  onSuccess?: (e: any) => void;
  onFileUPload?: (file: File) => string;
  remove?: boolean;
  onRemove?: () => void;
  children?: React.ReactElement | Array<React.ReactElement>;
  [key: string]: any;
}

// 图片处理
/*
const getBase64 = function(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      resolve(reader.result as string);
    };
    reader.onerror = function(error) {
      reject(error);
    };
  });
};
*/

export default class Upload extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    this.onUpload = this.onUpload.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }
  protected onRemove(): void {
    if (this.props.onRemove) {
      this.props.onRemove();
    }
  }
  private onFileChange(): void {
    // todo onChange 在文件上传后触发
  }
  // 文件上传后回调逻辑
  private onUploadCallback(src: string): void {
    // 触发上传完成事件
    if (this.props.onChange) {
      this.props.onChange(src);
    }
    if (this.props.onSuccess) {
      this.props.onSuccess(src);
    }
  }
  // 后期改为接口上传
  async onFileUpload(file: File): Promise<void> {
    try {
      // 判断是否有自定义的文件上传逻辑
      if (this.props.onFileUPload) {
        const src = await Promise.resolve(this.props.onFileUPload(file));
        this.onUploadCallback(src);
      } else {
        const formData = new FormData();
        formData.append(this.props.name || 'image', file);
        if (this.props.data) {
          _.each(this.props.data, function (value: any, key: string) {
            formData.append(key, value);
          });
        }
        // 上传文件
        const src = await uploadFile<string>(formData);
        this.onUploadCallback(src);
      }
    } catch (error) {
      console.log(error);
    }
  }
  private onUpload(file: File): boolean {
    this.onFileUpload(file);
    // 不使用默认的上传
    return false;
  }
  private getContent() {
    if (this.props.children) {
      return this.props.children;
    }
    if (this.props.value) {
      const style = {
        maxHeight: '100%',
      };
      return (<img className="dibk" style={style} width={100} src={this.props.value} />);
    }
    return (<PlusOutlined />);
  }
  render() {
    // 排除
    const omitKeys = ['value', 'onChange', 'beforeUpload', 'onFileUPload', 'onSuccess', 'children', 'onRemove', 'remove'];
    const omit: Props = _.omit(this.props, omitKeys);
    const props: UploadProps = _.assign({
      multiple: false,
      listType: 'picture-card',
      fileList: [],
      showUploadList: false,
    }, omit, {
      onChange: this.onFileChange,
      // 上传前
      beforeUpload: this.onUpload,
    });
    const $upload = (<Antd.Upload {...props}>{ this.getContent()}</Antd.Upload>);
    if (this.props.remove) {
      return (<div className="dibk upload-box">
        { $upload }
        <DeleteTwoTone className="upload-remove font-18" onClick={ this.onRemove }/>
      </div>);
    }
    return $upload;
    
  }
}