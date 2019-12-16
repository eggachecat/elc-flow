import React from 'react';
import { Divider, Icon, Tooltip } from 'antd';
import { Command, Toolbar, withPropsAPI } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';
import upperFirst from 'lodash/upperFirst';
import IconFont from '@/pages/Editor/GGEditor/common/IconFont';

const FlowToolbar = (props) => {
  return (
    <Toolbar className={styles.toolbar}>
      <Tooltip
        title='保存'
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        <Icon
          type="save"
          style={{ margin: '0 12px', fontSize: 14 }}
          onClick={() => {
            const { propsAPI } = props;

            console.log(propsAPI.save());
          }}
        />
      </Tooltip>
      <Tooltip
        title='上传'
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        <Icon
          type="upload"
          style={{ margin: '0 12px', fontSize: 14 }}
          onClick={() => {
          const { propsAPI } = props;
          propsAPI.read({
            'nodes': [{
              'type': 'node',
              'size': '70*70',
              'shape': 'flow-circle',
              'color': '#FA8C16',
              'label': '起止节点',
              'x': 157.5,
              'y': 165,
              'id': 'ea1184e8',
              'index': 1,
              'parent': '142e4796',
              '_elc_meta': {
                'function': 'jack'
              }
            }, {
              'type': 'node',
              'size': '70*70',
              'shape': 'flow-circle',
              'color': '#FA8C16',
              'label': '结束节点',
              'x': 23.5,
              'y': 223,
              'id': '481fbb1a',
              'index': 2,
              'parent': '142e4796',
            }],
            'edges': [{
              'source': 'ea1184e8',
              'sourceAnchor': 2,
              'target': '481fbb1a',
              'targetAnchor': 0,
              'id': '7989ac70',
              'index': 3,
            }, {
              'source': 'ea1184e8',
              'sourceAnchor': 1,
              'target': { 'x': 191.671875, 'y': 70 },
              'id': 'd1fd123f',
              'index': 4,
            }, {
              'source': 'ea1184e8',
              'sourceAnchor': 0,
              'target': { 'x': 166.671875, 'y': 79 },
              'id': '87cbc2a1',
              'index': 5,
            }, {
              'source': 'ea1184e8',
              'sourceAnchor': 3,
              'target': { 'x': 116.671875, 'y': 125 },
              'id': '09143a82',
              'index': 6,
            }, {
              'target': '481fbb1a',
              'targetAnchor': 1,
              'source': { 'x': 369.671875, 'y': 279 },
              'id': '8f13981d',
              'index': 7,
            }],
            'groups': [{ 'id': '142e4796', 'x': -12, 'y': 129.5, 'label': 'flow', 'index': 0 }],
          })
        }}
        />
      </Tooltip>
      <Divider type="vertical" />
      <ToolbarButton command="undo" />
      <ToolbarButton command="redo" />
      <Divider type="vertical" />
      <ToolbarButton command="copy" />
      <ToolbarButton command="paste" />
      <ToolbarButton command="delete" />
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" />
      <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" />
      <ToolbarButton command="resetZoom" icon="actual-size" text="Actual Size" />
      <Divider type="vertical" />
      <ToolbarButton command="toBack" icon="to-back" text="To Back" />
      <ToolbarButton command="toFront" icon="to-front" text="To Front" />
      <Divider type="vertical" />
      <ToolbarButton command="multiSelect" icon="multi-select" text="Multi Select" />
      <ToolbarButton command="addGroup" icon="group" text="Add Group" />
      <ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" />
    </Toolbar>
  );
};

export default withPropsAPI(FlowToolbar);
