const { User, Thought } = require('../models');

const resolvers = {
  Query: {
    // 'parent' is just a placeholder param to access the username argument
    thoughts: async (parent, { username }) => {
      // user ternary op '?' to check it username exists
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    }
  }
};

module.exports = resolvers;
