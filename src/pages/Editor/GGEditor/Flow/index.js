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
import acsvg from './ac.svg';
import RawDataNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/RawDataNode';
import OperatorNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/OperatorNode';
import StaticDataNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/StaticDataNode';
import ModuleNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/ModuleNode';

@connect(({ flow }) => ({ flow }))
class FlowPage extends React.Component {
  state = {
    debug_info: null,
  };

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

  setDebugInfo = info => {
    this.setState({ debug_info: info });
  };

  render() {
    const {
      flow: { elc_functions },
    } = this.props;
    return (
      <GridContent>
        <GGEditor className={styles.editor}>
          <Row type="flex" className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar setDebugInfo={this.setDebugInfo} />
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
              <RawDataNode />
              <OperatorNode />
              <StaticDataNode />
              <ModuleNode />
            </Col>
            <Col span={6} className={styles.editorSidebar}>
              <FlowDetailPanel elc_functions={elc_functions} debug_info={this.state.debug_info} />
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
