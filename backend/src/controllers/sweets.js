const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sweetController');

router.get('/', ctrl.listSweets);
router.post('/', ctrl.createSweet);
router.get('/:id', ctrl.getSweet);
router.put('/:id', ctrl.updateSweet);
router.delete('/:id', ctrl.deleteSweet);

// purchase endpoint
router.post('/:id/purchase', async (req, res, next) => {
  // forward to controller.createPurchase with sweetId from params
  req.body.sweetId = req.params.id;
  return require('../controllers/sweetController').createPurchase(req, res, next);
});

module.exports = router;
