
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cardSchema   = new Schema({
    status: { type: String, required: true, default: 'todo' },
    title: { type: String, required: true },
    owner: { type: String, required: true, lowercase: true},
    ownerTeam: { type: String, required: true, default: ''},
    timeEntry: { type: Date},
    timeEnd: { type: Date},
    spentTime: {type: Date},
    estimatedTime: {type: Number, default: null},
    notification: {type: Boolean, default: true},
    description: { type: String, default: null},
    created_at: { type: Date, default: Date.now},
    modified_at: { type: Date, default: Date.now}
});

cardSchema.pre('save', function (next) {

  var currentDate = new Date();

  this.modified_at = currentDate;

  if(!this.created_at){
    this.created_at = currentDate;
  }
  next();
});

cardSchema.post('save', (doc) => {
  console.log('the card "%s" has been saved', doc._id);
})

module.exports = mongoose.model('Card', cardSchema);
