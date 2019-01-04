module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated()){
       await  next();
      }
      else{
        ctx.body = {
          success: true,
          status:999,
          data:'没有操作权限，请登录',
        };
      }

  }
};
