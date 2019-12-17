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

            const jsonData = propsAPI.save();
            const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(jsonData),
            )}`;
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute(
              'download',
              `flow.json`,
            );
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
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
                'size': '80*48',
                'shape': 'flow-rect',
                'color': '#1890FF',
                'label': '加法',
                'x': 157.5,
                'y': 165,
                'id': 'ea1184e8',
                'index': 1,
                'parent': '142e4796',
                '_elc_function': 'elc_add',
              }, {
                'type': 'node',
                'size': '80*48',
                'shape': 'flow-rect',
                'color': '#1890FF',
                'label': '乘法',
                'x': 23.5,
                'y': 223,
                'id': '481fbb1a',
                'index': 2,
                'parent': '142e4796',
                '_elc_function': 'elc_mul',
              }],
              'edges': [{
                'source': 'ea1184e8',
                'sourceAnchor': 2,
                'target': '481fbb1a',
                'targetAnchor': 0,
                'id': '7989ac70',
                'index': 3,
              }],
              'groups': [{ 'id': '142e4796', 'x': -12, 'y': 129.5, 'label': '预处理', 'index': 0 }],
            });
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
