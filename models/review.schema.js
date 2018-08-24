const mongoose=require('mongoose'),
		Activity = require('../models/activity.schema'),
    Schema = mongoose.Schema;

const reviewSchema = new Schema({
	activityId: {
		type: Schema.Types.ObjectId
	},
	grader : {
		participantId : {
			type: Schema.Types.ObjectId
		},
		email : 'String',
		role : 'String',
		group : 'String',
		reviewed : [{
			reviewedId : {
				type : Schema.Types.ObjectId,
				ref : 'Activity.participants.id'
			},
			name : 'String',
			role : 'String',
			graded : Boolean,
			group : 'String',
			session : Number,
			skills : [{
				rubricId : {
					type : Schema.Types.ObjectId
				},
				name : 'String',
				totalPossiblePoints: Number,
				skillDescriptors : [{
					content : 'String',
					descriptorId : {
						type : Schema.Types.ObjectId
					},
					possiblePoints : Number,
					percentageAcquired : Number,
					acquired : Boolean
				}]
			}]
		}]
	},
	activityUrlId : 'String',
	sessionCount : Number,
	urlId : 'String'
  },{
	timestamps:true,
	strict:false
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;