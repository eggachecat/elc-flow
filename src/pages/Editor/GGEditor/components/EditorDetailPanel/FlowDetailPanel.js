import React from 'react';
import { Card } from 'antd';
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from 'gg-editor';
import DetailForm from './DetailForm';
import styles from './index.less';

const FlowDetailPanel = props => {
  console.log('create FlowDetailPanel', props);
  return (
    <DetailPanel className={styles.detailPanel}>
      <NodePanel>
        <DetailForm type="node" {...props} />
      </NodePanel>
      <EdgePanel>
        <DetailForm type="edge" {...props} />
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" {...props} />
      </GroupPanel>
      <MultiPanel>
        <Card type="inner" size="small" title="Multi Select" bordered={false} />
      </MultiPanel>
      <CanvasPanel>
        <Card type="inner" size="small" title="Canvas" bordered={false} />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default FlowDetailPanel;
