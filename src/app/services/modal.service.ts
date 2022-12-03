import {Injectable} from '@angular/core';

interface IModal {
    id: string;
    isOpen: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _modals: IModal[];
    constructor() {
        this._modals = [];
    }

    isModalOpen(id: string): boolean {
        return !!this._modals.find(x => x.id === id)?.isOpen;
    }

    toggleModal(id: string) {
        const modal = this._modals.find(x => x.id === id);
        if (modal) {
            modal.isOpen = !modal.isOpen;
        }
    }

    register(id: string) {
        this._modals.push({
            id,
            isOpen: false
        });
    }

    unregister(id: string) {
        this._modals = this._modals.filter(x => x.id !== id);
    }
}
