const Review = require('../models/review.schema'),
		nanoid = require('nanoid');
module.exports = {
	getReviewFromParticipantEmail : function(req,res){
		console.log(req.params.graderEmail,req.params.id)
		Review.findOne({activityUrlId:req.params.id,'grader.email' : req.params.graderEmail}).then(review=>{
			console.log('getReviewFromParticipantEmail response');
			console.log(review);
			if(review)
				res.send({hasReview:true,grader:review.grader});
			else res.send({hasReview:false});
		});
	},
	getReview : function(req,res){
		var reviewKey = req.params.reviewId;
		console.log('key getreview')
		console.log(reviewKey)
		Review.findOne({urlId:reviewKey}).then(function(review){
			console.log('activityKey',reviewKey)			
			res.send({success:true,review:review});
		}).catch(error=>{
			console.log('bim error',error);
		});	
	},
	updateReview : function(req,res){
		console.log('hello mf');
		console.log(req.params.id)
		var sentReview = req.body.review;

		Review.findOneAndUpdate({urlId:req.params.reviewId},sentReview).then(function(){
			Review.findOne({urlId:req.params.reviewId}).then(function(review){
				console.log('updated')
				console.log(review)
				res.send({success:true,review:review});
			});	
		});
	},
	saveReview : function(req,res){
		console.log('in here')
		var sentReview = req.body.review;

		console.log('sent sentReview');
		console.log(sentReview);
		
		if(!sentReview._id){
			sentReview.urlId = nanoid(5);
			sentReview.reviewed.urlId = sentReview.urlId;
			sentReview.reviewed.graded = true;
			var indexReviewed = sentReview.grader.reviewed.findIndex(c=>c.email == sentReview.reviewed.email);
			console.log('reviewedmail',sentReview.reviewed.email)
			sentReview.grader.reviewed[indexReviewed].urlId = sentReview.urlId;
			sentReview.grader.reviewed[indexReviewed].graded = true;
		}

		var	newReview = new Review(sentReview);

		newReview.save().then(async function(response){
			await Review.updateMany({
											activityUrlId:sentReview.activityUrlId,
											'grader.email':sentReview.grader.email,
											'grader.reviewed.email':sentReview.reviewed.email
										},
										{$set : {'grader.reviewed.$.urlId':sentReview.reviewed.urlId,
														  'grader.reviewed.$.graded':true}},{multi: true});
		/*	await Review.find({
				activityUrlId:sentReview.activityUrlId,
				'grader.email': sentReview.grader.email})
				.then(reviews=>{
					reviews.forEach(x=>{
						console.log('x',x)
						var reviewToUpdate = x.grader.reviewed.find(c=>c.email == sentReview.reviewed.email);
						console.log('reviewToUpdate',reviewToUpdate);
						Review.findOneAndUpdate({_id:reviewToUpdate._id},reviewToUpdate);
					})
				})*/

			console.log('save res review')
			console.log(response)
			res.send({success:true,review:response});
		}).catch(function(err){
			console.log(err)
		});
	}
}