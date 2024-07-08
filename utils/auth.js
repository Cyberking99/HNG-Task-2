const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (user) => {
  return jwt.sign({ userId: user.userId, email: user.email }, secret, { expiresIn: '1h' });
};

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'No token provided',
      statusCode: 401
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ where: { userId: decoded.userId } });

    if (!user) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'Invalid token',
        statusCode: 401
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 'Unauthorized',
      message: 'Invalid token',
      statusCode: 401
    });
  }
};
