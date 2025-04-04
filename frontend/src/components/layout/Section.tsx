import React from 'react';

interface SectionProps { children: React.ReactNode }

const Section: React.FC<SectionProps> = ({ children }) => {
    return (
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    {children}
                </div>
            </div>
        </section>
    )
}

export default Section