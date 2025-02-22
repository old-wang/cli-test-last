import path from 'node:path'
import { homedir } from 'node:os'
import { log, makeList, makeInput, getLatestVersion, request } from "@wangyao1994/cli-test-utils"

// 模板
const ADD_TEMPLATE = [
  {
    name: 'react19模板',
    value: 'my-react-template',
    npmName: '@wangyao-test/react19-template',
    version: '1.0.0',
    team: 'pc',
    ignore: ['**/public/**']
  },
  {
    name: 'vue3基础模板',
    value: 'my-vue-template',
    npmName: '@wangyao-test/vue3-template',
    version: '1.0.0',
    team: 'mobile',
    ignore: ['**/public/**']
  },
  {
    name: 'elementPlus模板',
    value: 'vue-element-template',
    npmName: '@wangyao-test/vue-element-template',
    version: '1.0.0',
    team: 'pc',
    ignore: ['**/public/**']
  },
]

// 项目类型
const ADD_TEAM = [
  { value: 'pc', name: 'PC端项目' },
  { value: 'mobile', name: '移动端项目' },
]

const ADD_TYPE_PAGE = 'page'
const ADD_TYPE_PROJECT = 'project'
// 类型
const ADD_TYPE = [
  {
    name: '页面',
    value: ADD_TYPE_PAGE
  },
  {
    name: '项目',
    value: ADD_TYPE_PROJECT
  }
]

const TEMP_HOME = '.cli-test'

// 获取模板列表
const getTemplateAPI = async () => {
  return ADD_TEMPLATE
  // try {
  //   const data = await request({
  //     url: '/api/v1/project',
  //     method: 'get'
  //   })
  //   log.verbose('data: ', data)
  //   return data
  // } catch (e) {
  //   log.error('获取模板失败！')
  //   return null
  // }
}

// 创建模板类型
const getAddType = () => {
  return makeList({
    choices: ADD_TYPE,
    message: '请选择初始化类型',
    defaultValue: ADD_TYPE_PROJECT
  })
}

// 创建项目名称
const getAddName = () => {
  return makeInput({
    message: '请输入项目名称',
    defaultValue: '',
    validate(v) {
      if(v.length > 0) {
        return true
      }

      return '项目名称不能为空！'
    }
  })
}

// 选择项目类型
const getAddTeam = () => {
  return makeList({
    choices: ADD_TEAM,
    message: '请选择项目类型',
  })
}

// 选择项目模板
const getAddTemplate = (choices) => {
  return makeList({
    choices,
    message: '请选择项目模板',
  })
}

// 安装缓存目录
const makeTargetPath = () => {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}

const createTemplate = async (name, opts) => {
  const templateList = await getTemplateAPI()

  const { type, template, team } = opts

  const addType = type || await getAddType()
  log.verbose('addType:', addType)

  if(addType === ADD_TYPE_PROJECT) {
    const addName = name || await getAddName()
    log.verbose('addName:', addName)

    const addTeam = team || await getAddTeam()
    log.verbose('addTeam:', addTeam)

    // 过滤项目类型，没有时为全部
    const filterList = addTeam ? templateList.filter(item => item.team === addTeam) : templateList
    const addTemplate = template || await getAddTemplate(filterList)
    log.verbose('addTemplate:', addTemplate)
    const selectTemplate = filterList.find(item => item.value === addTemplate)
    log.verbose('selectTemplate:', selectTemplate)
    if(!selectTemplate) {
      throw new Error(`项目模板${addTemplate}不存在`)
    }
    // 通过npm的api获取最新版本号
    const latestVersion = await getLatestVersion(selectTemplate.npmName)
    log.verbose('latestVersion:', latestVersion)
    selectTemplate.version = latestVersion

    const targetPath = makeTargetPath()
    
    return {
      type: addType,
      name: addName,
      team: addTeam,
      template: selectTemplate,
      targetPath
    }
  } else {
    throw new Error(`当前类型不支持: ${addType}`)
  }
}

export default createTemplate