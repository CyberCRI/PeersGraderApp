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

		console.log('sent')
		console.log(sentReview.reviewed)
		
		if(!sentReview._id){
			sentReview.urlId = nanoid(5);
			var indexReviewed = sentReview.grader.reviewed.findIndex(c=>c.email == sentReview.reviewed);
			console.log('indexReviewed',indexReviewed);
			sentReview.grader.reviewed[indexReviewed].urlId = sentReview.urlId;
		}

		var	newReview = new Review(sentReview);

		newReview.save().then(async function(response){
			await Review.updateMany({
				activityUrlId:sentReview.activityUrlId,
				'grader.email':sentReview.grader.email,
				'grader.reviewed.email':sentReview.reviewed
			},{
				$set : {'grader.reviewed.$.urlId':sentReview.urlId}
			},{
				multi: true
			});

			Review.findOne({urlId:response.urlId}).then(function(review){		
				console.log('review',review)
				res.send({success:true,review:review});
			}).catch(error=>{
				console.log('bim error',error);
			});	
		}).catch(function(err){
			console.log(err)
		});
	},
	updateReview : function(req,res){

		var sentReview = req.body.review;

		Review.findOneAndUpdate({urlId:req.params.reviewId},sentReview).then(function(){
			Review.findOne({urlId:req.params.reviewId}).then(function(review){
				console.log('updated')
				console.log(review)
				res.send({success:true,review:review});
			});	
		});
	},
}