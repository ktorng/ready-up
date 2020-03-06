import React from 'react';
import { Slider } from '@material-ui/core';

const SizeSlider = ({ value, onChange }) => {

    return (
        <Slider
            value={value}
            onChange={onChange}
            defaultValue={4}
            getAriaValueText={value}
            aria-labelledby="size-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={10}
        />
    );
};

export default SizeSlider;
