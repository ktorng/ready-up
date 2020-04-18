import React, { useState } from 'react';
import T from 'prop-types';

import TaskList from './TaskList';
import Card from './Card';
import ConfirmModal from './ConfirmModal';
import { ASSIGN_TASK } from './actions';
import { useGameContext, useMeContext } from '../../common/utils';

import useCrewStyles from './useCrewStyles';
import { useMutation } from '@apollo/react-hooks';

const Board = ({ gameState, tasks }) => {
    const crewClasses = useCrewStyles();
    const game = useGameContext();
    const me = useMeContext();
    const { turn } = gameState;
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignTask] = useMutation(ASSIGN_TASK);
    const {
        gameState: { playerStates, rounds },
    } = game;

    const handleClickCard = (card, taskProps) => {
        setOpen(true);
        setSelectedTask({ card, taskProps });
    };

    const handleConfirmAssignTask = () => {
        const { color, number } = selectedTask.card;
        assignTask({
            variables: {
                gameId: game.id,
                card: { color, number, playerId: me.playerId },
                isLast: tasks.length === 1,
            },
        });
        setOpen(false);
    };

    const handleClose = () => setOpen(false);

    return (
        <div className={crewClasses.boardContainer}>
            {!turn ? (
                <TaskList tasks={tasks} title="Assign Tasks" handleClickCard={handleClickCard} />
            ) : (
                <div>
                    <h4>Game in progress</h4>
                    <h5>Rounds</h5>
                    {rounds.map((round, i) => (
                        <div key={`round-${i}`}>
                            {round.map((card, j) => (
                                <Card
                                    key={`round-${i}-card-${j}`}
                                    card={card}
                                    hideHover
                                />
                            ))}
                        </div>
                    ))}
                    <h5>Current round</h5>
                    {playerStates
                        .filter((ps) => !!ps.played)
                        .map((ps, i) => (
                            <Card
                                key={`cr-card-${i}`}
                                card={ps.played}
                                hideHover
                            />
                        ))}
                </div>
            )}
            {open && (
                <ConfirmModal open={open} onConfirm={handleConfirmAssignTask} onClose={handleClose}>
                    <h4>Are you sure you want to take this task?</h4>
                    <Card card={selectedTask.card} taskProps={selectedTask.taskProps} hideHover />
                </ConfirmModal>
            )}
        </div>
    );
};

Board.propTypes = {
    gameState: T.object.isRequired,
    tasks: T.array, // unassigned tasks
};

export default Board;
