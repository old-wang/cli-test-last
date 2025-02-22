import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { log } from '@wangyao1994/cli-test-utils'
import { execa } from 'execa'

const getCacheDir = (targetPath) => path.resolve(targetPath, 'node_modules')

const makeCacheDir = (targetPath) => {
  const cacheDir = getCacheDir(targetPath)
  // 创建目录
  if(!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir)
  }
}

const downloadAddTemplate = async (targetPath, template) => {
  const { npmName, version } = template
  const installCmd = 'npm'
  const installArgs = ['install', `${npmName}@${version}`]
  const cwd = targetPath
  log.verbose('installArgs:', installArgs)
  log.verbose('cwd:', cwd)
  await execa(installCmd, installArgs, { cwd })
} 

const downloadTemplate = async (selected) => {
  const { targetPath, template } = selected
  makeCacheDir(targetPath)
  const spinner = ora('正在下载模板...').start()
  try {
    await downloadAddTemplate(targetPath, template)
    spinner.stop()
    log.success('模板下载成功')
  } catch (e) {
    spinner.stop()
    log.error(e)
  }
}

export default downloadTemplate