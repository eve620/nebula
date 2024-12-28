import React from "react";

interface ViewerProps {
    content: string
}

const Viewer: React.FC<ViewerProps> = ({content}) => {
    return (
        <div className={'p-10 text-wrap leading-8'} dangerouslySetInnerHTML={{__html: content}}/>
    );
};

export default Viewer;