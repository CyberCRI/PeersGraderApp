const express = require('express'),
	router = express.Router(),
	activityController = require('./controllers/activity.controller'),
	reviewController = require('./controllers/review.controller');

module.exports = router;

//Activities
router.post('/activity',activityController.saveActivity);

router.get('/activity/:id',activityController.getActivity)

router.get('/activity/:id/participants',activityController.getParticipants);

router.put('/activity/:id',activityController.updateActivity);

router.delete('/activity/:id',activityController.deleteActivity);


//Reviews
router.get('/activity/:id/review/:reviewId',reviewController.getReview);

router.put('/activity/:id/review/:reviewId',reviewController.updateReview);

router.post('/activity/:id/review',reviewController.saveReview);