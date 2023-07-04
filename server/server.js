const jwt = require('jsonwebtoken');
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');
const { typeDefs, resolvers } = require("./schemas");
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 3001;

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      req.user = null;
      return next(); // Call next() to proceed to the next middleware or route handler
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'invalid token!' });
    }

    next(); // Call next() to proceed to the next middleware or route handler
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
