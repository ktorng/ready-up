import React, { useEffect } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useNavigate } from '@reach/router';

import Player from './Player';
import GameActions from './GameActions';

import usePlayerStyles from './usePlayerStyles';
import useStyles from '../common/useStyles';

const LEAVE_GAME = gql`
    mutation leaveGame($gameId: ID!) {
        leaveGame(gameId: $gameId) {
            success
        }
    }
`;

const Lobby = ({ me, game, subscribe, startCrewGame }) => {
    const classes = useStyles();
    const playerClasses = usePlayerStyles();
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
    const isHost = me.id === game.hostId;

    /**
     * Add subscriptions for player updates, game updates
     */
    useEffect(() => {
        subscribe(me.id);
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
                <Player key={user.email} game={game} userId={user.id} current={me} />
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
    me: T.object,
    game: T.object,
    subscribe: T.func.isRequired,
    startCrewGame: T.func.isRequired,
};

export default Lobby;
