
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    name: { type: String, unique: true},
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
