const Review = require('../models/review.schema'),
		nanoid = require('nanoid');
module.exports = {
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
		}

		var	newReview = new Review(sentReview);

		newReview.save().then(function(response){
			console.log('save res review')
			console.log(response)
			res.send({success:true,review:response});
		}).catch(function(err){
			console.log(err)
		});
	}
}