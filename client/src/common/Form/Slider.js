import React from 'react';
import { Slider as MuiSlider } from '@material-ui/core';

export const fieldToSliderProps = ({
    field,
    form: { isSubmitting },
    disabled = false,
    ...props
}) => ({
    disabled: isSubmitting || disabled,
    ...props,
    ...field,
    name: field.name,
    value: field.value
});

const Slider = (props) => (
    <MuiSlider
        {...fieldToSliderProps(props)}
        onChange={(e, value) => props.form.setFieldValue(props.field.name, value)}
        onBlur={(e, value) => props.form.handleBlur(props.field.name, value)}
    />
);

Slider.displayName = "FormikMaterialUISlider";

export default Slider;
