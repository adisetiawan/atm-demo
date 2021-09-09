const inquirer = require('inquirer');

const transferPrompt = require('../commands/transfer');

const getAnswers = async (request) => {
  const answer = await inquirer.prompt(request);
  return answer;
};

jest.mock('inquirer', () => {
  return { prompt: jest.fn() };
});

describe('transfer command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should receive', async () => {
    inquirer.prompt.mockResolvedValueOnce({destination: 'name', amount: 123});
    const actual = await getAnswers(transferPrompt);

    expect(actual).toStrictEqual({destination: 'name', amount: 123});
  });
});