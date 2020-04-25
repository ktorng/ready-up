import React, { useState } from 'react';
import T from 'prop-types';

import TaskList from './TaskList';
import Card from './Card';
import ConfirmModal from './ConfirmModal';
import { ASSIGN_TASK } from './actions';
import { useGameContext, useMeContext } from '../../common/utils';

import useCrewStyles from './hooks/useCrewStyles';
import { useMutation } from '@apollo/react-hooks';

const Board = ({ tasks }) => {
    const crewClasses = useCrewStyles();
    const game = useGameContext();
    const me = useMeContext();
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignTask] = useMutation(ASSIGN_TASK);
    const {
        gameState: { playerStates, rounds, turn, isLost },
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

    if (turn === -1) {
        return (
            <div className={crewClasses.boardContainer}>
                {isLost ? 'You lose!' : 'You win!'}
            </div>
        );
    }

    return (
        <div className={crewClasses.boardContainer}>
            {!turn ? (
                <TaskList tasks={tasks} title="Assign Tasks" handleClickCard={handleClickCard} />
            ) : (
                <div>
                    <h4>Game in progress</h4>
                    <h5>Rounds</h5>
                    {rounds
                        .filter((round) => round.cards.length === game.players.length)
                        .map((round, i) => (
                            <div key={`round-${i}`} className={crewClasses.cardContainer}>
                                {round.cards.map((card, j) => (
                                    <Card
                                        key={`round-${i}-card-${j}`}
                                        card={card}
                                        hideHover
                                        shouldShow
                                    />
                                ))}
                            </div>
                        ))}
                    <h5>Current round</h5>
                    <div className={crewClasses.cardContainer}>
                        {playerStates
                            .filter((ps) => !!ps.played)
                            .map((ps, i) => (
                                <Card
                                    key={`cr-card-${i}`}
                                    card={ps.played}
                                    hideHover
                                    shouldShow
                                />
                            ))}
                    </div>
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
    tasks: T.array, // unassigned tasks
};

export default Board;
