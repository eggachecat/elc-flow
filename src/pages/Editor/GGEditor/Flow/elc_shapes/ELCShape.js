/*
* 这个就是原始数据的node
* 它的属性可以选择influxdb的数据
* */
import React from 'react';
import acsvg from '@/pages/Editor/GGEditor/Flow/ac.svg';
import { RegisterNode } from 'gg-editor';

export default class ELCShape extends React.Component {

  static configForm = null;

  static inlineFormItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 18 },
    },
  };

}
