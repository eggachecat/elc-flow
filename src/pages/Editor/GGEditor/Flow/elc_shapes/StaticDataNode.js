/*
* 这个就是原始数据的node
* 它的属性可以选择influxdb的数据
* */
import React, { Fragment, useState } from 'react';
import acsvg from '@/pages/Editor/GGEditor/Flow/ac.svg';
import { RegisterNode } from 'gg-editor';
import ELCShape from '@/pages/Editor/GGEditor/Flow/elc_shapes/ELCShape';
import { Divider, Form, Input, Select } from 'antd';
import { cloneDeep } from 'lodash';

import variables from './variables_dictionary';

const { Item } = Form;
const { Option } = Select;
export default class StaticDataNode extends ELCShape {

  static shape = 'static-data-node';

  // 配置的form
  static configForm = ({ handleSubmit, updateItem, item, form }) => {

    const [currentVariable, setCurrentVariable] = useState(null);

    const { label, _elc_variable, _elc_node_type, _elc_parameters = {}, display_name } = item.getModel();

    return <Fragment>
      <Item label="名称" {...ELCShape.inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={handleSubmit} />)}
      </Item>
      <Item label="变量" {...ELCShape.inlineFormItemLayout}>
        {form.getFieldDecorator('_elc_variable', {
          initialValue: _elc_variable,
        })(
          <Select
            showSearch
            placeholder="Select a Variable"
            onChange={e => {
              handleSubmit(e);
              setCurrentVariable(e);
              updateItem({
                label: e,
              });
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Object.keys(variables).map(k => (
              <Option value={k} key={k}>
                {k || variables[k].name}
              </Option>
            ))}
          </Select>,
        )}
      </Item>
      <Divider />
      <h5>信息:</h5>
      <span><b>名称</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{variables[currentVariable] && variables[currentVariable].name}</span><br />
      <span><b>单位</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{variables[currentVariable] && variables[currentVariable].unit}</span>
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

      anchor: [[0.5, 0], [0.5, 1]],
    };


    return <RegisterNode name="static-data-node" config={config} extend="flow-capsule" />;
  }
}
