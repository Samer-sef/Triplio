const router = require("express").Router();
const TripsController = require('../../controllers/TripsController');
const imageUploadHandler = require('../../middleware/imageUploadHandler');


router.route('/trips')
    .get(TripsController.GetAllTrips)
    .post(imageUploadHandler, TripsController.CreateTrip)
    .patch(TripsController.UpdateTrip)
    .delete(TripsController.DeleteTrip)
    

module.exports = router;