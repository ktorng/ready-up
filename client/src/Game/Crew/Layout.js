import React, { useEffect } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import Board from './Board';
import Player from './Player';
import Header from '../Header';
import { usePlayers } from './hooks/usePlayers';
import { useGameContext, useMeContext } from '../../common/utils';

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
    commander: {
        border: '2px solid',
        borderColor: red[500],
    },
    currentTurnPlayer: {
        backgroundColor: green[100],
    },
}));

const getTasks = (tasks, playerId) => tasks.filter(t => t.playerId === playerId);

const Layout = ({ subscribe }) => {
    const classes = useStyles();
    const layoutClasses = useLayoutStyles();
    const game = useGameContext();
    const me = useMeContext();
    const { gameState } = game;
    const { tasks, turnPlayerId } = gameState;
    // build ordered list of players
    const players = usePlayers(game, me);

    /**
     * Add subscriptions for player updates, game updates
     */
    useEffect(() => {
        if (me) {
            subscribe(me.playerId);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classNames(classes.containerCenter, classes.stretch)}>
            <div className={classes.containerCenter}>
                <Header me={me} />
            </div>
            <div className={layoutClasses.game}>
                <div className={classNames(
                    layoutClasses.playerTop,
                    layoutClasses.border,
                    {
                        [layoutClasses.commander]: players[2].isCommander,
                        [layoutClasses.currentTurnPlayer]: players[2].id === turnPlayerId,
                    },
                )}>
                    {players[2] && (
                        <Player
                            player={players[2]}
                            tasks={getTasks(tasks, players[2].id)}
                        />
                    )}
                </div>
                <div className={layoutClasses.mid}>
                    <div className={classNames(
                        layoutClasses.playerVertical,
                        {
                            [layoutClasses.commander]: players[1].isCommander,
                            [layoutClasses.currentTurnPlayer]: players[1].id === turnPlayerId,
                        },
                    )}>
                        {players[1] && (
                            <Player
                                player={players[1]}
                                tasks={getTasks(tasks, players[1].id)}
                            />
                        )}
                    </div>
                    <div className={layoutClasses.board}>
                        <Board tasks={getTasks(tasks, null)} />
                    </div>
                    <div className={classNames(
                        layoutClasses.playerVertical,
                        {
                            [layoutClasses.commander]: players[3].isCommander,
                            [layoutClasses.currentTurnPlayer]: players[3].id === turnPlayerId,
                        },
                    )}>
                        {players[3] && (
                            <Player
                                player={players[3]}
                                tasks={getTasks(tasks, players[3].id)}
                            />
                        )}
                    </div>
                </div>
                <div className={classNames(
                    layoutClasses.player,
                    layoutClasses.border,
                    {
                        [layoutClasses.commander]: players[0].isCommander,
                        [layoutClasses.currentTurnPlayer]: players[0].id === turnPlayerId,
                    },
                )}>
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

export default Layout;
