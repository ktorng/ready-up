import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Card from './Card';
import TasksList from './TasksList';

import useStyles from '../../common/useStyles';
import useCrewStyles from './useCrewStyles';

const Player = ({ user, tasks }) => {
    const { id, playerState } = user;
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const sortedHand = useMemo(() => {
        const { hand } = JSON.parse(playerState);

        return sortHand(hand);
    }, [playerState]);
    const hasTasks = useMemo(() => {
        return Object.keys(tasks).some((type) => !isEmpty(tasks[type]));
    }, [tasks]);

    return (
        <div>
            <h4 className={classNames(classes.bold, classes.noMargin)}>
                {user.name}
            </h4>
            <div className={crewClasses.cardContainer}>
                {sortedHand.map((card, i) => (
                    <Card
                        key={`player-${id}-card-${i}`}
                        card={card}
                    />
                ))}
            </div>
            {hasTasks && (
                <TasksList tasks={tasks} title="Tasks to complete" />
            )}
        </div>
    );
};

Player.propTypes = {
    user: T.object,
    tasks: T.object,
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
