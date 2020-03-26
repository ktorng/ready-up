import React, { useEffect } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNavigate } from '@reach/router';

import Player from './Player';
import GameActions from './GameActions';
import { USER_DATA } from '../common/schema';

import usePlayerStyles from './usePlayerStyles';
import useStyles from '../common/useStyles';

const GET_CURRENT_USER = gql`
    query me {
        me @client {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const LEAVE_GAME = gql`
    mutation leaveGame($gameId: ID!) {
        leaveGame(gameId: $gameId) {
            success
        }
    }
`;

const Lobby = ({ game, subscribe, startCrewGame }) => {
    const classes = useStyles();
    const playerClasses = usePlayerStyles();
    const { data } = useQuery(GET_CURRENT_USER);
    const navigate = useNavigate();
    const [leaveGame] = useMutation(LEAVE_GAME, {
        variables: { gameId: game.id },
        onCompleted: ({ leaveGame: { success } }) => {
            if (success) {
                navigate('/');
            }
        }
    });
    const isStartDisabled = game.users.some(user => user.status !== 'READY');
    const isHost = data.me.id === game.hostId;

    /**
     * Add subscriptions for player updates, game updates
     */
    useEffect(() => {
        subscribe(data.me.id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.containerCenter}>
            <h1>Game lobby: {game.name}</h1>
            <h3>Access code: {game.accessCode}</h3>
            <div className={classNames(playerClasses.player, playerClasses.header)}>
                <div className={playerClasses.name}>Name</div>
                <div className={playerClasses.ready}>Ready</div>
                <div className={playerClasses.note}>Note</div>
            </div>
            {game.users.map((user) => (
                <Player key={user.email} game={game} userId={user.id} current={data.me} />
            ))}
            {Array(game.size - game.users.length)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={`open-slot-${i + 1}`}
                        className={classNames(playerClasses.player, playerClasses.empty)}
                    >
                        (open)
                    </div>
                ))}
            <GameActions
                isStartDisabled={isStartDisabled}
                isHost={isHost}
                startGame={startCrewGame}
                leaveGame={leaveGame}
            />
        </div>
    );
};

Lobby.propTypes = {
    game: T.object,
    subscribe: T.func.isRequired,
    startCrewGame: T.func.isRequired,
};

export default Lobby;
