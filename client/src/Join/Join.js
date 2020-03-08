import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useNavigate, useParams } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';

import JoinForm from './JoinForm';

const JOIN_GAME = gql`
    mutation joinGame($accessCode: String!) {
        joinGame(accessCode: $accessCode) {
            success
            message
            game {
                accessCode
            }
        }
    }
`;

const Join = () => {
    const navigate = useNavigate();
    const { accessCode } = useParams();
    const [error, setError] = useState('');
    const [joinGame, { loading }] = useMutation(JOIN_GAME, {
        onCompleted: ({ joinGame: { success, message, game }}) => {
            if (success) {
                navigate(`/game/${game.accessCode}`);
            } else {
                setError(message);
            }
        }
    });

    // if navigating to url with accessCode, attempt to join it
    useEffect(() => {
        if (accessCode) {
            joinGame({ variables: { accessCode }});
        }
    }, [accessCode, joinGame]);

    return (
        <>
            {error && <div>{error}</div>}
            <JoinForm joinGame={joinGame} loading={loading} />
        </>
    );
};

export default Join;
