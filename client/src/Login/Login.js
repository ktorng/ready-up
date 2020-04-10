import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import LoginForm from './LoginForm';
import { Loading } from '../common';
import { USER_DATA } from '../common/fragments';

export const LOGIN_USER = gql`
    mutation login($name: String!, $email: String!) {
        login(name: $name, email: $email) {
            token
            user {
                ...UserData
            }
        }
    }
    ${USER_DATA}
`;

const Login = () => {
    const client = useApolloClient();
    const [login, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: ({ login }) => {
            localStorage.setItem('readyup-token', login.token);
            // write to Apollo cache
            client.writeData({ data: {
                isLoggedIn: true,
                me: login.user,
            } });
        }
    });

    if (loading) return <Loading />;
    if (error) return <p>An error occurred.</p>;

    return <LoginForm login={login}/>;
};

export default Login;
