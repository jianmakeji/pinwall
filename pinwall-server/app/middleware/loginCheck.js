module.exports = () => {
  return async (ctx, next) => {
    try{
      await next();
    }
    catch(e){
      console.log(e.message);
    }
  }
};
