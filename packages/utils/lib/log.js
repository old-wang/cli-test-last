import log from 'npmlog'

// debug日志判断
if(process.argv.includes('-d') || process.argv.includes('--debug')) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

log.addLevel('success', 2000, { bg: 'green', bold: true })

export default log