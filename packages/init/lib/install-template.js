import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, makeList } from '@wangyao1994/cli-test-utils'
import ora from 'ora'
import path from 'node:path'
import { homedir } from 'node:os'
import ejs from 'ejs'
import { glob } from 'glob'

const TEMP_HOME = '.cli-test'

const getCacheFilePath = (targetPath, template) => (
  path.resolve(targetPath, 'node_modules', template.npmName, 'template')
)

const getCachePluginPath = (targetPath, template) => (
  path.resolve(targetPath, 'node_modules', template.npmName, 'plugin')
)

// 删除缓存
const removeCache = async () => {
  try {
    fse.removeSync(`${homedir()}/${TEMP_HOME}`)
    log.success('删除缓存成功')
  } catch(e) {
    log.error('缓存删除失败: ', e)
  } 
}

// 拷贝模板项目文件
const copyFile = async (targetPath, template, installDir) => {
  const originFile = getCacheFilePath(targetPath, template)
  log.verbose('originFile:', originFile)
  const fileList = fse.readdirSync(originFile)
  log.verbose('fileList:', fileList)
  const spinner = ora('正在拷贝模板文件...').start()
  fileList.forEach(file => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)
  })
  spinner.stop()
  log.success('模板拷贝成功')
  removeCache()
}

// 动态渲染模板文件
const ejsRender = async (targetPath, installDir, name, template) => {
  log.verbose('ejsRenderPath:', installDir)
  // 执行插件
  let pluginData = {}
  const pluginPath = getCachePluginPath(targetPath, template)
  log.verbose('pluginPath:', pluginPath)
  if(pathExistsSync(pluginPath)) {
    const pluginFn = (await import(pluginPath).default)
    const api = { makeList }
    pluginData = await pluginFn(api)
  }

  const ejsData = {
    data: { name, ...pluginData }
  }

  const files = await glob('**', {
    cwd: installDir,
    nodir: true,
    ignore: [...template.ignore, '**/node_modules/**']
  })
  log.verbose('templateFiles:', files)
  files.forEach(file => {
    // 将文件拼成文件路径
    const filePath = path.join(installDir, file)
    ejs.renderFile(filePath, {...ejsData}, (err, res) => {
      if(err) {
        log.error(err)
        return;
      }
      fse.writeFileSync(filePath, res)
    })
  })
}

const installTemplate = async (selectedTemplate, opts) => {
  const { force = false } = opts
  const { targetPath, template, name } = selectedTemplate
  const rootDir = process.cwd()
  fse.ensureDirSync(targetPath)
  const installDir = path.resolve(`${rootDir}/${name}`)
  if(pathExistsSync(installDir)) {
    if(!force) {
      log.error(`当前目录下已存在${installDir}文件夹`)
      return;
    } else {
      fse.removeSync(installDir)
      fse.ensureDirSync(installDir)
    }
  } else {
    fse.ensureDirSync(installDir)
  }

  copyFile(targetPath, template, installDir)

  await ejsRender(targetPath, installDir, name, template)
}

export default installTemplate