import { requestInterceptor } from "../requestInterceptor";

describe('Background', () => {
  it('Logs background text', async () => {
    console.log = jest.fn();
    // const test = await require('../index');
    const test2 = new requestInterceptor();
    console.log('hi');
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});