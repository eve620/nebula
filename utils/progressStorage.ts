export const setLocalProgress = (courseId: string, wordIndex: number) => {
    localStorage.setItem('courseProgress', JSON.stringify({courseId, wordIndex}));
};

export const getLocalProgress = () => {
    const progress = localStorage.getItem('courseProgress');
    return progress ? JSON.parse(progress) : null;
};

export const removeLocalProgress = () => {
    localStorage.removeItem('courseProgress');
};

