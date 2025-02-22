import semver from 'semver'
import chalk from 'chalk'
import { program } from 'commander'
import { dirname } from 'dirname-filename-esm';
import path from 'node:path'
import fse from 'fs-extra'
import { log } from '@wangyao1994/cli-test-utils'

const LOWEST_NODE_VERSION = '18.0.0'
const __dirname = dirname(import.meta);
const pkg = fse.readJsonSync(path.resolve(__dirname, '../package.json'))

// 检查node版本，在action之前
const checkNodeVersion = () => {
  log.verbose('node version: ', process.version)
  if(semver.lt(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(chalk.red(`node版本过低，最低版本: ${LOWEST_NODE_VERSION}`))
  }
}

export default () => {
  log.info(`version: ${pkg.version}`)
  
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d --debug', '调试模式', false)
    .hook('preAction', checkNodeVersion)

  return program
}