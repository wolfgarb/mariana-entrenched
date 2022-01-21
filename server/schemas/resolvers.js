const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// resolvers is a single function that returns ALL of the data associated with a user
const resolvers = {
  Query: {
    // 'parent' is just a placeholder param to access the username argument
    // the SECOND argument is what we are really trying to access...
    // here, when our query gets 'thoughts', it is also returning
    // the associated User data
    thoughts: async (parent, { username }) => {
      // user ternary op '?' to check it username exists
      // if it doesnt exist, it passes an empty {}
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // this query needs the _id argument that is associated
    // with retrieving a single thought
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    // get all users
    users: async () => {
      return (
        User.find()
          // the -password excludes password from the return
          .select('-__v -password')
          // populate fields for 'friends' and 'thoughts'
          .populate('friends')
          .populate('thoughts')
      );
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      // update mutation resolvers to sign token and return object that combines token with user data
      const token = signToken(user);

      return { token, user };
    },
    login: async (parents, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // add token to login mutation as well
      const token = signToken(user);
      return { token, user };
    }
  }
};

module.exports = resolvers;
