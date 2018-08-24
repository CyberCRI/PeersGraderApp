const Review = require('../models/review.schema'),
		Activity = require('../models/activity.schema'),
		nanoid = require('nanoid');

module.exports = {
	getSummaryRows : function(req,res){
		var profsColumn = [],
				peersColumn = [],
				observersColumn = [];
				
		//get All participants 
		Activity.find({urlId:req.params.id},'participants').then(participants=>{


			for(participant of participants){
				Review.find({}).then(reviews=>{
					console.log('getSummaryRows response');
					console.log(reviews)
				});
			}
			
		});

		
	}
	
}