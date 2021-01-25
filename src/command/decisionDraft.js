/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-11-03 11:29:00
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-11-27 09:57:45
 * @FilePath: /decision-web/src/command/decisionDraft.js
 */

// import _ from 'lodash';


export default {
  data() {
    return {
      interval: null,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    startInterval() {
      if(this.interval !== null){//判断计时器是否为空
        this.stopInterval(); // 清除定时器
      }
      this.interval = setInterval(this.saveDraft,1000);//启动计时器，调用sendData函数，
    },
    saveDraft() {
      // me.FetchPost('/asd/asd', {courseId: me.courseId}).then( res => {
        
      // });
    },
    // 清除定时器
    stopInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },
  }
};