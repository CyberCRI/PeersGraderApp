const Review = require('../models/review.schema'),
		nanoid = require('nanoid');
module.exports = {
	getReviewFromParticipantEmail : function(req,res){
		console.log(req.params.graderEmail,req.params.id)
		Review.findOne({activityUrlId:req.params.id,'grader.email' : req.params.graderEmail}).then(review=>{
			console.log('getReviewFromParticipantEmail response');
			console.log(review);
			if(review)
				res.send({hasReview:true,review:review});
			else res.send({hasReview:false});
		});
	},
	getReview : function(req,res){
		var reviewKey = req.params.reviewId;

		Review.findOne({urlId:reviewKey}).then(function(review){	
			res.send({success:true,review:review});
		}).catch(error=>{
			console.log('bim error',error);
		});	
	},
	saveReview : function(req,res){
		
		var sentReview = req.body.review;

		if(!sentReview.urlId) sentReview.urlId = nanoid(5);

		var	newReview = new Review(sentReview);
		console.log('whats at');
		console.log(sentReview.grader.reviewed[1].percentageAcquired)

		newReview.save().then(async function(review){
		
				res.send({success:true,review:review});

		}).catch(function(err){
			console.log(err)
		});
	},
	updateReview : function(req,res){

		var sentReview = req.body.review;

		console.log(sentReview)
		console.log('whats at');
		console.log(sentReview.grader.reviewed[1].skills[0].skillDescriptors[0].percentageAcquired)

		Review.findOneAndUpdate({urlId:req.params.reviewId},sentReview).then(function(){
			Review.findOne({urlId:req.params.reviewId}).then(function(review){
				console.log('updated')
				console.log(review)
				for(r of review.grader.reviewed)
					console.log(r.skills[0].skillDescriptors[0].percentageAcquired)
				res.send({success:true,review:review});
			});	
		});
	},
}