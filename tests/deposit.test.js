const inquirer = require('inquirer');

const depositPrompt = require('../commands/deposit');

const getAnswers = async (request) => {
  const answer = await inquirer.prompt(request);
  return answer;
};

jest.mock('inquirer', () => {
  return { prompt: jest.fn() };
});

describe('deposit command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should receive', async () => {
    inquirer.prompt.mockResolvedValueOnce({amount: 123});
    const actual = await getAnswers(depositPrompt);

    expect(actual).toStrictEqual({amount: 123});
  });
});