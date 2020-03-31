import React, { useMemo } from 'react';
import T from 'prop-types';

import AssignTasks from './AssignTasks';

const Board = ({ game }) => {
    console.log(game);
    const { gameState } = game;
    const { tasks, turn } = useMemo(() => {
        return JSON.parse(gameState);
    }, [gameState]);
    console.log(tasks);

    return (
        <div>
            {!turn ? (
                <AssignTasks tasks={tasks} />
            ) : (
                'Game in progress'
            )}
        </div>
    );
};

Board.propTypes = {
    game: T.object.isRequired
};

export default Board;
