import React, { useEffect } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useNavigate } from '@reach/router';

import Header from './Header';
import Player from './Player';
import GameActions from './GameActions';
import { useGameContext, useMeContext } from '../common/utils';

import usePlayerStyles from './usePlayerStyles';
import useStyles from '../common/useStyles';

const LEAVE_GAME = gql`
    mutation leaveGame($gameId: ID!) {
        leaveGame(gameId: $gameId) {
            success
        }
    }
`;

const Lobby = ({ subscribe, startCrewGame, player }) => {
    const classes = useStyles();
    const playerClasses = usePlayerStyles();
    const game = useGameContext();
    const me = useMeContext();
    const navigate = useNavigate();
    const [leaveGame] = useMutation(LEAVE_GAME, {
        variables: { gameId: game.id },
        onCompleted: ({ leaveGame: { success } }) => {
            if (success) {
                navigate('/');
            }
        }
    });
    const isStartDisabled = game.players.some(player => player.status !== 'READY');

    /**
     * Add subscriptions for player updates, game updates
     */
    useEffect(() => {
        if (player) {
            subscribe(player.id);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.containerCenter}>
            <Header showAccessCode />
            <div className={classNames(playerClasses.player, playerClasses.header)}>
                <div className={playerClasses.name}>Name</div>
                <div className={playerClasses.ready}>Ready</div>
                <div className={playerClasses.note}>Note</div>
            </div>
            {game.players.map((player) => (
                <Player key={`player-${player.id}`} game={game} player={player} isCurrent={me.id === player.userId} />
            ))}
            {Array(game.size - game.players.length)
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
                isHost={player.isHost}
                startGame={startCrewGame}
                leaveGame={leaveGame}
            />
        </div>
    );
};

Lobby.propTypes = {
    subscribe: T.func.isRequired,
    startCrewGame: T.func.isRequired,
    player: T.object,
};

export default Lobby;
