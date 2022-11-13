const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {

  })

  router
  .route('/:healthyHabitId')
  .get(async (req, res) => {

  })
  
module.exports = router;