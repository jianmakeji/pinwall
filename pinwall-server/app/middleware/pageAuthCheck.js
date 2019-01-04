module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated()){
       await  next();
      }
      else{
        ctx.session.returnTo = ctx.url;
        ctx.redirect('/login');
      }

  }
};
