import React from 'react';
import T from 'prop-types';

import TasksList from './TasksList';

import useCrewStyles from './useCrewStyles';

const Board = ({ gameState, tasks }) => {
    const crewClasses = useCrewStyles();
    const { turn } = gameState;

    return (
        <div className={crewClasses.boardContainer}>
            {!turn ? (
                <TasksList tasks={tasks} title="Assign Tasks" />
            ) : (
                'Game in progress'
            )}
        </div>
    );
};

Board.propTypes = {
    gameState: T.object.isRequired,
    tasks: T.object, // unassigned tasks
};

export default Board;
