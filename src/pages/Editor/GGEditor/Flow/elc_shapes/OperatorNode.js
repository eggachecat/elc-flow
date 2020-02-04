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

const { Item } = Form;
const { Option } = Select;
export default class OperatorNode extends ELCShape {

  static shape = 'operator-node';

  // 配置的form
  static configForm = ({ handleSubmit, updateItem, item, form, elc_functions }) => {

    const [currentFunctionName, setCurrentFunctionName] = useState(null);

    const { label, _elc_function, _elc_node_type, _elc_parameters = {}, display_name } = item.getModel();
    const f_name = currentFunctionName || _elc_function;
    const f_detail = elc_functions[f_name] || { inputs: [], outputs: [] };

    // 这边瞎弄一个 到时候放到数据库

    return <Fragment>
      <Item label="名称" {...ELCShape.inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={handleSubmit} disabled />)}
      </Item>
      <Item label="算子" {...ELCShape.inlineFormItemLayout}>
        {form.getFieldDecorator('_elc_function', {
          initialValue: _elc_function,
        })(
          <Select
            showSearch
            placeholder="Select a Function"
            onChange={e => {
              handleSubmit(e);
              setCurrentFunctionName(e);
              if (elc_functions[e] && elc_functions[e].parameters) {
                console.log('rua', {
                  _elc_parameters: cloneDeep(elc_functions[e].parameters),
                });
                updateItem({
                  _elc_parameters: cloneDeep(elc_functions[e].parameters),
                });
              }
              updateItem({
                label: e,
              });
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Object.keys(elc_functions).map(k => (
              <Option value={k} key={k}>
                {elc_functions[k].display_name || elc_functions[k].name}
              </Option>
            ))}
          </Select>,
        )}
      </Item>
      <Divider />
      <Fragment>
        <h5>描述</h5>
        {f_detail.description}
        <Divider />

        {f_detail.parameters && (
          <Fragment>
            <h5>参数</h5>
            {Object.keys(f_detail.parameters).map(p => (
              <Item
                label={p.length > 10 ? p.substring(10) : p}
                labelCol={{ sm: { span: 12 } }}
                wrapperCol={{ sm: { span: 12 } }}
              >
                {form.getFieldDecorator(`_elc_parameters.${p}`, {
                  initialValue: _elc_parameters[p],
                })(<Input onBlur={handleSubmit} />)}
              </Item>
            ))}
            <Divider />
          </Fragment>
        )}
        <h5>输入:</h5>
        {f_detail.inputs.map((v, i) => {
          return (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{i + 1}.&nbsp;<b>{v}</b>
              <br />
            </span>
          );
        })}
        <Divider />
        <h5>输出:</h5>
        {f_detail.outputs.map((v, i) => {
          return (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{i + 1}.&nbsp;<b>{v}</b>
              <br />
            </span>
          );
        })}
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

      anchor: [[0.5, 0], [0.5, 1]],
    };

    return <RegisterNode name="operator-node" config={config} extend="flow-rect" />;
  }
}
