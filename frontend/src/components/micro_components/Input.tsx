import React from "react";
interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder?: string;
    onChange?: (e: any) => void,
    className?: string,
    id?: string,
    checked?: boolean,
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, onChange, className, checked, id, ...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            className={className}
            id={id}
            checked={checked}
            {...props}
        />
    )
}

export default React.memo(Input)