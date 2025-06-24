test("jest.fn works", () => {
  const fn = jest.fn();
  fn("hello");
  expect(fn).toHaveBeenCalledWith("hello");
});
