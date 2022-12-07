import {AfterContentInit, Component, ContentChildren, QueryList} from '@angular/core';
import {TabComponent} from "../tab/tab.component";

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();

    ngAfterContentInit(): void {
        const activeTabs = this.tabs.filter(x => x.active);

        if (!activeTabs || activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: TabComponent) {
        this.tabs.forEach(x => x.active = false);

        tab.active = true;

        return false;
    }
}
