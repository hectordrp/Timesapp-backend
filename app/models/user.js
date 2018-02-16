
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    username: { type: String, unique: true, required: [true, 'Username must be provided'], minlength: 6, maxlength: 20, lowercase:true},
    email: { type: String, unique: true, required: [true, 'Email must be provided'], lowercase:true},
    name: { type: String, lowercase:true, minlength: 0, maxlength: 30, default: null},
    team: { type: String, lowercase:true, minlength: 0, maxlength: 30, default: null},
    role: { type: String, lowercase:true, minlength: 3, maxlength: 10, default: 'user'},
    settings: {
      avatar: {type: String, lowercase:true, maxlength: 100, default: null},
      notificationTime: {type: Number, min: 0.1, max:4, default: 0.5},
      workTime: {type: Number, min: 1, max:10, default:8}
    },
    created_at: { type: Date, default: Date.now},
    modified_at: { type: Date, default: Date.now}
});

// username validation
userSchema.path('username').validate(function (username) {
  var usernameRegex = /^[a-z0-9ñ]*$/;
  return usernameRegex.test(username);
}, 'Validation error.');

// email validation
userSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(email);
}, 'Validation error.');

userSchema.pre('save', function (next) {

  var currentDate = new Date();

  this.modified_at = currentDate;

  if(!this.created_at){
    this.created_at = currentDate;
  }
  next();
});

userSchema.post('save', (doc) => {
  console.log('%s has been saved', doc.username);
})


module.exports = mongoose.model('User', userSchema);
