module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated() ){
        if(ctx.user.roles && && ctx.user.roles.length > 0){
          if (ctx.user.roles[0].name == 'admin'){
            await  next();
          }
          else{
            ctx.body = {
              success: true,
              status:999,
              data:'没有操作权限，不用重新尝试了',
            };
          }
        }
        else{
          ctx.body = {
            success: true,
            status:999,
            data:'没有操作权限，不用重新尝试了',
          };
        }
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
