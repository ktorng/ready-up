import React from 'react';
import T from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import useStyles from '../common/useStyles';

const JoinForm = ({ joinGame, loading }) => {
    const classes = useStyles();

    return (
        <Formik
            initialValues={{
                accessCode: '',
            }}
            validate={values => {
                const errors = {};

                if (!values.accessCode) {
                    errors.accessCode = 'Required';
                } else if (!/^[a-z]{4}$/.test(values.accessCode)) {
                    errors.accessCode = 'Access code must be a 4 character code';
                }

                return errors;
            }}
            onSubmit={async (values, { setSubmitting}) => {
                await joinGame({ variables: values });
                setSubmitting(false);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <Form className={classes.containerCenter}>
                    <h1>Join Game</h1>
                    <fieldset className={classes.noBorder} disabled={loading}>
                        <Field
                            component={TextField}
                            className={classes.textField}
                            name="accessCode"
                            type="text"
                            label="Access code"
                        />
                        {isSubmitting && <LinearProgress />}
                    </fieldset>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Join
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

JoinForm.propTypes = {
    joinGame: T.func.isRequired,
};

export default JoinForm;

