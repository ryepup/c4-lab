import { parse } from '../parse'
import { prepareForRendering } from '../codegen'
import toDOT from './dot'
import empty from './empty.dot'
import simple from './simple.dot'
import twoActors from './two-actors.dot'


const buildGraph = text => prepareForRendering(parse(text))
const hrefTo = () => { };

describe('dot', () => {

  it('renders empty graph', () => {
    const graph = buildGraph(``)

    expect(toDOT(hrefTo, graph)).toEqualTrimmed(empty);
  });

  it('renders one actor', () => {
    const graph = buildGraph(`(actor ("foo"))`)

    expect(toDOT(hrefTo, graph)).toEqualTrimmed(simple);
  });

  it('renders two actors', () => {
    const graph = buildGraph(`(actor ("foo"))(actor ("bar"))`)

    expect(toDOT(hrefTo, graph)).toEqualTrimmed(twoActors);
  });

});
