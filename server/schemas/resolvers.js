const { User, Thought } = require('../models');

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

      return user;
    },
    login: async () => {}
  }
};

module.exports = resolvers;
