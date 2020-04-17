import React, { useState } from 'react';
import T from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import TaskList from './TaskList';
import Card from './Card';
import { ASSIGN_TASK } from './actions';
import { useGameContext, useMeContext } from '../../common/utils';

import useCrewStyles from './useCrewStyles';
import useStyles from '../../common/useStyles';
import { useMutation } from '@apollo/react-hooks';

const useModalStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));

const Board = ({ gameState, tasks }) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const modalClasses = useModalStyles();
    const game = useGameContext();
    const me = useMeContext();
    const { turn } = gameState;
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignTask] = useMutation(ASSIGN_TASK);

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
                isLast: tasks.length === 1
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
                'Game in progress'
            )}
            {open && (
                <Modal open={open} onClose={handleClose}>
                    <div className={modalClasses.paper}>
                        <h4>Are you sure you want to take this task?</h4>
                        <Card
                            card={selectedTask.card}
                            taskProps={selectedTask.taskProps}
                            hideHover
                        />
                        <div>
                            <Button
                                className={classes.button}
                                variant="outlined"
                                color="primary"
                                onClick={handleConfirmAssignTask}
                            >
                                Yes
                            </Button>
                            <Button
                                className={classes.button}
                                variant="outlined"
                                color="secondary"
                                onClick={handleClose}
                            >
                                Nevermind
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

Board.propTypes = {
    gameState: T.object.isRequired,
    tasks: T.array, // unassigned tasks
};

export default Board;
