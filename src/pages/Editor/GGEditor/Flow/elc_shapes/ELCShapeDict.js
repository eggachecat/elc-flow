import RawDataNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/RawDataNode';
import OperatorNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/OperatorNode';
import StaticDataNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/StaticDataNode';
import ModuleNode from '@/pages/Editor/GGEditor/Flow/elc_shapes/ModuleNode';

export default {
  [RawDataNode.shape]: RawDataNode,
  [OperatorNode.shape]: OperatorNode,
  [StaticDataNode.shape]: StaticDataNode,
  [ModuleNode.shape]: ModuleNode,
};
