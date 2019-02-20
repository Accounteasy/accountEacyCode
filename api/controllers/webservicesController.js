'use strict';

var mongoose = require('mongoose'),
  	User = mongoose.model('Users'),
  	Account = mongoose.model('Accounts'),
  	UserInvoiceDetail = mongoose.model('UserInvoiceDetails');

var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// Helper
function getRandomInt(max) {
  return Math.floor(1000 + Math.random() * 9000);
}

function generatePassword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Api :: signUp
// Params :: profile_image, full_name, email, password, country_code, mobile_number, device_type, device_id
exports.signUp = function(req, res) {
	User.find({ 'email':req.body.email }, function(err, user) {
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user.length!=0) {
	      	res.json({'status': false, 'message': 'User already exists.', 'data': []});
	    }else{
	    	var password = req.body.password;

	    	req.body.status = 1;
	    	req.body.otp = getRandomInt(9999);
	    	req.body.verify_status = req.body.forgot_status = 2;
	    	req.body.password = bcrypt.hashSync(req.body.password, 10);

	    	var new_user = new User(req.body);
		  	new_user.save(function(err, user) {
		    	if(err){
		    		res.json({'status': false, 'message': 'Unable to register user.', 'data': []});
		    	}else{
		    		var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'testingbydev@gmail.com',
					    pass: 'Dev@1234567'
					  }
					});

					var mailOptions = {
					  from: 'testingbydev@gmail.com',
					  to: req.body.email,
					  subject: 'User Registration',
					  text: '<p>Dear '+req.body.full_name+',</p><br><p>Thanks for Registering with Account Easy.</p><br><p>Email: '+req.body.email+'</p><br><p>Password: '+password+'</p><br><p>OTP: '+req.body.otp+'</p><br /><br />Thanks,<br />Account Easy Team</p><p><strong>( **&nbsp; Please do not reply to this email **&nbsp; )</strong></p>'
					};

					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					}); 
		    		res.json({'status': true, 'message': 'User registered successfully.', 'data': user});
		    	}
		  	});
	    }
    });  	
};

// Api :: verifyAccount
// Params :: user_id, otp
exports.verifyAccount = function(req, res) {
	User.findOne({ '_id':req.body.user_id, 'otp':req.body.otp }, function(err, user) {
		
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user==null) {
	      	res.json({'status': false, 'message': 'Invalid otp', 'data': []});
	    }else{
    	 	User.updateMany({_id:req.body.user_id}, {$set:{verify_status:1}}, function(err, user) {
			    if(err){
			    	res.json({'status': false, 'message': 'Unable to verify account.', 'data': []});
			    }else{
			    	User.findOne({ '_id':req.body.user_id }, function(err, user) { 
			    		if(err){
					    	res.json({'status': false, 'message': 'Unable to verify account.', 'data': []});
					    }else{
					    	res.json({'status': true, 'message': 'Your account is verified successfully.', 'data': user});
					    }
			    	});
			    }
			});
		}
    });  	
};

// Api :: login
// Params :: email, password, device_type, device_id
exports.login = function(req, res) {
	User.findOne({ 'email':req.body.email }, function(err, user) {
		
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user==null) {
	      	res.json({'status': false, 'message': 'Invalid credentials.', 'data': []});
	    }else{
	    	if(bcrypt.compareSync(req.body.password, user.password)) {
			 	if(user.status != 1){
		    		res.json({'status': false, 'message': 'User is currently inactive.', 'data': []});
		    	}else if(user.verify_status == 2){
		    		res.json({'status': true, 'message': 'Please verify your account.', 'data': user});
		    	}else{
		    		User.updateMany({email:req.body.email}, {$set:{device_type:req.body.device_type, device_id:req.body.device_id}}, function(err, user) {
					    if(err){
					    	res.json({'status': false, 'message': 'Unable to login user.', 'data': []});
					    }else{
					    	User.findOne({ 'email':req.body.email }, function(err, user) { 
					    		if(err){
							    	res.json({'status': false, 'message': 'Unable to login user.', 'data': []});
							    }else{
							    	res.json({'status': true, 'message': 'You are login successfully.', 'data': user});
							    }
					    	});
					    }
					});
		    	}
			}else{
			 	res.json({'status': false, 'message': 'Invalid password.', 'data': []});
			}
	    }
    });  	
};

// Api :: forgotPasword
// Params :: email
exports.forgotPasword = function(req, res) {
	User.findOne({ 'email':req.body.email }, function(err, user) {
		
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user==null) {
	      	res.json({'status': false, 'message': 'Invalid email address.', 'data': []});
	    }else{
	    	if(user.status != 1){
	    		res.json({'status': false, 'message': 'User is currently inactive.', 'data': []});
	    	}else if(user.verify_status == 2){
	    		res.json({'status': true, 'message': 'Please verify your account.', 'data': user});
	    	}else{
	    		var password = generatePassword();
	    		req.body.password = bcrypt.hashSync(password, 10);
	    		req.body.forgot_status = 1;
	    		var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'testingbydev@gmail.com',
					    pass: 'Dev@1234567'
					  }
					});

					var mailOptions = {
					  from: 'testingbydev@gmail.com',
					  to: req.body.email,
					  subject: 'Forget Password',
					  text: '<p>Dear '+user.full_name+',</p><br><p>Thanks for requesting for forgot password.</p><br><p>Email: '+req.body.email+'</p><br><p>Temp Password: '+password+'</p><br /><br />Thanks,<br />Account Easy Team</p><p><strong>( **&nbsp; Please do not reply to this email **&nbsp; )</strong></p>'
					};

					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					}); 
	    		User.updateMany({email:req.body.email}, {$set:{password:req.body.password, forgot_status:req.body.forgot_status}}, function(err, user) {
				    if(err){
				    	res.json({'status': false, 'message': 'Unable to send request.', 'data': []});
				    }else{
				    	User.findOne({ 'email':req.body.email }, function(err, user) { 
				    		if(err){
						    	res.json({'status': false, 'message': 'Unable to send request.', 'data': []});
						    }else{
						    	res.json({'status': true, 'message': 'Your request send successfully to your email.', 'data': user});
						    }
				    	});
				    }
				});
	    	}
	    }
    });  	
};

// Api :: Resend Otp
// Params :: user_id
exports.resendOtp = function(req, res) {
	User.findOne({ '_id':req.body.user_id }, function(err, user) {
		
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user==null) {
	      	res.json({'status': false, 'message': 'User does not exists.', 'data': []});
	    }else{
	    	if(user.status != 1){
	    		res.json({'status': false, 'message': 'User is currently inactive.', 'data': []});
	    	}else{
	    		req.body.otp = getRandomInt(9999);
	    		var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'testingbydev@gmail.com',
					    pass: 'Dev@1234567'
					  }
					});

					var mailOptions = {
					  from: 'testingbydev@gmail.com',
					  to: user.email,
					  subject: 'Resend OTP',
					  text: '<p>Dear '+user.full_name+',</p><br><p>Your otp for account verification.</p><br><p>Email: '+user.email+'</p><br><p>OTP: '+req.body.otp+'</p><br /><br />Thanks,<br />Account Easy Team</p><p><strong>( **&nbsp; Please do not reply to this email **&nbsp; )</strong></p>'
					};

					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					}); 
	    		User.updateMany({_id:req.body.user_id}, {$set:{otp:req.body.otp}}, function(err, user) {
				    if(err){
				    	res.json({'status': false, 'message': 'Unable to send request.', 'data': []});
				    }else{
				    	User.findOne({ '_id':req.body.user_id }, function(err, user) { 
				    		if(err){
						    	res.json({'status': false, 'message': 'Unable to send request.', 'data': []});
						    }else{
						    	res.json({'status': true, 'message': 'Otp resend successfully.', 'data': user});
						    }
				    	});
				    }
				});
	    	}
	    }
    });  	
};

// Api :: resetPassword
// Params :: user_id, password
exports.resetPassword = function(req, res) {
	User.findOne({ '_id':req.body.user_id }, function(err, user) {
		
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user==null) {
	      	res.json({'status': false, 'message': 'Invalid otp.', 'data': []});
	    }else{
	    	req.body.password = bcrypt.hashSync(req.body.password, 10);
	    	User.updateMany({'_id':req.body.user_id}, {$set:{password:req.body.password}}, function(err, user) {
			    if(err){
			    	res.json({'status': false, 'message': 'Unable to reset password.', 'data': []});
			    }else{
			    	User.findOne({ '_id':req.body.user_id }, function(err, user) { 
			    		if(err){
					    	res.json({'status': false, 'message': 'Unable to reset password.', 'data': []});
					    }else{
					    	res.json({'status': true, 'message': 'Your password is changed successfully.', 'data': user});
					    }
			    	});
			    }
			});
	    }
    });  	
};

exports.getUser = function(req, res) {
  	User.find({},function(err, user) {
    	if (err)
      	res.send(err);
    	res.json(user);
  	});
};

// Api :: createAccount
// Params :: name, company_name, position, currency, country, industry_id, fiscal_year_end, user_id
exports.createAccount = function(req, res) {
	Account.find({ 'company_name':req.body.company_name }, function(err, user) {
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.'});
	    }
	    
	    if (user.length!=0) {
	      	res.json({'status': false, 'message': 'Company already exists.'});
	    }else{
	    	req.body.status = 1;
	    	
	    	var new_account = new Account(req.body);
		  	new_account.save(function(err, account) {
		    	if(err){
		    		res.json({'status': false, 'message': 'Unable to save account.'});
		    	}else{
		    		res.json({'status': true, 'message': 'Account added successfully.'});
		    	}
		  	});
	    }
    });  	
};

// Api :: invoiceDetail
// Params :: street, city, postcode, country, logo, user_id
exports.invoiceDetail = function(req, res) {
	req.body.status = 1;
	    	
	var new_invoice_detail = new UserInvoiceDetail(req.body);
  	new_invoice_detail.save(function(err, account) {
    	if(err){
    		res.json({'status': false, 'message': 'Unable to save invoice detail.'});
    	}else{
    		res.json({'status': true, 'message': 'Invoice detail added successfully.'});
    	}
  	});  	
};


// Api :: linkedinLogin
// Params :: profile_image, full_name, email, device_type, device_id
exports.linkedinLogin = function(req, res) {
	User.find({ 'email':req.body.email }, function(err, user) {
	    if (err) {
	        res.json({'status': false, 'message': 'Something went wrong. Please try again.', 'data': []});
	    }
	    
	    if (user.length!=0) {
	      	User.updateMany({email:req.body.email}, {$set:{device_type:req.body.device_type, device_id:req.body.device_id}}, function(err, user) {
			    if(err){
			    	res.json({'status': false, 'message': 'Unable to login user.', 'data': []});
			    }else{
			    	User.findOne({ 'email':req.body.email }, function(err, user) { 
			    		if(err){
					    	res.json({'status': false, 'message': 'Unable to login user.', 'data': []});
					    }else{
					    	res.json({'status': true, 'message': 'You are login successfully.', 'data': user});
					    }
			    	});
			    }
			});
	    }else{
	    	req.body.verify_status = req.body.status = 1;
	    	req.body.forgot_status = 2;

	    	var new_user = new User(req.body);
		  	new_user.save(function(err, user) {
		    	if(err){
		    		res.json({'status': false, 'message': 'Unable to login user.', 'data': []});
		    	}else{
		    		res.json({'status': true, 'message': 'You are login successfully.', 'data': user});
		    	}
		  	});
	    }
    });  	
};

