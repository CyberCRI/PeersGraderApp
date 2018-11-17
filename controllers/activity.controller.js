require('dotenv').config();

const Activity = require('../models/activity.schema'),
	nanoid = require('nanoid'),
	nodemailer = require('nodemailer'),
	inLineCss = require('nodemailer-juice');

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
			//console.log(activity.participants)
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
			//console.log(activity)
			res.send({success:true,activity:activity});
		});
	},
	sendInvitations : async function(req,res){
		console.log('sendInvitations');

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
					} else if(participant == -1) {
						res.send({success:false,participant:false,who:destinators[i]});
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
					  },
					  tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
				});

		console.log('sent')
		//console.log(sentActivity)

		if(!sentActivity.urlId && !sentActivity.teacherPwd){
			sentActivity.urlId = nanoid(5);
			sentActivity.teacherPwd = getPassword();
		}

		/*if(!sentActivity.invitationsSent){
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
		}*/

		const mailTeacher = {
		  from: process.env.MAIL_USER, // sender address
		  to: sentActivity.teacherEmail, // list of receivers
		  subject: 'Review Activity ' + sentActivity.title, // Subject line
		  html : `<div class="message-body has-text-black" style="color:#111;font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;line-height: 1.5;padding: 20px 24px 20px 24px">
							  <p style="margin:0px">
							    Congratulation ! :D You successfully completed the configuration and creation of a peers grading activity !
							  </p> <br>
							  <h3 class="title is-6">Where is my activity ? Can I edit it ?</h3>
							  <p style="margin:0px">
							    <img style="height:12px;width:12px" src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-pencil-alt-solid.png">&nbsp;You can edit participants, options and the rubric using this link &amp; password.<br>
							    <img style="height:12px;width:12px" src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-link-solid.png">&nbsp;Activity's link is : ${process.env.APP_URL}/#/activity/${sentActivity.urlId}/<br>
							    <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-key-solid.png" style="height:12px;width:12px">&nbsp;Master password is : ${sentActivity.teacherPwd}<br>
							  </p><br>
							  <h3 class="title is-6">How do I <i>really</i> start the activity with my participants ?</h3>
							  <p style="margin:0px">
							    <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-clock-solid.png" style="height:12px;width:12px">&nbsp;On D-day, gather your participants, identify additional or missing ones.<br>
							    <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451385-users-solid.png" style="height:12px;width:12px">&nbsp;Update the participants' list, thanks to the link &amp; master password above.<br>
							    <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451409-truck-monster-solid.png" style="height:12px;width:12px">&nbsp;Everyone's optimal planning is generated.<br>
							    <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-paper-plane-solid.png" style="height:12px;width:12px">&nbsp;Send email invitations to all your participants instantly.<br>
							   <img src="http://image.noelshack.com/fichiers/2018/38/4/1537451362-hand-peace-solid.png" style="height:12px;width:12px">&nbsp;Enjoy ! Participants open the link, follow their missions, submiting evaluations as needed.
							  </p>
							  <br>
							</div>`,
		  htmlHugo : `<div class="message-body has-text-black" style="color:#111;font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;line-height:1.5;padding-top:20px;padding-right: 24px;padding-bottom:20px;padding-left:24px">
			  <p style="margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;">
			    Congratulation ! :D You successfully completed the configuration and creation of a peers grading activity !
			  </p> <br>
			  <h3 class="title is-6">Where is my activity ? Can I edit it ?</h3>
			  <p style="margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;">
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path>
					</svg>
			    --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451362-pencil-alt-solid.png">
					&nbsp;You can edit participants, options and the rubric using this link &amp; password.<br>
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path>
					</svg>
				 --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451362-link-solid.png">&nbsp;Activity's link is : <a href="${process.env.APP_URL}/#/activity/${sentActivity.urlId}/">${process.env.APP_URL}/#/activity/${sentActivity.urlId}/</a><br>
			    <svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"></path>
						</svg>
					 <!----><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/44/2/1540915988-key-solid-512.png">&nbsp;Master password is : ${sentActivity.teacherPwd}<br>
			  </p><br>
			  <h3 class="title is-6">How do I <i>really</i> start the activity with my participants ?</h3>
			  <p style="margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;">
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"></path>
					</svg>
			    --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451362-clock-solid.png">
					&nbsp;On D-day, gather your participants, identify additional or missing ones.<br>
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
					</svg>
			    --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451385-users-solid.png">
					&nbsp;Update the participants' list, thanks to the link &amp; master password above.<br>
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M624 224h-16v-64c0-17.67-14.33-32-32-32h-73.6L419.22 24.02A64.025 64.025 0 0 0 369.24 0H256c-17.67 0-32 14.33-32 32v96H48c-8.84 0-16 7.16-16 16v80H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h16.72c29.21-38.65 75.1-64 127.28-64s98.07 25.35 127.28 64h65.45c29.21-38.65 75.1-64 127.28-64s98.07 25.35 127.28 64H624c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm-336-96V64h81.24l51.2 64H288zm304 224h-5.2c-2.2-7.33-5.07-14.28-8.65-20.89l3.67-3.67c6.25-6.25 6.25-16.38 0-22.63l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-3.67 3.67A110.85 110.85 0 0 0 512 277.2V272c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v5.2c-7.33 2.2-14.28 5.07-20.89 8.65l-3.67-3.67c-6.25-6.25-16.38-6.25-22.63 0l-22.63 22.63c-6.25 6.25-6.25 16.38 0 22.63l3.67 3.67A110.85 110.85 0 0 0 373.2 352H368c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h5.2c2.2 7.33 5.07 14.28 8.65 20.89l-3.67 3.67c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l3.67-3.67c6.61 3.57 13.57 6.45 20.9 8.65v5.2c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-5.2c7.33-2.2 14.28-5.07 20.9-8.65l3.67 3.67c6.25 6.25 16.38 6.25 22.63 0l22.63-22.63c6.25-6.25 6.25-16.38 0-22.63l-3.67-3.67a110.85 110.85 0 0 0 8.65-20.89h5.2c8.84 0 16-7.16 16-16v-32c-.02-8.84-7.18-16-16.02-16zm-112 80c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm-208-80h-5.2c-2.2-7.33-5.07-14.28-8.65-20.89l3.67-3.67c6.25-6.25 6.25-16.38 0-22.63l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-3.67 3.67A110.85 110.85 0 0 0 192 277.2V272c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v5.2c-7.33 2.2-14.28 5.07-20.89 8.65l-3.67-3.67c-6.25-6.25-16.38-6.25-22.63 0L58.18 304.8c-6.25 6.25-6.25 16.38 0 22.63l3.67 3.67a110.85 110.85 0 0 0-8.65 20.89H48c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h5.2c2.2 7.33 5.07 14.28 8.65 20.89l-3.67 3.67c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l3.67-3.67c6.61 3.57 13.57 6.45 20.9 8.65v5.2c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-5.2c7.33-2.2 14.28-5.07 20.9-8.65l3.67 3.67c6.25 6.25 16.38 6.25 22.63 0l22.63-22.63c6.25-6.25 6.25-16.38 0-22.63l-3.67-3.67a110.85 110.85 0 0 0 8.65-20.89h5.2c8.84 0 16-7.16 16-16v-32C288 359.16 280.84 352 272 352zm-112 80c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48z"></path>
					</svg>
			    --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451409-truck-monster-solid.png">
					&nbsp;Everyone's optimal planning is generated.<br>
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path>
					</svg>
			    --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/38/4/1537451362-paper-plane-solid.png">
					&nbsp;Send email invitations to all your participants instantly.<br>
					<!--<svg style="height:12px;width:12px" viewBox="0 0 512 512"
					role="img" xmlns="http://www.w3.org/2000/svg">
						<path fill="#5d6e79" d="M408 216c-22.092 0-40 17.909-40 40h-8v-32c0-22.091-17.908-40-40-40s-40 17.909-40 40v32h-8V48c0-26.51-21.49-48-48-48s-48 21.49-48 48v208h-13.572L92.688 78.449C82.994 53.774 55.134 41.63 30.461 51.324 5.787 61.017-6.356 88.877 3.337 113.551l74.765 190.342-31.09 24.872c-15.381 12.306-19.515 33.978-9.741 51.081l64 112A39.998 39.998 0 0 0 136 512h240c18.562 0 34.686-12.77 38.937-30.838l32-136A39.97 39.97 0 0 0 448 336v-80c0-22.091-17.908-40-40-40z"></path>
					</svg>
			 --><img style="height:12px;width:12px" src="https://image.noelshack.com/fichiers/2018/44/2/1540915988-hand-peace-solid-512.png">&nbsp;Enjoy ! Participants open the link, follow their missions, submiting evaluations as needed.<br>
			  </p>
			  <br>
			</div>`,
		  htmlOld: `<p><a href="${process.env.APP_URL}/#/activity/${sentActivity.urlId}/">Activity here</a></p>
		  			 <p>password : </p>`
		};

		transporter.use('compile', inLineCss());
		await transporter.sendMail(mailTeacher, function (err, info) {
			console.log('sendingMail')
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
				//console.log(activity)
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
