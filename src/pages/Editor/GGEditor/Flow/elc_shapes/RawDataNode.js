/*
* 这个就是原始数据的node
* 它的属性可以选择influxdb的数据
* */
import React, { Fragment } from 'react';
import acsvg from '@/pages/Editor/GGEditor/Flow/ac.svg';
import { RegisterNode } from 'gg-editor';
import ELCShape from '@/pages/Editor/GGEditor/Flow/elc_shapes/ELCShape';
import { Divider, Form, Input, Select } from 'antd';
import { cloneDeep } from 'lodash';

const { Item } = Form;
const { Option } = Select;
export default class RawDataNode extends ELCShape {

  static shape = 'raw-data-node';

  // 配置的form
  static configForm = ({ handleSubmit, updateItem, item, form, elc_functions }) => {


    const { label, _elc_function, _elc_node_type, _elc_parameters = {}, display_name } = item.getModel();


    return <Fragment>
      <Item label="数据" {...ELCShape.inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={handleSubmit}/>)}
      </Item>
      <Divider/>
      <Fragment>
        <div>
          <b>来源</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;捷普绿点科技沙井厂<br/>&nbsp;&nbsp;&nbsp;&nbsp;水表<br/>&nbsp;&nbsp;&nbsp;&nbsp;总水表<br/>&nbsp;&nbsp;&nbsp;&nbsp;2号总水表
        </div>
        <div><b>字段</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;水累积量(SCHPressRWaterCh)</div>
      </Fragment>
    </Fragment>;
  };

  render() {

    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);

        // 绘制图标
        const group = item.getGraphicGroup();
        const model = item.getModel();

        group.addShape('image', {
          attrs: {
            x: -36,
            y: -20,
            width: 72,
            height: 72,
          },
        });

        // 绘制标签
        this.drawLabel(item);

        return keyShape;
      },

      anchor: [[0.5, 1]],
    };

    return <RegisterNode name="raw-data-node" config={config} extend="flow-circle"/>;
  }
}
