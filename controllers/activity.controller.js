require('dotenv').config();

const Activity = require('../models/activity.schema'),
	nanoid = require('nanoid'),
	nodemailer = require('nodemailer');

function getPassword(){
  var lists = [
          ["Adventurous","Cautious","Courageous","Curious","Furious",
          "Graceful","Impulsive","Independent","Loyal","Optimistic","Peculiar",
          "Pleasant","Reckless","Sarcastic","Sincere","Terrify","Timid","Tolerant",
          "Big","Chubby","Colossal","Curved","Enormous","Fat","Flat","Fuzzy","Giant",
          "Gigantic","Great","Heavy","Hefty","High","Hollow","Huge","Hulk","Immense",
          "Large","Light","Little","Long","Low","Massive","Miniature","Monstrous",
          "Petite","Plump","Round","Sharp","Short","Slim","Small","Square","Svelte",
          "Tall","Thin","Tiny","Vast","Wide"],
          ["African", "American", "Arab", "Argentinean", "Asian", "Australian", "Belgian",
          "Brazilian", "Caribean", "Colombian", "Croatian", "Egyptian",
          "English", "European", "French", "German", "Haitian", "Hungarian",
          "Icelander", "Indian", "Indonesian", "Iranian", "Irish",
          "Italian", "Ivorian", "Jamaican", "Japanese", "Kenyan", "Korean",
          "Kyrgyz", "Laotian", "Libyan", "Mexican", "Micronesian", "Macedonian",
          "Malaysian", "Mauritanian", "Mongolian", "Moroccan", "Namibian", "Nepalese",
          "Nigerian", "Norwegian", "Panamanian", "Peruvian", "Polish", "Russian", "Saudi",
          "Senegalese", "Scottish", "Slovenian", "Spanish", "Swedish", "Swiss", "Syrian",
          "Tanzanian", "Thai", "Tunisian", "Turkish", "Ukrainian", "Vietnamese", "Zambian"],
          ["Alicorn","Ant","Bear","Bogle","Butterfly","Cat","Centaur","Cerberus",
          "Chimera","Cyclops","Demon","Dolphin","Dragon","Dwarf","Elf","Fairy","Fox","Ghosts",
          "Gnome","Goblin","Golem","Griffin","Hydra","Linx","Lion","Medusa","Mermaids","Minotaur",
          "Mutants","Ness","Nymph","Ogre","Orca","Pegasus","Phoenix","Penguin","Pixie","Python","Sirens",
          "Sphinx","Thunderbird","Tiger","Unicorn","Valkyries","Vampire","Werewolf","Whale","Yeti","Zombie"]
      ],
      randoms = new Array(lists.length),
      password = '';

  for(var i=0;i<randoms.length;i++){
      randoms[i] = Math.floor(Math.random() * lists[i].length);
      console.log(randoms[i]);
  }
  var i = 0;
  for(var random of randoms){
  		console.log('random',random);
      password+= lists[i++][random];
  }

  return password;
}
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
	sendInvitations : async function(req,res){
		console.log('sendInvitations')
		try {
			var sentActivity =  req.body.activity,
					destinators = req.body.destinators,
					message = req.body.message,
					transporter = nodemailer.createTransport({
						service:'gmail',
						auth : {
							user: process.env.MAIL_USER,
							pass: process.env.MAIL_PWD
						},
						tls: { rejectUnauthorized: false }
					});

					

			for(var i=0;i<destinators.length;i++){
					var participant = sentActivity.participants.findIndex(c=>c.email==destinators[i]);

					if(participant>-1 && !sentActivity.participants[participant].token){
						sentActivity.participants[participant].token = nanoid(8);

						Activity.findOneAndUpdate({urlId:sentActivity.urlId},sentActivity).then(function(){
							Activity.findOne({urlId:sentActivity.urlId}).then(function(activity){
								console.log('updated')
								console.log(activity)							
							});	
						});
					} else {
						res.send({success:false,participant:false});
					}

					const mailOptions = {
					  from: process.env.MAIL_USER, // sender address
					  to: destinators[i], // list of receivers
					  subject: 'Invitation to review activity ' + sentActivity.title, // Subject line
					  html: `<p>${sentActivity.teacherName} invited you to <a href="${process.env.APP_URL}/#/activity/${sentActivity.urlId}/review?ptoken=${sentActivity.participants[participant].token}">Review here</a></p><p>${message}</p>`
					};


					await transporter.sendMail(mailOptions, function (err, info) {
					  if(err)
					    console.log(err)
					  else
					    console.log(info);
					});
			}

			res.send({success:true});
		} catch(e){
			res.send({success:false})
		}
	},
	saveActivity : async function(req,res){

		var sentActivity = req.body.activity,
		 		transporter = nodemailer.createTransport({
	 				service: 'gmail',
					auth: {
					    user: process.env.MAIL_USER,
					    pass: process.env.MAIL_PWD
					  }
				});

		console.log('sent')
		console.log(sentActivity)

		if(!sentActivity.urlId && !sentActivity.teacherPwd){
			sentActivity.urlId = nanoid(5);
			sentActivity.teacherPwd = getPassword();	
		}

		if(!sentActivity.invitationsSent){
			//might be beter to use reduce to create list receivers like so (depending on service restrictions)
			//var mailist = sentActivity.participants.reduce((a,c)=>{a.push(c.email);return a;},[]);
			//console.log('mailist',mailist.join(',')); put mailist join in to

			for(var participant of sentActivity.participants){
				participant.token = nanoid(8);

				
				const mailOptions = {
				  from: process.env.MAIL_USER, // sender address
				  to: participant.email, // list of receivers
				  subject: 'Review Activity ' + sentActivity.title, // Subject line
				  html: `<p>${sentActivity.teacherName} invited you to <a href="${process.env.APP_URL}/#/activity/${sentActivity.urlId}/review?ptoken=${participant.token}">Review here</a></p>`
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

		const mailTeacher = {
		  from: process.env.MAIL_USER, // sender address
		  to: sentActivity.teacherEmail, // list of receivers
		  subject: 'Review Activity ' + sentActivity.title, // Subject line
		  html: `<p><a href="${process.env.APP_URL}/#/activity/${sentActivity.urlId}/">Activity here</a></p>
		  			 <p>password : ${sentActivity.teacherPwd}</p>`
		};

		await transporter.sendMail(mailTeacher, function (err, info) {
		  if(err)
		    console.log(err)
		  else
		    console.log(info);
		});
	
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