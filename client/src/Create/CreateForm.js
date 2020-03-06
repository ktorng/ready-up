import React from 'react';
import T from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress, Typography } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import Slider from '../common/Form/Slider';
import useStyles from '../common/useStyles';

const CreateForm = ({ createGame }) => {
    const classes = useStyles();

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
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
                await createGame({ variables: values });
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
                        label="Game name"
                    />
                    <Field
                        component={TextField}
                        className={classes.textField}
                        name="description"
                        placeholder="Where? When?"
                        type="text"
                        label="Description"
                    />
                    <Field name="size" placeholder="Number of players">
                        {({ field, form }) => (
                            <div className={classes.sliderWrapper}>
                                <Typography id="size-slider" gutterBottom>
                                    Number of players: {field.value}
                                </Typography>
                                <Slider
                                    field={field}
                                    form={form}
                                    className={classes.slider}
                                    defaultValue={4}
                                    getAriaValueText={value => `${value} players`}
                                    aria-labelledby="size-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={2}
                                    max={10}
                                />
                            </div>
                        )}
                    </Field>
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
