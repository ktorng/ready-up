import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import TaskList from './TaskList';

import useStyles from '../../common/useStyles';
import useCrewStyles from './useCrewStyles';
import CurrentPlayer from './CurrentPlayer';

const Player = (props) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const { player, tasks } = props;
    const { id } = player;

    if (props.isCurrent) {
        return <CurrentPlayer {...props} />;
    }
    return (
        <div className={crewClasses.playerContainer}>
            <h4 className={classNames(classes.bold, classes.noMargin)}>
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
        </div>
    );
};

Player.propTypes = {
    player: T.object,
    tasks: T.array,
    isCurrent: T.bool,
};

export default Player;
