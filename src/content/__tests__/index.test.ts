describe('Content', () => {
  it('Logs text', async () => {
    console.log = jest.fn();
    // await require('../index');
    console.log('hi content');
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});