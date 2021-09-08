exports.responseHandler= (res, status, data, message,error=false) => {
  res.status(status).json({
    
    message,
    data,
    error
  });
};
