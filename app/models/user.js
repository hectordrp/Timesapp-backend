
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    username: { type: String, unique: true, required:true, lowercase:true},
    email: { type: String, unique: true, required:true, lowercase:true},
    name: { type: String },
    role: { type: String, required:true, lowercase:true, default: 'user'},
    workTime: {type: Number, default:8},
    settings: {
      avatar: {type: String},
      notificationTime: {type: Number}
    },
    created_at: { type: Date, default: Date.now},
    modified_at: { type: Date, default: Date.now}
});

userSchema.pre('save', function (next) {

  var currentDate = new Date();

  this.modified_at = currentDate;

  if(!this.created_at){
    this.created_at = currentDate;
  }
  next();
});

userSchema.post('save', (doc) => {
  console.log('%s has been saved', doc.name);
})

module.exports = mongoose.model('User', userSchema);
