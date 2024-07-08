const { User, Organisation } = require('../models');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ userId, firstName, lastName, email, password: hashedPassword, phone });
    const org = await Organisation.create({ orgId, name: `${firstName}'s Organisation` });
    user.addOrganisation(org);

    const token = generateToken(user);
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: { userId: user.userId, firstName, lastName, email, phone },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error('Authentication failed');
    }
    const token = generateToken(user);
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: { userId: user.userId, firstName: user.firstName, lastName: user.lastName, email, phone: user.phone },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
