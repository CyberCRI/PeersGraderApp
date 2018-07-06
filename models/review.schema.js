const mongoose=require('mongoose'),
    Schema = mongoose.Schema;

const reviewSchema = new Schema({
	activityId: {
		type: Schema.Types.ObjectId
	},
	grader : 'String',
	reviewed : 'String',
	skills : [{
		rubricId : {
			type : Schema.Types.ObjectId
		},
		name : 'String',
		totalPossiblePoints: Number,
		descriptors : [{
			descriptorId : {
				type : Schema.Types.ObjectId
			},
			possiblePoints : Number,
			acquired : Boolean
		}]
	}]
  },{
	timestamps:true,
	strict:false
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;