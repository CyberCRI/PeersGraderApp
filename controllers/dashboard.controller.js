const Review = require('../models/review.schema'),
		Activity = require('../models/activity.schema'),
		mongoose = require('mongoose'),
		nanoid = require('nanoid');

function computeNote(id,activity,reviews){

	var reviewPoints = [];
	
	
	for(review of reviews){		
		/*console.log('OVERhere',id)
		console.log('THERE U GO')
		console.log(review.grader.reviewed)*/

		var reviewed = Array.from(review.grader.reviewed);

		//console.log('id',id)
		var rIndex = reviewed.findIndex(a=>mongoose.Types.ObjectId(a.reviewedId).toString()==mongoose.Types.ObjectId(id).toString()),
				r = undefined;

		
		if(rIndex >- 1){
				r = reviewed[rIndex]
			//	console.log('r',r,'rIndex',rIndex)
		} else return -25;
		
		if(r && r.skills){
		
			var skillsTotalPoints = 0,
					pointsAcquired = r.skills.reduce((a,s)=>{
						skillsTotalPoints+=s.totalPossiblePoints; 
						//console.log(skillsTotalPoints)
						return a + s.skillDescriptors.reduce((t,sd)=>t+((sd.percentageAcquired*sd.possiblePoints)/100),0.0);
					},0.0);

					//console.log('skillsTotalPoints',skillsTotalPoints)
			reviewPoints.push((activity.basis*pointsAcquired)/skillsTotalPoints);
		}

	}
	//console.log('there the review');
	//console.log(review.grader);
	//console.log(reviewPoints);
	return reviewPoints.reduce((a,c)=>a+c,0)/reviewPoints.length;
}

function seriousnessAssessment(basis,distance){

	console.log('distance')
	console.log(basis,distance);

  if      (Math.abs(Number(distance))<= 1) return basis;
  else if (Math.abs(Number(distance))<= 2) return basis*70/100;
  else if (Math.abs(Number(distance))<= 4) return basis*50/100;
  else if (Math.abs(Number(distance))<= 6) return basis*30/100;
  else return 0;
 
}

function cleanReviews(reviews){
	console.log('cleanReviews')
	console.log(reviews)
	for(var i=0;i<reviews.length;i++)
		reviews[i].grader.reviewed = reviews[i].grader.reviewed.filter(x=>x.group!=participant.group);
	
	return reviews;
}

module.exports = {
		getSummaryRows : function(req,res){
			console.log(req)
		var nameColumn = [],
				profsColumn = [],
				peersColumn = [],
				observersColumn = [];
				
		//get All participants 
		Activity.findOne({urlId:req.params.id}).then(async activity=>{

			//console.log('participants')
			//console.log(activity.participants)

			var participants = Array.from(activity.participants)
			for(participant of participants){
				nameColumn.push(participant.email)
				//console.log(participant)
				//console.log('participantid',participant._id,participant.email);
				//console.log(participant)
				await Review.find({
						'grader.reviewed.reviewedId':mongoose.Types.ObjectId(participant._id),
						'grader.role':'Teacher'
					}).then(reviews=>{
					//console.log('getSummaryRows Teacher');

					//console.log(reviews)
					//console.log(participant.email,participant._id)
					//console.log('anteReviews');
					//console.log(reviews);
					//reviews = cleanReviews(reviews);

					//console.log('reviews')
					//console.log(reviews)
					if(reviews.length>0)
						profsColumn.push(Number.parseFloat(computeNote(mongoose.Types.ObjectId(participant._id),activity,reviews)).toFixed(2));
					else profsColumn.push(-1)
					//console.log('profsColumn')
					//console.log(profsColumn)
				});



				await Review.find({
						'grader.reviewed.reviewedId':mongoose.Types.ObjectId(participant._id),
						'grader._id': {$not : {$eq : participant._id}},
						$or : [{'grader.role':'Observator'},{'grader.role':'Student'}]
					}).then(reviews=>{
					/*console.log('getSummaryRows Student')
					console.log(reviews)*/
					//console.log(participant.email)

			
					//reviews = cleanReviews(reviews);


					if(reviews.length>0)
						peersColumn.push(Number.parseFloat(computeNote(mongoose.Types.ObjectId(participant._id),activity,reviews)).toFixed(2));
					else peersColumn.push(-1)

					//console.log('eefz')
					//console.log(peersColumn)
				

				});
				//console.log('peersColumn')

				//console.log(peersColumn)

				var sessionStudentReviewed = [],
						gradersGrades = [],
						studentsGrades = [];


				//for(var i = 0;i<activity.sessions;i++){
					await Review.findOne({'grader.email':participant.email,'activityUrlId':activity.urlId}).then(async review=>{
						console.log('thereerefef',participant.email,activity.urlId)
						console.log(review.grader)
						console.log(review.grader.reviewed)
						
						review.grader.reviewed.filter(x=>x.group != review.grader.group);

						if(review && review.grader.reviewed){
							for(var studentReviewed of review.grader.reviewed){

								await Review.find({
										'grader.reviewed.reviewedId':mongoose.Types.ObjectId(studentReviewed.reviewedId),
										'grader._id':{$not : {$eq : studentReviewed.reviewId}},
										'grader.reviewed.session': studentReviewed.session,
										$or : [{'grader.role':'Observator'},{'grader.role':'Student'}]
									}).then(reviews=>{
									console.log('getSummaryRows Student')
									console.log(reviews)
									
									for(var review of reviews)
										for(var reviewed of review.grader.reviewed)
											console.log(reviewed)
									//reviews = cleanReviews(reviews);
									//suspiciously wrong

									

									if(reviews.length>0)
										studentsGrades.push(computeNote(mongoose.Types.ObjectId(studentReviewed.reviewedId),activity,reviews));
									else studentsGrades.push(-1)

									
								});
								

		
						
								if(studentReviewed && studentReviewed.skills){
		
									var skillsTotalPoints = 0,
											pointsAcquired = studentReviewed.skills.reduce((a,s)=>{
												skillsTotalPoints+=s.totalPossiblePoints; 
												//console.log(skillsTotalPoints)
												return a + s.skillDescriptors.reduce((t,sd)=>t+((sd.percentageAcquired*sd.possiblePoints)/100),0.0);
											},0.0);

											//console.log('skillsTotalPoints',skillsTotalPoints)
									gradersGrades.push((activity.basis*pointsAcquired)/skillsTotalPoints);
								}

								//gradersGrades.push(computeNote(mongoose.Types.ObjectId(studentReviewed.reviewedId).toString(),activity,[review]));

							}
							
							//sessionStudentReviewed.push(studentsGrades.reduce((a,c)=>a+c,0)/studentsGrades.length)

						
						}
					});			


				//}
				
				console.log('ls',studentsGrades);
				console.log('lg',gradersGrades)

				
				for(var i = 0;i<studentsGrades.length;i++)
					observersColumn.push(seriousnessAssessment(activity.basis,Number.parseFloat(gradersGrades[i]-studentsGrades[i]).toFixed(2)));
							
			}
			
	
			var rows = new Array(profsColumn.length);

			for(var i=0;i<rows.length;i++){
				rows[i] = {
					name : nameColumn[i],
					teachersGrade : profsColumn[i] == -1 ? peersColumn[i] : profsColumn[i],
					peersGrade : peersColumn[i],
					observersGrade : observersColumn[i],
					finalGrade : ((profsColumn[i] == -1 ? peersColumn[i] * req.query.profs : profsColumn[i] * req.query.profs) + peersColumn[i] * req.query.peers + observersColumn[i] * req.query.observers)/100
				};
			}
			
			res.send({rows:rows})		
		});


	}
	
}