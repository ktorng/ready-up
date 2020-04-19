import React from 'react';
import T from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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

const ConfirmModal = ({ children, open, onConfirm, onClose }) => {
    const classes = useStyles();
    const modalClasses = useModalStyles();

    return (
        <Modal open={open} onClose={onClose}>
            <div className={modalClasses.paper}>
                {children}
                <div>
                    <Button
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        onClick={onConfirm}
                    >
                        Yes
                    </Button>
                    <Button
                        className={classes.button}
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                    >
                        Nevermind
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

ConfirmModal.propTypes = {
    open: T.bool.isRequired,
    onConfirm: T.func.isRequired,
    children: T.node,
};

export default ConfirmModal;
