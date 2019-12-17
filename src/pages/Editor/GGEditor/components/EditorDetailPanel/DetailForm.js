/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { Card, Col, Divider, Form, Icon, Input, Row, Select } from 'antd';
import { withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';

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
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

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
    const { label, _elc_function } = this.item.getModel();

    const f_name = form.getFieldValue('_elc_meta.function') || _elc_function;
    const f_detail = elc_functions[f_name] || { inputs: [], outputs: [] };
    console.log('elc_functions', elc_functions);
    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="Function" {...inlineFormItemLayout}>
          {form.getFieldDecorator('_elc_function', {
            initialValue: _elc_function,
          })(
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.handleSubmit}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                Object.keys(elc_functions).map(k => <Option
                  value={k}
                  key={k}
                >{elc_functions[k].display_name || elc_functions[k].name}
                </Option>)
              }
            </Select>,
          )}
        </Item>
        <Divider />
        <div>Input:</div>
        {f_detail.inputs.map((v, i) => {
          return (
            <span>
              {i}.&nbsp;<b>{v}</b>
              <br />
            </span>
          );
        })}
        <Divider />
        <div>Output:</div>
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
  };

  renderEdgeDetail = () => {
    const { form, propsAPI, elc_functions = {} } = this.props;
    const { label = '', shape = 'flow-smooth', source, target } = this.item.getModel();

    const { model: sourceNode } = propsAPI.find(source);
    const { model: targetNode } = propsAPI.find(target);

    console.log(sourceNode, targetNode);

    const { outputs: _outputs } = elc_functions[sourceNode._elc_function] || {};
    const { inputs: _inputs } = elc_functions[targetNode._elc_function] || {};

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
        <Input.Group>
          {
            _inputs && _outputs && <div>
              <Divider style={{ margin: '10 0' }} />
              <h5>Mapping</h5>
              <Row gutter={8} style={{ marginTop: 25 }}>
                <Col span={10}>
                  <Select style={{ width: '100%' }}>
                    {
                      _outputs.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)
                    }
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
                  <Select style={{ width: '100%' }}>
                    {
                      _inputs.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)
                    }
                  </Select>
                </Col>
              </Row>
            </div>
          }
        </Input.Group>
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
