import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from '@reach/router';

import CreateForm from './CreateForm';

export const CREATE_GAME = gql`
    mutation createGame($name: String!, $description: String!, $size: Int!) {
        createGame(name: $name, description: $description, size: $size) {
            success
            message
            game {
                accessCode
            }
        }
    }
`;

const Create = () => {
    const navigate = useNavigate();
    const [createGame, { loading, error }] = useMutation(CREATE_GAME, {
        onCompleted: ({ createGame: { success, game }}) => {
            if (success) {
                navigate(`/game/${game.accessCode}`);
            }
        }
    });

    return (
        <>
            {error && <div>{error}</div>}
            <CreateForm createGame={createGame} loading={loading} />
        </>
    );
};

export default Create;
