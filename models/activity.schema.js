const mongoose=require('mongoose'),
    Schema = mongoose.Schema;

const activitySchema = new Schema({
	activityId: {
		type: Schema.Types.ObjectId
	},
	presentations : Number,
	sessions : Number,
	title : 'String',
	participants : [{
		email : 'String',
		token : 'String',
		//name: 'String',
		group : 'String',
		//cohort : Number,
		//ine : 'String',
		role : 'String',
		reviewed : [{
			email:'String',
			group:'String',
			role : 'String',
			graded : Boolean
		}]
	}],
	rubrics:[{
      name:'',
      points:Number,
      descriptors:[{
          content:'',
          level: Number,
          points: Number
      }]
  }],
  basis:Number,
	urlId: 'String',
	teacherPwd : 'String',
	guidelines: 'String',
	invitationsSent : Boolean
},{
	timestamps:true,
	strict:false
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;