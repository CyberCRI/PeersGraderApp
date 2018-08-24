const Review = require('../models/review.schema'),
		Activity = require('../models/activity.schema'),
		nanoid = require('nanoid');

module.exports = {
	getSummaryRows : function(req,res){
		//
		Review.find({}).then(reviews=>{
			console.log('getSummaryRows response');
			console.log(reviews)
		});
	}
	
}