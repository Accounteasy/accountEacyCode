'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  full_name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  mobile_number: {
    type: String
  },
  profile_image: {
    type: String
  },
  role_id: {
    type: String
  },
  device_type: {
    type: String
  },
  device_id: {
    type: String
  },
  otp: {
    type: String
  },
  verify_status: {
    type: String
  },
  forgot_status: {
    type: String
  },
  status: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

var AccountSchema = new Schema({
  name: {
    type: String
  },
  company_name: {
    type: String
  },
  position: {
    type: String
  },
  currency: {
    type: String
  },
  country: {
    type: String
  },
  industry_id: {
    type: String
  },
  fiscal_year_end: {
    type: String
  },
  user_id: {
    type: String
  },
  status: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

var UserInvoiceDetailSchema = new Schema({
  user_id: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  postcode: {
    type: String
  },
  country: {
    type: String
  },
  logo: {
    type: String
  },
  status: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Users', UserSchema);
module.exports = mongoose.model('Accounts', AccountSchema);
module.exports = mongoose.model('UserInvoiceDetails', UserInvoiceDetailSchema);
