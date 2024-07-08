const { User, Organisation } = require('../models');

exports.getUserOrganisations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ where: { userId }, include: Organisation });

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved',
      data: {
        organisations: user.Organisations
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred',
      statusCode: 500
    });
  }
};

exports.getOrganisation = async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const organisation = await Organisation.findOne({ where: { orgId } });

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation record retrieved',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred',
      statusCode: 500
    });
  }
};


exports.createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(422).json({
        errors: [
          { field: 'name', message: 'Name is required' }
        ]
      });
    }

    const orgId = uuidv4();
    const organisation = await Organisation.create({ orgId, name, description });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred',
      statusCode: 500
    });
  }
};


exports.addUserToOrganisation = async (req, res) => {
  try {
    const { userId } = req.body;
    const orgId = req.params.orgId;

    const organisation = await Organisation.findOne({ where: { orgId } });
    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404
      });
    }

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred',
      statusCode: 500
    });
  }
};

