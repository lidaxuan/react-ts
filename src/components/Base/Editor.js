import { uniqueId } from '@/utils';

export default class Editor {
  constructor() {
    this.id = uniqueId();
  }
  getGraph() {
    return this.graph;
  }
  emit(event, params) {
    console.log(event, params);
    
    if (event === 'afterAddPage') {
      this.graph = params.graph;
    }
  }
  on(event) {
    switch (event) {
    case 'changeNodeData':
      this.graph.refresh();
      break;
    }
  }
  add(type, item) {
    this.graph.add(type, item);
  }
  update(item, model) {
    this.graph.update(item, model);
  }
  remove(item) {
    const node = this.graph.findById(item.id);
    this.graph.remove(node);
  }
}