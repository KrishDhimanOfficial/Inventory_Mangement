import React from 'react'

interface ImgProps {
    path: string,
    alt?: string,
    className: string,
    style?: object
}

const Image: React.FC<ImgProps> = ({  path, alt = 'image', className, style }) => {
    return (
        <img
            src={path}
            alt={alt}
            className={className}
            style={style}
        />
    )
}

export default React.memo(Image)