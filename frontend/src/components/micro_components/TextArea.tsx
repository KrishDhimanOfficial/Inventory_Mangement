import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    text?: string;
    placeholder?: string;
    className?: string,
    id?: string,
}

const TextArea: React.FC<TextAreaProps> = ({ text, placeholder, className, id, ...props }) => {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            className={className}{...props} >
            {text}
        </textarea>
    )
}

export default React.memo(TextArea)