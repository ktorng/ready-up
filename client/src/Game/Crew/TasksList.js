import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

import useCrewStyles from './useCrewStyles';
import useStyles from '../../common/useStyles';

const TasksList = ({ tasks, title, handleClickCard }) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();

    return (
        <div className={crewClasses.playerContainer}>
            <h5 className={classNames(classes.bold, classes.noMargin)}>
                {title}
            </h5>
            <div className={crewClasses.cardContainer}>
                {[
                    ...(tasks.first ? (
                        <Card card={tasks.first} isTask taskReq={{ isFirst: true }} handleClick={handleClickCard} />
                    ) : (
                        []
                    )),
                    ...tasks.ordered.map((task, i) => (
                        <Card
                            key={`task-ordered-${i}`}
                            card={task}
                            isTask
                            taskReq={{ order: i + 1 }}
                            handleClick={handleClickCard}
                        />
                    )),
                    ...(tasks.last ? (
                        <Card card={tasks.last} isTask taskReq={{ isLast: true }} handleClick={handleClickCard} />
                    ) : (
                        []
                    )),
                    ...tasks.unordered.map((task, i) => (
                        <Card key={`task-unordered=${i}`} card={task} isTask handleClick={handleClickCard} />
                    ))
                ]}
            </div>
        </div>
    );
};

TasksList.propTypes = {
    tasks: T.shape({
        ordered: T.array,
        unordered: T.array,
        first: T.object,
        last: T.object
    }),
    title: T.string,
    handleClickCard: T.func,
};

export default TasksList;
