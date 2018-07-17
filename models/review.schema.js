const mongoose=require('mongoose'),
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
			name : 'String',
			role : 'String',
			graded : Boolean,
			group : 'String',
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
					acquired : Boolean
				}]
			}]
		}]
	},
	activityUrlId : 'String',
	urlId : 'String'
  },{
	timestamps:true,
	strict:false
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;