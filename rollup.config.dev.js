const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')

const inputPath = path.resolve(__dirname, './src/index.js')
const outputUmdPath = path.resolve(__dirname, './dist/payfun.kong.js')
module.exports = {
  input: inputPath,
  output: [
    {
      name: 'payfunOps',
      file: outputUmdPath,
      format: 'umd',
      globals: {
        'KongLib': 'KongLib'
      }
    }
  ],
  plugins: [ // 需要按顺序

    resolve(),// 解析外部依赖, 将外部依赖打包到项目中(混合打包)
    commonjs(),
    babel({exclude: 'node_modules/**', runtimeHelpers: true}),
    json()
  ],
  external: ['node-kong-admin']
}
