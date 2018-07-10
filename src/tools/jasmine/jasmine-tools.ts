export const superTestEndFn = function (done: DoneFn) {
  return (err: any, response: any) => {
    if (err) {
      throw done.fail(err);
    } else {
      done();
    }
  };
};
