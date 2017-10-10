
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cardSchema   = new Schema({
      status: { type: String, required: true, minlength: 3, maxlength: 8, trim: true, default: 'todo' },
      title: { type: String, required: true, minlength: 1, maxlength: 100},
      owner: { type: String, required: true, lowercase: true, minlength: 6, maxlength: 20},
      ownerTeam: { type: String, required: true, lowercase: true, minlength: 4, maxlength: 20, default: null},
      timeEntry: { type: Date},
      timeEnd: { type: Date},
      spentTime: {type: Number},
      _id: { type: Schema.Types.ObjectId, required:true, index:true, auto:true},
      estimatedTime: {type: Number, default: null},
      notification: {type: Boolean, default: true},
      description: { type: String, minlength: 0, maxlength: 300, default: null},
      created_at: { type: Date, default: Date.now},
      modified_at: { type: Date, default: Date.now}
});

cardSchema.pre('save', function(next) {

  var currentDate = new Date();

  this.modified_at = currentDate;

  if(!this.created_at){
    this.created_at = currentDate;
  }


// Calculate the spent time during the task in its cyrcle of life, it only occur when timeEnd is sent through the request
  if(this.timeEntry && this.timeEnd && !this.spentTime){
    entryTime = this.timeEntry;
    endingTime = this.timeEnd;
    diffMs = (Math.abs(endingTime.getTime() - entryTime.getTime()));
    diffMinutes = diffMs / 60000;
    this.spentTime = Math.round(diffMinutes);
  }

  next();
});

cardSchema.post('save', function(doc) {
  console.log('the card "%s" has been saved', doc._id);
})

module.exports = mongoose.model('Card', cardSchema);
