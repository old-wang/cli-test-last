import { log } from '@wangyao1994/cli-test-utils'

const onError = (e, type) => {
  if(process.argv.includes('-d') || process.argv.includes('--debug')) {
    log.error(type, e)
  } else {
    log.error(type, e.message)
  }
}

// 普通异常监听
process.on('uncaughtException', (e) => onError(e, 'error'))

// promise异常监听
process.on('unhandledRejection', (e) => onError(e, 'promise'))