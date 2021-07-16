const inquirer = require('inquirer');
require('colors');

const menuOpts = [
  {
    type: 'list',
    name: 'option',
    messages: 'What you wanna do?',
    // choices: ['opt1', 'op2', 'op3'],
    choices: [
      {
        value: 1,
        name: `${'1'.green}. Search place`,
      },
      {
        value: 2,
        name: `${'2'.green}. History`,
      },
      {
        value: 0,
        name: `${'0'.green}. Exit`,
      },
    ],
  },
];

const menu = async () => {
  console.clear();
  console.log('==========================='.green);
  console.log('     Select an option'.white);
  console.log('===========================\n'.green);

  const { option } = await inquirer.prompt(menuOpts);
  // console.log(option);
  return option;
};

const pause = async () => {
  const { selectedOption } = await inquirer.prompt({
    type: 'input',
    name: 'selectedOption',
    message: `Press ${'ENTER'.green} to continue...`,
  });
  return selectedOption;
};

const readLine = async (message) => {
  const { dataIn } = await inquirer.prompt({
    type: 'input',
    name: 'dataIn',
    message,
    validate(input = '') {
      if (input === '') {
        return `You must enter a description for the task`;
      }
      return true;
    },
  });

  return dataIn;
};

const placesList = async (places = []) => {
  const choices = places.map((place, i) => {
    let idx = `${i + 1}.`.green;

    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: 0,
    name: `${'0'.green} Cancel`,
  });
  const questions = [
    {
      type: 'list',
      name: 'option',
      message: 'Select a place',
      choices,
    },
  ];
  const { option } = await inquirer.prompt(questions);
  return option;
};

const taskListcomplete = async (taskList = []) => {
  const choices = taskList.map((task, i) => {
    let idx = `${i + 1}.`.green;

    return {
      value: task.id,
      name: `${idx} ${task.desc}`,
      checked: task.dateCompleted ? true : false,
    };
  });

  const questions = [
    {
      type: 'checkbox',
      name: 'ids',
      message: ' this is a message',
      choices,
    },
  ];
  const { ids } = await inquirer.prompt(questions);
  return ids;
};

const confirm = async (message) => {
  const question = {
    type: 'confirm',
    name: 'ok',
    message,
  };

  const { ok } = await inquirer.prompt(question);

  return ok;
};

module.exports = {
  menu,
  pause,
  readLine,
  placesList,
  confirm,
  taskListcomplete,
};
