import React from 'react';
import T from 'prop-types';
import isEmail from 'isemail';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import useStyles from '../common/useStyles';

const LoginForm = ({ login }) => {
    const classes = useStyles();

    return (
        <Formik
            initialValues={{
                name: '',
                email: ''
            }}
            validate={values => {
                const errors = {};

                if (!values.name) {
                    errors.name = 'Required';
                }
                if (!values.email) {
                    errors.email = 'Required';
                } else if (!isEmail.validate(values.email)) {
                    errors.email = 'Invalid email address';
                }

                return errors;
            }}
            onSubmit={async (values, {setSubmitting}) => {
                await login({variables: values});
                setSubmitting(false);
            }}
        >
            {({submitForm, isSubmitting}) => (
                <Form className={classes.containerCenter}>
                    <h1>Ready Up </h1>
                    <Field
                        component={TextField}
                        className={classes.textField}
                        name="name"
                        type="text"
                        label="Display Name"
                    />
                    <Field
                        component={TextField}
                        className={classes.textField}
                        name="email"
                        type="email"
                        label="Email"
                    />
                    {isSubmitting && <LinearProgress/>}
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Login
                    </Button>
                </Form>
            )}
        </Formik>
    );
}

LoginForm.propTypes = {
    login: T.func.isRequired,
};

export default LoginForm;
