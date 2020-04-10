import React, { useState } from 'react';
import T from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import TasksList from './TasksList';

import useCrewStyles from './useCrewStyles';

const Board = ({ gameState, tasks }) => {
    const crewClasses = useCrewStyles();
    const { turn } = gameState;
    const [open, setOpen] = useState(false);

    const handleClickCard = (card) => {
        console.log(card);
        setOpen(true);
    };

    return (
        <div className={crewClasses.boardContainer}>
            {!turn ? (
                <TasksList tasks={tasks} title="Assign Tasks" handleClickCard={handleClickCard} />
            ) : (
                'Game in progress'
            )}
            {open && (
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <>
                        <h4>Are you sure you want to take this task?</h4>
                        <div>
                            <Button>Yes</Button>
                            <Button>Nevermind</Button>
                        </div>
                    </>
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
