import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Board from './Board';
import Player from './Player';
import Header from '../Header';
import { usePlayers } from './usePlayers';

import useStyles from '../../common/useStyles';

const useLayoutStyles = makeStyles((_) => ({
    mid: {
        height: 400,
        display: 'flex',
        flexDirection: 'row',
    },
    game: {
        height: 600,
    },
    board: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    player: {
        height: 120,
    },
    playerTop: {
        height: 90,
    },
    playerVertical: {
        width: 60,
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },
    border: {
        border: '1px solid gray',
    },
}));

const getTasks = (tasks, playerId) => tasks.filter(t => t.playerId === playerId);

const Layout = ({ me, game }) => {
    const classes = useStyles();
    const layoutClasses = useLayoutStyles();
    const { gameState } = game;
    const { tasks } = gameState;
    // build ordered list of players
    const players = usePlayers(game, me);

    return (
        <div className={classNames(classes.containerCenter, classes.stretch)}>
            <div className={classes.containerCenter}>
                <Header game={game} gameState={gameState} />
            </div>
            <div className={layoutClasses.game}>
                <div className={classNames(layoutClasses.playerTop, layoutClasses.border)}>
                    {players[2] && (
                        <Player
                            player={players[2]}
                            tasks={getTasks(tasks, players[2].id)}
                        />
                    )}
                </div>
                <div className={layoutClasses.mid}>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        {players[1] && (
                            <Player
                                player={players[1]}
                                tasks={getTasks(tasks, players[1].id)}
                            />
                        )}
                    </div>
                    <div className={layoutClasses.board}>
                        <Board gameState={gameState} tasks={getTasks(tasks, null)} />
                    </div>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        {players[3] && (
                            <Player
                                player={players[3]}
                                tasks={getTasks(tasks, players[3].id)}
                            />
                        )}
                    </div>
                </div>
                <div className={classNames(layoutClasses.player, layoutClasses.border)}>
                    <Player
                        player={players[0]}
                        tasks={getTasks(tasks, players[0].id)}
                        isCurrent
                    />
                </div>
            </div>
        </div>
    );
};

Layout.propTypes = {
    me: T.object,
    game: T.object.isRequired
};

export default Layout;
