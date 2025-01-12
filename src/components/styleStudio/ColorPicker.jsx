import { ChromePicker } from 'react-color';
import { useState } from 'react';

const ColorPicker = ({ onColorChange }) => {
    const [color, setColor] = useState('#ffffff'); // Default color

    const handleChange = (updatedColor) => {
        setColor(updatedColor.hex);
        onColorChange(updatedColor.hex);
    };

    return <ChromePicker color={color} onChange={handleChange} />;
};

export default ColorPicker;