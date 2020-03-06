import React from 'react';
import T from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import useStyles from '../common/useStyles';

const CreateForm = ({ createGame }) => {
    const classes = useStyles();

    return (
        <Formik
            initialValues={{
                name: '',
                size: 4
            }}
            validate={values => {
                const errors = {};

                if (!values.name) {
                    errors.name = 'Required';
                }
                if (!values.size) {
                    errors.size = 'Required';
                }
                if (!values.description) {
                    errors.description = 'Required';
                }

                return errors;
            }}
            onSubmit={async (values, {setSubmitting}) => {
                await createGame({variables: values});
                setSubmitting(false);
            }}
        >
            {({submitForm, isSubmitting}) => (
                <Form className={classes.containerCenter}>
                    <h1>Create Game</h1>
                    <Field
                        component={TextField}
                        className={classes.textField}
                        name="name"
                        type="text"
                        label="Game Name"
                    />
                    <Field
                        component={TextField}
                        className={classes.textField}
                        name="description"
                        placeholder="Where? When?"
                        type="text"
                        label="Description"
                    />
                    {isSubmitting && <LinearProgress/>}
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Create
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

CreateForm.propTypes = {
    createGame: T.func.isRequired,
};

export default CreateForm;
