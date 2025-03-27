import React from "react";
interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder?: string;
    className?: string,
    id?: string,
    checked?: boolean,
    min?: number,
    max?: number
    value?: any
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, className, checked, id, min, max, ...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={className}
            id={id}
            checked={checked}
            min={min}
            max={max}
            value={value}
            {...props}
        />
    )
}

export default React.memo(Input)