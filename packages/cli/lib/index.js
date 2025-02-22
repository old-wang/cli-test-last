import createInitCmd from '@wangyao1994/cli-test-init'
import createCli from './create-cli.js'
import './exception.js'

export default (args) => {

  const program = createCli()
  // init
  createInitCmd(program)

  program.parse(process.argv)
}
