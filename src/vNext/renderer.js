import Viz from 'viz.js'

export const toSvg = dot => Viz(dot, { format: "svg", engine: "dot" })