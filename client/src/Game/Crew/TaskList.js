import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import { TASK_TYPES } from '../../common/utils';

import useCrewStyles from './useCrewStyles';
import useStyles from '../../common/useStyles';

const TaskList = ({ tasks, title, handleClickCard }) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();

    return (
        <div className={crewClasses.playerContainer}>
            <h5 className={classNames(classes.bold, classes.noMargin)}>
                {title}
            </h5>
            <div className={crewClasses.cardContainer}>
                {tasks.map((task, i) => (
                    <Card
                        key={`${task}-${i}-${task.playerId}`}
                        card={task.card}
                        taskProps={{
                            type: task.type,
                            order: task.order,
                        }}
                        handleClick={handleClickCard}
                    />
                ))}
            </div>
        </div>
    );
};

TaskList.propTypes = {
    tasks: T.arrayOf(T.shape({
        card: T.object.isRequired,
        type: T.oneOf(Object.keys(TASK_TYPES)).isRequired,
        order: T.number,
        playerId: T.string,
        isCompleted: T.bool,
    })),
    title: T.string,
    handleClickCard: T.func,
};

export default TaskList;
