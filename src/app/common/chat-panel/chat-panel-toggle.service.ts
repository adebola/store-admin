import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChatPanelToggleService {
    private isChatPanelOpen = new BehaviorSubject<boolean>(false);

    get isChatPanelOpen$() {
        return this.isChatPanelOpen.asObservable();
    }

    toggle() {
        this.isChatPanelOpen.next(!this.isChatPanelOpen.value);
    }

    open() {
        this.isChatPanelOpen.next(true);
    }

    close() {
        this.isChatPanelOpen.next(false);
    }
}
