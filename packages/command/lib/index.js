class Command {
  constructor(instance) {
    if(!instance) {
      throw new Error('command instance must not be null!')
    }
    this.program = instance
    const cmd = this.program.command(this.command)
    cmd.description(this.description)
    if(this.options?.length > 0) {
      this.options.forEach((opt) => {
        cmd.option(...opt)
      })
    }
    // 本命令或其子命令的处理函数执行前
    cmd.hook('preAction', this.preAction)
    // 本命令或其子命令的处理函数执行后
    cmd.hook('postAction', this.postAction)
    cmd.action((...params) => {
      this.action(params)
    })
  }

  get command() {
    throw new Error('must have command!')
  }

  get description() {
    throw new Error('must have description!')
  }

  get options() {
    return []
  }

  get action() {
    throw new Error('must have action!')
  }

  preAction() {
    // empty
  }

  postAction() {
    // empty
  }
}

export default Command