import React from "react"

interface btnProps {
    text?: string,
    type?: 'button' | 'submit' | 'reset',
    icon?: React.ReactNode,
    className?: string
    onclick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}

const Button: React.FC<btnProps> = ({ text, type = 'button', icon, className, onclick, ...props }) => {
    return (
        <button type={type} className={className} onClick={onclick} {...props}>
            {icon}{text}
        </button>
    )
}

export default React.memo(Button)