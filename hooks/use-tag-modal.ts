import {create} from 'zustand';

interface TagModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useTagModal = create<TagModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));


export default useTagModal;
