import gql from 'graphql-tag';

export const typeDefs = gql`
    directive @client on FIELD
    
    extend type Query {
        isLoggedIn: Boolean!
        me: User
    }
`;

export const resolvers = {
};
