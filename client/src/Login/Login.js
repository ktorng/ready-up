import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Container } from '@material-ui/core';

import LoginForm from './LoginForm';
import { Loading } from '../common';

import './Login.scss';

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
        <Container maxWidth="sm">
            <LoginForm login={login}/>
        </Container>
    );
};

export default Login;
