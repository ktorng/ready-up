import React, { useState } from 'react';
import T from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import TasksList from './TasksList';
import Card from './Card';

import useCrewStyles from './useCrewStyles';
import useStyles from '../../common/useStyles';

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
    const { turn } = gameState;
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleClickCard = (card, taskReq) => {
        console.log(card);
        setOpen(true);
        setSelectedTask({ card, taskReq });
    };

    const handleClose = () => setOpen(false);

    return (
        <div className={crewClasses.boardContainer}>
            {!turn ? (
                <TasksList tasks={tasks} title="Assign Tasks" handleClickCard={handleClickCard} />
            ) : (
                'Game in progress'
            )}
            {open && (
                <Modal open={open} onClose={handleClose}>
                    <div className={modalClasses.paper}>
                        <h4>Are you sure you want to take this task?</h4>
                        <Card card={selectedTask.card} taskReq={selectedTask.taskReq} isTask hideHover />
                        <div>
                            <Button className={classes.button} variant="outlined" color="primary">
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
    tasks: T.object, // unassigned tasks
};

export default Board;
