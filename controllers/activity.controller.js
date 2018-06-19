const Activity = require('../models/activity.schema'),
	nanoid = require('nanoid');
module.exports = {
	getParticipants : function(req,res){
		var activityKey = req.params.id;
		console.log('key getParticipants')
		console.log(activityKey)
		Activity.findOne({urlId:activityKey}).then(function(activity){
			console.log('activityKey',activityKey)			
			console.log('participants');
			console.log(activity.participants)
			res.send({success:true,participants:activity.participants});
		});	
	},
	getActivity : function(req,res){
		var activityKey = req.params.id;
		console.log('key')
		console.log(activityKey)
		Activity.findOne({$or:[{teacherPwd:activityKey},
			{urlId:activityKey}]
		}).then(function(activity){
			console.log('getActivity')
			console.log(activity)
			res.send({success:true,activity:activity});
		});	
	},
	saveActivity : function(req,res){

		var sentActivity = req.body.activity;

		sentActivity.urlId = nanoid(5);
		sentActivity.teacherPwd = nanoid(10)+nanoid(10);

		console.log('sent')
		console.log(sentActivity)
		var	newActivity = new Activity(sentActivity);

		newActivity.save().then(function(response){
			console.log('save res')
			console.log(response)
			res.send({success:true,activity:response});
		}).catch(function(err){
			console.log(err)
		});
	},
	updateActivity : function(req,res){
		console.log('id')
		console.log(req.params.id)
		var sentActivity = req.body.activity;

		Activity.findOneAndUpdate({urlId:req.params.id},sentActivity).then(function(){
			Activity.findOne({urlId:req.params.id}).then(function(activity){
				console.log('updated')
				console.log(activity)
				res.send({success:true,activity:activity});
			});	
		});
	},
	deleteActivity : function(req,res){
		Activity.findOneAndDelete({urlId:req.params.id}).then(function(activity){
			console.log('bang')
			res.send({success:true,activity:activity});
		});
	}
}