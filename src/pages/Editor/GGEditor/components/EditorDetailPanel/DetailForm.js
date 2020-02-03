/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { Card, Col, Divider, Form, Icon, Input, Row, Select } from 'antd';
import { withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';
import { cloneDeep } from 'lodash';

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
  state = {
    current_node_function_name: null,
  };

  get item() {
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
    const { label, _elc_function, _elc_node_type, _elc_parameters = {} } = this.item.getModel();
    const f_name = this.state.current_node_function_name || _elc_function;
    const f_detail = elc_functions[f_name] || { inputs: [], outputs: [] };

    let io_panel = null;

    switch (_elc_node_type) {
      case 'data':
        break;
      case 'operator':
      default:
        io_panel = (
          <Fragment>
            {f_detail.parameters && (
              <Fragment>
                <h5>参数</h5>
                {Object.keys(f_detail.parameters).map(p => (
                  <Item label={p} {...inlineFormItemLayout}>
                    {form.getFieldDecorator(`_elc_parameters.${p}`, {
                      initialValue: _elc_parameters[p],
                    })(<Input onBlur={this.handleSubmit} />)}
                  </Item>
                ))}
                <Divider />
              </Fragment>
            )}
            <h5>输入:</h5>
            {f_detail.inputs.map((v, i) => {
              return (
                <span>
                  {i}.&nbsp;<b>{v}</b>
                  <br />
                </span>
              );
            })}
            <Divider />
            <h5>输出:</h5>
            {f_detail.outputs.map((v, i) => {
              return (
                <span>
                  {i}.&nbsp;<b>{v}</b>
                  <br />
                </span>
              );
            })}
          </Fragment>
        );
    }

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        {_elc_node_type === 'operator' && (
          <Item label="Function" {...inlineFormItemLayout}>
            {form.getFieldDecorator('_elc_function', {
              initialValue: _elc_function,
            })(
              <Select
                showSearch
                placeholder="Select a Function"
                onChange={e => {
                  this.handleSubmit(e);
                  this.setState({
                    current_node_function_name: e,
                  });

                  if (elc_functions[e] && elc_functions[e].parameters) {
                    console.log('rua', {
                      _elc_parameters: cloneDeep(elc_functions[e].parameters),
                    });
                    this.updateItem({
                      _elc_parameters: cloneDeep(elc_functions[e].parameters),
                    });
                  }
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
              </Select>
            )}
          </Item>
        )}
        <Divider />
        {io_panel}
      </Fragment>
    );
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
          })(<Input onBlur={this.handleSubmit} />)}
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
                <Divider style={{ margin: '10 0' }} />
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
                    <Icon type="arrow-right" />
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
                <Divider style={{ margin: '10 0' }} />
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
        <Divider />
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
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    };

    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
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
