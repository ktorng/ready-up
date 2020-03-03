import React from 'react';
import T from 'prop-types';
import isEmail from 'isemail';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

const LoginForm = ({ login }) => (
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
        onSubmit={async (values, { setSubmitting }) => {
            await login({ variables: values });
            setSubmitting(false);
        }}
    >
        {({ submitForm, isSubmitting }) => (
            <Form>
                <Field
                    component={TextField}
                    name="name"
                    type="text"
                    label="Display Name"
                />
                <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email"
                />
                {isSubmitting && <LinearProgress />}
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                >
                    Submit
                </Button>
            </Form>
        )}
    </Formik>
);

LoginForm.propTypes = {
    login: T.func.isRequired,
};

export default LoginForm;
