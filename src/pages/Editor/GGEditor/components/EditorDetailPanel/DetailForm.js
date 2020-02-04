/* eslint-disable camelcase */
import React, { createElement, Fragment } from 'react';
import { Card, Col, Divider, Form, Icon, Input, Row, Select } from 'antd';
import { withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';
import { cloneDeep } from 'lodash';
import ELCShapeDict from '@/pages/Editor/GGEditor/Flow/elc_shapes/ELCShapeDict';

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

class DetailForm extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  get item() {
    /*
    * 使得有了一个item的属性
    * */
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  updateItem = values => {
    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    const item = getSelected()[0];

    if (!item) {
      return;
    }
    executeCommand(() => {
      update(item, {
        ...values,
      });
    });
  };

  handleSubmit = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        const item = getSelected()[0];

        if (!item) {
          return;
        }

        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  renderEdgeShapeSelect = () => {
    return (
      <Select onChange={this.handleSubmit}>
        <Option value="flow-smooth">Smooth</Option>
        <Option value="flow-polyline">Polyline</Option>
        <Option value="flow-polyline-round">Polyline Round</Option>
      </Select>
    );
  };

  renderNodeDetail = () => {
    const { form, elc_functions = {} } = this.props;
    // eslint-disable-next-line camelcase
    const { shape } = this.item.getModel();
    console.log('detail for', this.item.getModel());

    if (shape in ELCShapeDict) {
      return createElement(ELCShapeDict[shape].configForm, {
        handleSubmit: this.handleSubmit,
        updateItem: this.updateItem,
        item: this.item,
        form,
        elc_functions,
      });
    }
    return null;
  };

  renderEdgeDetail = () => {
    const { form, propsAPI, elc_functions = {}, debug_info = null } = this.props;
    const {
      id,
      label = '',
      shape = 'flow-smooth',
      source,
      target,
      _elc_source_output_id,
      _elc_target_input_id,
    } = this.item.getModel();

    // const { model: sourceNode } = propsAPI.find(source);
    // const { model: targetNode } = propsAPI.find(target);

    const _sourceNode = propsAPI.find(source);
    const _targetNode = propsAPI.find(target);
    const sourceNode = _sourceNode && _sourceNode.model;
    const targetNode = _targetNode && _targetNode.model;

    console.log(sourceNode, targetNode);

    const { outputs: _outputs } = (sourceNode && elc_functions[sourceNode._elc_function]) || {};
    const { inputs: _inputs } = (targetNode && elc_functions[targetNode._elc_function]) || {};

    const data_metadata =
      debug_info &&
      debug_info.edge_dict &&
      debug_info.edge_dict[id] &&
      debug_info.edge_dict[id].data;
    const data_type = data_metadata && data_metadata.__elc_type__;
    let data = null;

    switch (data_type) {
      case 'NDARRAY':
        data = data_metadata.__elc_data__.join(', ');
        break;
      case undefined:
      default:
        data = data_metadata;
    }

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit}/>)}
        </Item>
        <Item label="Shape" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(this.renderEdgeShapeSelect())}
        </Item>
        _elc_node_type: {sourceNode._elc_node_type}
        {sourceNode._elc_node_type === 'operator' && (
          <Input.Group>
            {_inputs && _outputs && (
              <div>
                <Divider style={{ margin: '10 0' }}/>
                <h5>
                  Mapping
                  <Icon
                    type="copy"
                    onClick={() => {
                      setTimeout(() => {
                        const _label = `${this.item.getModel()._elc_source_output_id} -> ${
                          this.item.getModel()._elc_target_input_id
                        }`;
                        console.log('_label', _label);
                        form.setFieldsValue({
                          label: _label,
                        });
                        this.updateItem({
                          label: _label,
                        });
                      });
                    }}
                  />
                </h5>
                <Row gutter={8} style={{ marginTop: 25 }}>
                  <Col span={10}>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={_elc_source_output_id}
                      onChange={v => {
                        this.updateItem({
                          _elc_source_output_id: v,
                        });
                      }}
                    >
                      {_outputs.map(v => (
                        <Select.Option value={v} key={v}>
                          {v}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      lineHeight: '32px',
                      textAlign: 'center',
                    }}
                  >
                    <Icon type="arrow-right"/>
                  </Col>
                  <Col span={10}>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={_elc_target_input_id}
                      onChange={v => {
                        this.updateItem({
                          _elc_target_input_id: v,
                        });
                      }}
                    >
                      {_inputs.map(v => (
                        <Select.Option value={v} key={v}>
                          {v}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </div>
            )}
          </Input.Group>
        )}
        {sourceNode._elc_node_type === 'data' && (
          <Input.Group>
            {_inputs && (
              <div>
                <Divider style={{ margin: '10 0' }}/>
                <h5>
                  Mapping
                  <Icon
                    type="copy"
                    onClick={() => {
                      setTimeout(() => {
                        const _label = `${this.item.getModel()._elc_target_input_id}`;
                        console.log('_label', _label);
                        form.setFieldsValue({
                          label: _label,
                        });
                        this.updateItem({
                          label: _label,
                        });
                      });
                    }}
                  />
                </h5>
                <Select
                  style={{ width: '100%' }}
                  defaultValue={_elc_target_input_id}
                  onChange={v => {
                    this.updateItem({
                      _elc_target_input_id: v,
                      _elc_source_output_id: null,
                    });
                  }}
                >
                  {_inputs.map(v => (
                    <Select.Option value={v} key={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
          </Input.Group>
        )}
        <Divider/>
        <h5>
          <b>数据</b>
        </h5>
        {data && (
          <Fragment>
            <div>类型: {data_type}</div>
            <div>数据: {data}</div>
          </Fragment>
        )}
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { form } = this.props;
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Item label="Label" {...inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={this.handleSubmit}/>)}
      </Item>
    );
  };

  render() {
    /*
    * 这边用来对每一种的type的node进行配置
    * 现在一个个来:
    *   1. raw-data
    *   2. preprocessing
    *   3. data
    * */
    const { type } = this.props;

    console.log(type);

    // console.log(this.item)

    if (!this.item) {
      return null;
    }
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    };


    return (
      <Card type="inner" size="small" title={upperFirst(this.item.getModel()._elc_node_type || type)} bordered={false}>
        <Form onSubmit={this.handleSubmit} {...formItemLayout} labelAlign="left">
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(DetailForm));
