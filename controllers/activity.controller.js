require('dotenv').config();

const Activity = require('../models/activity.schema'),
	nanoid = require('nanoid'),
	nodemailer = require('nodemailer');
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
	saveActivity : async function(req,res){

		var sentActivity = req.body.activity;

		console.log('sent')
		console.log(sentActivity)

		if(!sentActivity.urlId && !sentActivity.teacherPwd){
			sentActivity.urlId = nanoid(5);
			sentActivity.teacherPwd = nanoid(10)+nanoid(10);	
		}

		if(!sentActivity.invitationsSent){
			var transporter = nodemailer.createTransport({
 				service: 'gmail',
				auth: {
				    user: process.env.MAIL_USER,
				    pass: process.env.MAIL_PWD
				  }
			});
			//might be beter to use reduce to create list receivers like so (depending on service restrictions)
			//var mailist = sentActivity.participants.reduce((a,c)=>{a.push(c.email);return a;},[]);
			//console.log('mailist',mailist.join(',')); put mailist join in to

			for(var participant of sentActivity.participants){
				participant.token = nanoid(8);

				
				const mailOptions = {
				  from: process.env.MAIL_USER, // sender address
				  to: participant.email, // list of receivers
				  subject: 'Review Activity ' + sentActivity.title, // Subject line
				  html: `<p><a href="http://localhost:5000/#/activity/${sentActivity.urlId}/review?ptoken=${participant.token}">Review here</a></p>`
				};


				await transporter.sendMail(mailOptions, function (err, info) {
				  if(err)
				    console.log(err)
				  else
				    console.log(info);
				});

				
			}
			
			sentActivity.invitationsSent = true;
		}
	
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