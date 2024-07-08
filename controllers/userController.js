const { User, Organisation } = require('../models');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({
        errors: [
          { field: 'firstName', message: 'First name is required' },
          { field: 'lastName', message: 'Last name is required' },
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' }
        ]
      });
    }

    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [
          { field: 'email', message: 'Email is already in use' }
        ]
      });
    }

    const user = await User.create({ userId, firstName, lastName, email, password: hashedPassword, phone });

    const orgId = uuidv4();
    const orgName = `${firstName}'s Organisation`;
    const org = await Organisation.create({ orgId, name: orgName });
    
    await user.addOrganisation(org);

    const token = generateToken(user);
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: { userId: user.userId, firstName, lastName, email, phone }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' }
        ]
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: { userId: user.userId, firstName: user.firstName, lastName: user.lastName, email, phone: user.phone }
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


exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
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
      message: 'User record retrieved',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
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

