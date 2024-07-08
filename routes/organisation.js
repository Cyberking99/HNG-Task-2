const express = require('express');
const organisationController = require('../controllers/organisationController');
const { authenticate } = require('../utils/auth');
const router = express.Router();

router.get('/organisations', authenticate, organisationController.getUserOrganisations);
router.get('/organisations/:orgId', authenticate, organisationController.getOrganisation);
router.post('/organisations', authenticate, organisationController.createOrganisation);
router.post('/organisations/:orgId/users', authenticate, organisationController.addUserToOrganisation);

module.exports = router;