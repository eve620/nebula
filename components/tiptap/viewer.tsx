import React from "react";

interface ViewerProps {
    content: string
}

const Viewer: React.FC<ViewerProps> = ({content}) => {
    return (
        <div className={'p-10 prose dark:text-white prose-headings:dark:text-white prose-h1:text-3xl prose-h1:font-normal'} dangerouslySetInnerHTML={{__html: content}}/>
    );
};

export default Viewer;