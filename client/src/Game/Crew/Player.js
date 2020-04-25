import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import TaskList from './TaskList';
import PlayedCard from './PlayedCard';
import { useGameContext, useMeContext } from '../../common/utils';

import useStyles from '../../common/useStyles';
import useCrewStyles from './hooks/useCrewStyles';
import CurrentPlayer from './CurrentPlayer';

const Player = (props) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const game = useGameContext();
    const me = useMeContext();
    const { player, tasks } = props;
    const { id, played } = player;

    if (props.isCurrent) {
        return <CurrentPlayer {...props} />;
    }
    return (
        <div className={crewClasses.playerContainer}>
            <h4
                className={classNames(classes.bold, classes.noMargin)}
                {...(game.type === 'DEBUG' ? { onClick: () => me.setPlayerId(id) } : {})}
            >
                {player.name}
            </h4>
            <div className={crewClasses.cardContainer}>
                {player.hand.map((card, i) => (
                    <Card
                        key={`player-${id}-card-${i}`}
                        card={card}
                        isCurrent={false}
                    />
                ))}
            </div>
            {!!tasks.length && (
                <TaskList tasks={tasks} title="Tasks to complete" />
            )}
            {played && <PlayedCard card={played} />}
        </div>
    );
};

Player.propTypes = {
    player: T.object,
    tasks: T.array,
    isCurrent: T.bool,
};

export default Player;
