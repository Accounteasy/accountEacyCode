'use strict';
module.exports = function(app) {
  var apiUrl = require('../controllers/webservicesController');

  app.route('/signUp').post(apiUrl.signUp);
  app.route('/login').post(apiUrl.login);
  app.route('/verifyAccount').post(apiUrl.verifyAccount);
  app.route('/forgotPasword').post(apiUrl.forgotPasword);
  app.route('/resendOtp').post(apiUrl.resendOtp);
  app.route('/resetPassword').post(apiUrl.resetPassword);
  app.route('/getUser').get(apiUrl.getUser);
  app.route('/createAccount').post(apiUrl.createAccount);
  app.route('/invoiceDetail').post(apiUrl.invoiceDetail);
  app.route('/linkedinLogin').post(apiUrl.linkedinLogin);

  /*app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
};