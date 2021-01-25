/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-08 10:47:14
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 14:30:55
 * @FilePath: /decision-web/src/command/sandbox.js
 */

import ProcessingData from '@/command/preserve';
import { saveDataAdd3, getTestStatus, delTestData, gototest } from '@/model/decision/index'; // 接口请求
import process from '@/env/index';
import _ from 'lodash';


export default {
  data() {
    return {
      interval: null,
      intervalPercentage: null,
      percentage: 0,
      customColor: '#409eff',
    };
  },
  computed: {
    getUrl() {
      const id = this.$route.query.editId;
      return `${process.env.VUE_APP_API_Domain4}/decision/tree/uploadTestData/${id}`;
    },
    jumpSandbox() {
      return `${window.location.href}&sand=1`;
    }
  },
  created() {
    this.$emit('update:maskvisible', false);
    this.$emit('update:customColor', this.customColor);
  },
  methods: {
    // 保存并发布
    saveData() {
      this.onlineBtnLoding = true;
      let preserveFn = new ProcessingData('SANDBOX');
      const res = preserveFn.save();
      if (!res) {
        this.onlineBtnLoding = false;
        return;
      }
      if (_.isArray(res)) { // 走到这里是id
        this.$parent.editCurrentNodeColor(res, 'red'); // 当前节点id
        this.onlineBtnLoding = false;
        return;
      }
      if (_.isObject(res)) {
        res.treeDetail = JSON.stringify(res.treeDetail);
        this.createSave(res);
      }
    },
    async createSave(data) {
      const result = await saveDataAdd3(data);
      if (result && result.id) {
        const url = `${window.location.origin}/plan/edit?editId=${result.id}&sand=1`;
        window.open(url);
      }
      this.onlineBtnLoding = false;
    },
    // 下载样本
    async download() {
      const id = this.$route.query.editId;
      
      const res = await gototest(id);
      if (res && res.id) {
        const url = `${process.env.VUE_APP_API_Domain4}/decision/tree/download/${id}`;
        let a = document.createElement('a');
        a.target = '_blank';
        a.href = url;
        document.body.append(a);
        a.click();
        // this.checkStatus();
        // this.$emit('update:maskvisible', true);
      }
    },
    // 上传样本
    onUploadFileSuccess (res) {
      if (res && res.id) {
        this.$message.success('文件上传成功');
        this.checkStatus();
        this.$emit('update:maskvisible', true);
      }
    },
    // 更新数据
    updateDesition() {
      const url = window.location.href;
      window.location.href = url;
      // this.$parent.updateDesition();
      // setTimeout(() => {
      //   this.$message.success('刷新成功');
      // }, 1000);
    },
    async clearData() {
      const id = this.$route.query.editId;
      const res = await delTestData(id);
      console.log(res);
      if (res && res.id) {
        this.$message.success('清除成功');
        this.updateDesition();
      }
    },
    checkStatus() {
      this.percentage = 0;
      this.$emit('update:percentage', this.percentage);
      if(this.interval !== null){//判断计时器是否为空
        clearInterval(this.interval);
        this.interval = null;
      }
      this.interval = setInterval(this.sendData,2000);//启动计时器，调用sendData函数，
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    },
    async sendData() {
      const id = this.$route.query.editId;
      const res = await getTestStatus(id);
      
      if (res.testStatus === 'START') {
        this.percentage += 1;
        this.$emit('update:percentage', this.percentage);
        // this.$message.error('当前决策树正在测试中');
      } else if (res.testStatus === 'END') {
        if (res && res.id) {
          this.updateDesition();
          this.stop();
          this.percentage = 100;
          this.$emit('update:percentage', this.percentage);
          setTimeout(() => {
            this.$emit('update:maskvisible', false);
          }, 1000);
          // let a = document.createElement('a');
          // a.target = '_blank';
          // a.href = res.filePath;
          // document.body.append(a);
          // a.click();
        } else {
          this.$message.error('文件下载失败');
        }
      }
    }
  }
};