import path from 'node:path'
import { execaNode } from 'execa'
import {expect, test} from '@jest/globals';

const CLI = path.join(__dirname, '../bin/cli.js')
const bin = () => (...args) => execaNode(CLI, args)

// 运行错误命令
test('run err command', async () => {
  const { stderr } = await bin()('iii')
  expect(stderr).toContain('未知命令：iii')
})

// 测试help不报错
test('command help ok', async () => {
  let err = null
  try {
    await bin()('--help')
  } catch(e) {
    err = e
  }
  expect(err).toBe(null)
})

// 测试版本正确显示
test('show correct version', async () => {
  const { stdout } = await bin()('-V')
  expect(stdout).toContain(require('../package.json').version)
})