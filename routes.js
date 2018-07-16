const express = require('express'),
	router = express.Router(),
	activityController = require('./controllers/activity.controller'),
	reviewController = require('./controllers/review.controller');

module.exports = router;

//Activities
router.post('/api/activity',activityController.saveActivity);

router.get('/api/activity/:id',activityController.getActivity)

router.get('/api/activity/:id/participants',activityController.getParticipants);

router.put('/api/activity/:id',activityController.updateActivity);

router.delete('/api/activity/:id',activityController.deleteActivity);


//Reviews
router.get('/api/activity/:id/review/:reviewId',reviewController.getReview);

router.get('/api/activity/:id/review/grader/:graderEmail',reviewController.getReviewFromParticipantEmail);

router.put('/api/activity/:id/review/:reviewId',reviewController.updateReview);

router.post('/api/activity/:id/review',reviewController.saveReview);