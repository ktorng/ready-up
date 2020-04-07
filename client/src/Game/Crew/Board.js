import React from 'react';
import T from 'prop-types';

import TasksList from './TasksList';

const Board = ({ gameState, tasks }) => {
    const { turn } = gameState;

    return (
        <div>
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
