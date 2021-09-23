const inquirer = require('inquirer');

const loginPrompt = require('../commands/login');

const getAnswers = async (request) => {
  const answer = await inquirer.prompt(request);
  return answer;
};

jest.mock('inquirer', () => {
  return { prompt: jest.fn() };
});

describe('login command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should receive', async () => {
    inquirer.prompt.mockResolvedValueOnce({name: 'name', password: '1234'});
    const actual = await getAnswers(loginPrompt);

    expect(actual).toStrictEqual({name: 'name', password: '1234'});
  });
});