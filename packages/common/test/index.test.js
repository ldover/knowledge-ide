import {computeAbsolutePath, computeRelativePath} from "../src/index.js";

describe('Compute absolute url from relative', () => {
  it('works with a simple case', () => {
    const res = computeAbsolutePath('~/X.kdl', './Y.kdl')
    expect(res).toEqual('~/Y.kdl')

  })

  it('fails when beyond bound', () => {
    const res = computeAbsolutePath('~/X.kdl', '../Y.kdl')
    expect(res).toBeNull()
  })

  it('works with a more complex cases', () => {
    const res = computeAbsolutePath('~/src/X.kdl', '../Y.kdl')
    const res2 = computeAbsolutePath('~/src/deep/deep2/X.kdl', '../../Y.kdl')
    expect(res).toEqual('~/Y.kdl')
    expect(res2).toEqual('~/src/Y.kdl')
  })

  it('works with a more complex case', () => {
    const res = computeAbsolutePath('~/src/X.kdl', '../Y.kdl')
    expect(res).toEqual('~/Y.kdl')
  })

  it('finds forward folder', () => {
    const res = computeAbsolutePath('~/X.kdl', './src/Y.kdl')
    expect(res).toEqual('~/src/Y.kdl')
  })

  it('finds backwards and forward folder', () => {
    const res = computeAbsolutePath('~/src/deep/X.kdl', '../deep2/Y.kdl')
    expect(res).toEqual('~/src/deep2/Y.kdl')
  })
})

describe('Compute relative path from two absolute paths', () => {
  it('Works with a simple case', () => {
    const res = computeRelativePath('~/X.kdl', '~/Y.kdl')
    expect(res).toEqual('./Y.kdl')

    const res2 = computeRelativePath('~/a/X.kdl', '~/a/Y.kdl')
    expect(res2).toEqual('./Y.kdl')
  })


  it('Works with a nested case', () => {
    const res = computeRelativePath('~/X.kdl', '~/src/Y.kdl')
    expect(res).toEqual('./src/Y.kdl')
  })

  it('Works with a parent case', () => {
    const res = computeRelativePath('~/src/X.kdl', '~/Y.kdl')
    expect(res).toEqual('../Y.kdl')
  })

  it('Works with a nested case', () => {
    const res = computeRelativePath('~/a/X.kdl', '~/b/Y.kdl')
    expect(res).toEqual('../b/Y.kdl')
  })

  it('It works with self', () => {
    const res = computeRelativePath('~/X.kdl', '~/X.kdl')
    expect(res).toEqual('./X.kdl')
  })
})
