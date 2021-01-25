import sharedTraffic from '@/assets/icons/flow/sharedTraffic.svg';

import frequencyControl from '@/assets/icons/basic/frequencyControl.svg';
import trackingControl from '@/assets/icons/basic/trackingControl.svg';
import address from '@/assets/icons/basic/address.svg';
import crowd from '@/assets/icons/basic/crowd.svg';
import tag from '@/assets/icons/basic/tag.svg';
import controlSetting from '@/assets/icons/basic/controlSetting.svg';
import dateOrientation from '@/assets/icons/basic/dateOrientation.svg';
import timeOrientation from '@/assets/icons/basic/timeOrientation.svg';
import budgetSettings from '@/assets/icons/basic/budgetSettings.svg';
import ipOrientation from '@/assets/icons/basic/ipOrientation.svg';

import flowDistribution from '@/assets/icons/control/flowDistribution.svg';
import releaseNode from '@/assets/icons/control/releaseNode.svg';
import releaseNodeActive from '@/assets/icons/control/releaseNodeActive.svg';
import sharingNode from '@/assets/icons/control/sharingNode.svg';
import fork from '@/assets/icons/control/fork.svg';

const svgIcons = {
  SHAREMEDIA: sharedTraffic, // 共享流量
  FREQUENCY: frequencyControl, // 频次控制
  FOLLOW: trackingControl, // 追频控制
  AREA: address, // 地域定向
  CROWD: crowd, // 人群定向
  LABEL: tag, // 标签定向
  FLOW: controlSetting, // 控量设置
  DATE: dateOrientation, // 日期定向
  TIME: timeOrientation, // 时间定向
  BUDGET: budgetSettings, // 预算设置
  IP: ipOrientation, // IP定向
  FLOWDIS: flowDistribution, // 流量分配
  ORDER: releaseNodeActive, // 投放节点
  CLOSE_ORDER_Img: releaseNode, // 投放节点--关闭
  SHARE: sharingNode, // 分享节点
  FORK: fork, // 分叉
};

export default svgIcons;