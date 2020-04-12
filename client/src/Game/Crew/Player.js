import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import TaskList from './TaskList';

import useStyles from '../../common/useStyles';
import useCrewStyles from './useCrewStyles';

const Player = ({ player, tasks, isCurrent = false }) => {
    const { id } = player;
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const sortedHand = useMemo(() => {
        return sortHand(player.hand);
    }, [player.hand]);

    return (
        <div className={crewClasses.playerContainer}>
            <h4 className={classNames(classes.bold, classes.noMargin)}>
                {player.name}
            </h4>
            <div className={crewClasses.cardContainer}>
                {sortedHand.map((card, i) => (
                    <Card
                        key={`player-${id}-card-${i}`}
                        card={card}
                        isCurrent={isCurrent}
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


function sortHand(hand) {
    const colors = {};

    for (let card of hand) {
        if (!colors[card.color]) {
            colors[card.color] = [];
        }
        colors[card.color].push(card);
    }

    Object.keys(colors).forEach(color => {
        colors[color].sort((a, b) => a.number - b.number);
    });

    return ['R', 'G', 'B', 'Y', 'W'].reduce((res, color) => {
        if (colors[color]) {
            res = res.concat(colors[color]);
        }
        return res;
    }, [])
}

export default Player;
