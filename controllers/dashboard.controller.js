const Review = require('../models/review.schema'),
		Activity = require('../models/activity.schema'),
		mongoose = require('mongoose'),
		nanoid = require('nanoid');

function computeNote(id,activity,reviews){

	var reviewPoints = [];
	console.log('OVERhere',id)
	console.log(reviews)
	for(review of reviews)
{		console.log('THERE U GO')
		//console.log(review.grader.reviewed)
		var reviewed = Array.from(review.grader.reviewed);

		console.log('id',id)
		var rIndex = reviewed.findIndex(a=>mongoose.Types.ObjectId(a.reviewedId).toString()==mongoose.Types.ObjectId(id).toString()),
				r = undefined;

		
		if(rIndex >- 1){
				r = reviewed[rIndex]
				console.log('r',r,'rIndex',rIndex)
		} else return 
		
		if(r && r.skills){
		
			var skillsTotalPoints = 0,
					pointsAcquired = r.skills.reduce((a,s)=>{
						skillsTotalPoints+=s.totalPossiblePoints; 
						console.log(skillsTotalPoints)
						return a + s.skillDescriptors.reduce((t,sd)=>t+((sd.percentageAcquired*sd.possiblePoints)/100),0.0);
					},0.0);

					console.log('skillsTotalPoints',skillsTotalPoints)
			reviewPoints.push((activity.basis*pointsAcquired)/skillsTotalPoints);
		}

	}
	console.log('there ')
	return reviewPoints.reduce((a,c)=>a+c,0)/reviewPoints.length;
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
				await Review.find({'grader.reviewed.reviewedId':mongoose.Types.ObjectId(participant._id),'grader.role':'Teacher'}).then(reviews=>{
					/*console.log('getSummaryRows Teacher');

					console.log(reviews)*/
					//console.log(participant.email,participant._id)
					if(reviews.length>0)
						profsColumn.push(computeNote(mongoose.Types.ObjectId(participant._id),activity,reviews));
					else profsColumn.push(-1)
					/*console.log('profsColumn')
					console.log(profsColumn)*/
				});

				

				await Review.find({'grader.reviewed.reviewedId':mongoose.Types.ObjectId(participant._id),$or : [{'grader.role':'Observator'},{'grader.role':'Student'}]}).then(reviews=>{
					/*console.log('getSummaryRows Student')
					console.log(reviews)*/
					//console.log(participant.email)
					if(reviews.length>0)
						peersColumn.push(computeNote(mongoose.Types.ObjectId(participant._id),activity,reviews));
					else peersColumn.push(-1)

					//console.log('eefz')
					//console.log(peersColumn)
				

				});

				var sessionStudentReviewed = [],
						gradersGrades = [],
						studentsGrades = [];

				for(var i = 0;i<activity.sessions;i++){
					await Review.findOne({'grader.email':participant.email,'grader.reviewed.session':i+1}).then(async review=>{
						/*console.log('thereerefef')
						console.log(review)*/
						

						if(review && review.grader.reviewed){
							for(var studentReviewed of review.grader.reviewed){

								await Review.find({'grader.reviewed.reviewedId':mongoose.Types.ObjectId(studentReviewed.reviewedId),$or : [{'grader.role':'Observator'},{'grader.role':'Student'}]}).then(reviews=>{
									/*console.log('getSummaryRows Student')
									console.log(reviews)*/
									
									if(reviews.length>0)
										studentsGrades.push(computeNote(mongoose.Types.ObjectId(studentReviewed.reviewedId),activity,reviews));
									else studentsGrades.push(-1)

									
								});

								gradersGrades.push(computeNote(mongoose.Types.ObjectId(studentReviewed.reviewedId).toString(),activity,[review]));

							}
							
							//sessionStudentReviewed.push(studentsGrades.reduce((a,c)=>a+c,0)/studentsGrades.length)

							console.log('length')
						console.log(studentsGrades.length,gradersGrades.length)
						}
					});			


				}

				for(var i = 0;i<studentsGrades.length;i++)
					observersColumn.push(gradersGrades[i]-studentsGrades[i])
							
			}
			
			console.log('here')
			console.log(req.body)
			var rows = new Array(profsColumn.length);

			for(var i=0;i<rows.length;i++){
				rows[i] = {
					name : nameColumn[i],
					teachersGrade : profsColumn[i],
					peersGrade : peersColumn[i],
					observersGrade : observersColumn[i],
					finalGrade : (profsColumn[i] * req.query.profs + peersColumn[i] * req.query.peers + observersColumn[i] * req.query.observers)/100
				};
			}
			console.log('rows')
			console.log(rows)
			res.send({rows:rows})		
		});


	}
	
}