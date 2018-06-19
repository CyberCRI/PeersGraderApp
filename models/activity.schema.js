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
		firstname : 'String',
		name: 'String',
		email : 'String',
		role : 'String'
	}],
	urlId: 'String',
	teacherPwd : 'String',
	guidelines: 'String'
},{
	timestamps:true
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;