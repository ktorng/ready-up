import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import LoginForm from './LoginForm';
import { Loading } from '../common';

export const LOGIN_USER = gql`
    mutation login($email: String!) {
        login(email: $email)
    }
`;

const Login = () => {
    const client = useApolloClient();
    const [login, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: ({ login }) => {
            localStorage.setItem('readyup-token', login);
            // write to Apollo cache
            client.writeData({ data: { isLoggedIn: true } });
        }
    });

    if (loading) return <Loading />;
    if (error) return <p>An error occurred.</p>;

    return (
        <LoginForm login={login}/>
    );
};

export default Login;
