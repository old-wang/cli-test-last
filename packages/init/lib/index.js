import Command from '@wangyao1994/cli-test-command'
import { log } from '@wangyao1994/cli-test-utils'
import createTemplate from './create-template.js'
import downloadTemplate from './download-template.js'
import installTemplate from './install-template.js'

/**
 * examples:
 * cli-test init aaa -t project --tp my-react-template
 * cli-test init
 */
class InitCmd extends Command {
  get command() {
    return 'init [name]'
  }

  get description() {
    return 'init project'
  }

  get options() {
    return [
      ['-f, --force', '强制更新', false],
      ['-t, --type <type>', '项目类型(值: project/page)'],
      ['--tp, --template <template>', '模板名称'],
      ['--tm, --team <team>', '项目类型(值：mobile/pc)']
    ]
  }

  async action([name, opts]) {
    log.verbose('init', name, opts)
    
    // 1. 选择项目模板并生成
    const template = await createTemplate(name, opts)
    log.verbose('template:', template)
    // 2. 下载模板到缓存目录
    await downloadTemplate(template)
    // 3. 安装模板到项目目录
    await installTemplate(template, opts)
  }
}

const Init = (instance) => {
  return new InitCmd(instance)
}

export default Init;

