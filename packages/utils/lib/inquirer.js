import inquirer from 'inquirer'

// 交互底层配置
const make = ({
  choices,
  defaultValue,
  message,
  type,
  require = true,
  mask = '*',
  validate,
  pageSize,
  loop
}) => {
  const options = {
    name: 'name',
    default: defaultValue,
    message,
    type,
    require,
    mask,
    validate,
    pageSize,
    loop
  }

  if(type === 'list') {
    options.choices = choices
  }

  return inquirer.prompt(options).then(answer => answer.name)
}

// list
export const makeList = (params) => {
  return make({ ...params, type: 'list'})
}

// input
export const makeInput = (params) => {
  return make({ ...params, type: 'input' })
}