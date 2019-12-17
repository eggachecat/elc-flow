import React from 'react';
import { Col, Row } from 'antd';
import GGEditor, { Flow, RegisterNode, withPropsAPI } from 'gg-editor';
import { connect } from 'dva';
import EditorMinimap from '../components/EditorMinimap';
import { FlowContextMenu } from '../components/EditorContextMenu';
import { FlowToolbar } from '../components/EditorToolbar';
import { FlowItemPanel } from '../components/EditorItemPanel';
import { FlowDetailPanel } from '../components/EditorDetailPanel';
import styles from './index.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

class CustomNode extends React.Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);

        // 绘制图标
        const group = item.getGraphicGroup();
        const model = item.getModel();

        group.addShape('image', {
          attrs: {
            x: -15,
            y: -25,
            width: 30,
            height: 30,
            img: model.icon,
          },
        });

        // 绘制标签
        this.drawLabel(item);

        return keyShape;
      },

      anchor: [
        [0.5, 0], // 上边中点
        [0.5, 1], // 底边中点
      ],
    };

    return <RegisterNode name="custom-node" config={config} extend="flow-circle" />;
  }
}

@connect(({ flow }) => ({ flow }))
class FlowPage extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.flowRef = React.createRef();
  }

  componentDidMount() {
    const { propsAPI, dispatch } = this.props;
    // const { save } =  propsAPI;

    console.log('propsAPI', propsAPI);
    dispatch({
      type: 'flow/fetchFunctions',
    });
  }

  render() {
    const {
      flow: { elc_functions },
    } = this.props;
    return (
      <GridContent>
        <GGEditor className={styles.editor}>
          <Row type="flex" className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar />
            </Col>
          </Row>
          <Row type="flex" className={styles.editorBd}>
            <Col span={2} className={styles.editorSidebar}>
              <FlowItemPanel />
            </Col>
            <Col span={16} className={styles.editorContent}>
              <Flow
                className={styles.flow}
                onAfterChange={data => {
                  // setData(data);
                  console.log('data', data);
                  console.log('this.flowRef', this.flowRef.current.graph);
                }}
                ref={this.flowRef}
              />
              <CustomNode />
            </Col>
            <Col span={6} className={styles.editorSidebar}>
              <FlowDetailPanel elc_functions={elc_functions} />
              <EditorMinimap />
            </Col>
          </Row>
          <FlowContextMenu />
        </GGEditor>
      </GridContent>
    );
  }
}

export default withPropsAPI(FlowPage);
//
// const FlowPage = () => {
//
//   const [data, setData] = useState({
//     nodes: [{
//       type: 'node',
//       size: '70*70',
//       shape: 'flow-circle',
//       color: '#FA8C16',
//       label: '起止节点',
//       x: 55,
//       y: 55,
//       id: 'ea1184e8',
//       index: 0,
//     }, {
//       type: 'node',
//       size: '70*70',
//       shape: 'flow-circle',
//       color: '#FA8C16',
//       label: '结束节点',
//       x: 55,
//       y: 255,
//       id: '481fbb1a',
//       index: 2,
//     }],
//     edges: [{
//       source: 'ea1184e8',
//       sourceAnchor: 2,
//       target: '481fbb1a',
//       targetAnchor: 0,
//       id: '7989ac70',
//       index: 1,
//     }],
//   });
//   return (
//     <PageHeaderWrapper
//       hiddenBreadcrumb
//       title={<FormattedMessage id="app.editor.flow.title"/>}
//       content={<FormattedMessage id="app.editor.flow.description"/>}
//     >
//       {JSON.stringify(data)}
//       <GGEditor className={styles.editor}>
//         <Row type="flex" className={styles.editorHd}>
//           <Col span={24}>
//             <FlowToolbar/>
//           </Col>
//         </Row>
//         <Row type="flex" className={styles.editorBd}>
//           <Col span={4} className={styles.editorSidebar}>
//             <FlowItemPanel/>
//           </Col>
//           <Col span={16} className={styles.editorContent}>
//             <Flow className={styles.flow} data={data} onBeforeChange={data => {
//               // setData(data);
//               console.log('data', data)
//             }}/>
//           </Col>
//           <Col span={4} className={styles.editorSidebar}>
//             <FlowDetailPanel/>
//             <EditorMinimap/>
//           </Col>
//         </Row>
//         <FlowContextMenu/>
//       </GGEditor>
//     </PageHeaderWrapper>
//   );
// };
//
// export default FlowPage;
