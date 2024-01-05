const router = require("express").Router();
const TripsController = require('../../controllers/TripsController');


router.route('/trips')
    .get(TripsController.GetAllTrips)
    .post(TripsController.CreateTrip)
    .patch(TripsController.UpdateTrip)
    .delete(TripsController.DeleteTrip)
    

module.exports = router;