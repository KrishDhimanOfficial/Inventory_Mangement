import React from "react";
interface InputProps {
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string,
    id?: string
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, className, id }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            id={id}
        />
    )
}

export default React.memo(Input)