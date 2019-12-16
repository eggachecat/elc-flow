/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { Card, Divider, Form, Input, Select } from 'antd';
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

const FUNCTION_DICT = {
  'jack': {
    'input': [
      { 'name': 'hot_water', 'type': 'dataframe', optional: false },
    ],
    'output': [
      { 'name': 'hot_water', 'type': 'dataframe', optional: false },
    ],
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
    const { form } = this.props;
    // eslint-disable-next-line camelcase
    const { label, '_elc_meta': { 'function': _elc_function } = {} } = this.item.getModel();

    const f = form.getFieldValue('_elc_meta.function') || _elc_function;
    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="Function" {...inlineFormItemLayout}>
          {form.getFieldDecorator('_elc_meta.function', {
            initialValue: _elc_function,
          })(<Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={this.handleSubmit}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>)}
        </Item>
        <Divider />
        <div>Input:</div>
        {
          FUNCTION_DICT[f] && FUNCTION_DICT[f].input.map((v, i) => {
            return <span>{i}.&nbsp;{v.name}</span>;
          })
        }
        <Divider />
        <div>Output:</div>
        {
          FUNCTION_DICT[f] && FUNCTION_DICT[f].output.map((v, i) => {
            return <span>{i}.&nbsp;{v.name}</span>;
          })
        }
      </Fragment>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

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
        <Form onSubmit={this.handleSubmit} {...formItemLayout} labelAlign='left'>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(DetailForm));
