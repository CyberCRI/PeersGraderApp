const express = require('express'),
	router = express.Router(),
	activityController = require('./controllers/activity.controller');

module.exports = router;

router.post('/activity',activityController.saveActivity);

router.get('/activity/:id',activityController.getActivity)

router.put('/activity/:id',activityController.updateActivity);

router.delete('/activity/:id',activityController.deleteActivity);