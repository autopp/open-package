'use babel';

/**
 * Copyright 2017 autopp
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import SelectListView from 'atom-select-list'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

export default class OpenPackageView {
  constructor() {
    this.packages = [];
    this.selectListView = new SelectListView({
      items: this.packages,
      emptyMessage: 'No matches found',
      filterKeyForItem: (name) => name,
      elementForItem: (name) => {
        const li = document.createElement('li');
        li.classList.add('event');
        li.dataset.eventName = name;

        const span = document.createElement('span');
        span.title = name;

        const query = this.selectListView.getQuery();
        const matches = fuzzaldrinPlus.match(name, query);
        let matchedChars = [];
        let lastIndex = 0;
        for (const matchIndex of matches) {
          const unmatched = name.substring(lastIndex, matchIndex);
          if (unmatched) {
            if (matchedChars.length > 0) {
              const matchSpan = document.createElement('span');
              matchSpan.classList.add('character-match');
              matchSpan.textContent = matchedChars.join('');
              span.appendChild(matchSpan);
              matchedChars = [];
            }

            span.appendChild(document.createTextNode(unmatched));
          }

          matchedChars.push(name[matchIndex]);
          lastIndex = matchIndex + 1;
        }

        if (matchedChars.length > 0) {
          const matchSpan = document.createElement('span');
          matchSpan.classList.add('character-match');
          matchSpan.textContent = matchedChars.join('');
          span.appendChild(matchSpan);
        }

        const unmatched = name.substring(lastIndex);
        if (unmatched) {
          span.appendChild(document.createTextNode(unmatched));
        }

        li.appendChild(span);
        return li;
      },
      didConfirmSelection: (name) => {
        const packagePath = atom.packages.resolvePackagePath(name);
        atom.open({ pathsToOpen: [packagePath] });
        this.hide();
      },
      didCancelSelection: () => {
        this.hide();
      }
    })
    this.selectListView.element.classList.add('open-package');
  }

  // Tear down any state and detach
  async destroy() {
    await this.selectListView.destroy();
  }

  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.hide();
      return Promise.resolve();
    } else {
      return this.show();
    }
  }

  async show () {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
    }

    this.selectListView.reset();
    this.activeElement = (document.activeElement === document.body) ? atom.views.getView(atom.workspace) : document.activeElement;
    this.commands = atom.packages.getAvailablePackageNames().filter((name) => !atom.packages.isBundledPackage(name));
    this.commands.sort((a, b) => a.localeCompare(b));
    await this.selectListView.update({ items: this.commands });

    this.previousFocusedElement = document.activeElement;
    this.panel.show();
    this.selectListView.focus();
  }

  hide () {
    this.panel.hide();
    if (this.previousFocusedElement) {
      this.previousFocusedElement.focus();
      this.previousFocusedElement = null;
    }
  }
}
