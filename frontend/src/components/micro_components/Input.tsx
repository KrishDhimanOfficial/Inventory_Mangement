import React from "react";
interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder?: string;
    value?: string | boolean | number;
    onChange?: (e: any) => void,
    className?: string,
    id?: string,
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, className, id,...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value?.toString()}
            onChange={onChange}
            className={className}
            id={id}
            {...props}
        />
    )
}

export default React.memo(Input)