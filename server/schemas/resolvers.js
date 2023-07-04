const resolvers = {
    Query: {
      // Resolver for the 'me' query
      me: async (parent, args, context) => {
        // Check if user is authenticated (present in the context)
        if (context.user) {
          // Find the user based on their ID in the context and exclude certain fields from the result
          const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
          return userData;
        }
        // Throw an authentication error if user is not authenticated
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  
    Mutation: {
      // Resolver for the 'addUser' mutation
      addUser: async (parent, args) => {
        // Create a new user with the arguments passed in
        const user = await User.create(args);
        // Sign a token for the new user
        const token = signToken(user);
        // Return the token and user object
        return { token, user };
      },
      // Resolver for the 'login' mutation
      login: async (parent, { email, password }) => {
        // Find the user based on the provided email
        const user = await User.findOne({ email });
  
        if (!user) {
          // Throw an authentication error if no user is found
          throw new AuthenticationError('No user found');
        }
  
        // Check if the provided password is correct
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          // Throw an authentication error if the password is incorrect
          throw new AuthenticationError('Incorrect credentials');
        }
  
        // Sign a token for the authenticated user
        const token = signToken(user);
  
        // Return the token and user object
        return { token, user };
      },
      // Resolver for the 'saveBook' mutation
      saveBook: async (parent, { newBook }, context) => {
        // Check if user is authenticated (present in the context)
        if (context.user) {
          // Add the new book to the user's savedBooks array
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: newBook }},
            { new: true }
          );
          return updatedUser;
        }
        // Throw an authentication error if user is not authenticated
        throw new AuthenticationError('You need to be logged in!');
      },
      // Resolver for the 'removeBook' mutation
      removeBook: async (parent, { bookId }, context) => {
        // Check if user is authenticated (present in the context)
        if (context.user) {
          // Remove the specified book from the user's savedBooks array
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId }}},
            { new: true }
          );
          return updatedUser;
        }
        // Throw an authentication error if user is not authenticated
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  };

  module.exports = resolvers;
