import React from "react";
interface InputProps {
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, className }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
        />
    )
}

export default React.memo(Input)