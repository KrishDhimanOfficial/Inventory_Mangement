import React from "react";

interface TextAreaProps extends React.HTMLAttributes<HTMLInputElement> {
    text?: string;
    placeholder?: string;
    className?: string,
    id?: string,
}

const TextArea: React.FC<TextAreaProps> = ({ text, placeholder, className, id }) => {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            className={className}>
            {text}
        </textarea>
    )
}

export default React.memo(TextArea)