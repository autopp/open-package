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

import OpenPackageView from './open-package-view';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate() {
    this.openPackageView = new OpenPackageView();

    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'open-package:toggle': () => this.openPackageView.toggle()
    }));

    return this.openPackageView.show();
  },

  async deactivate() {
    this.subscriptions.dispose();
    this.openPackageView.destroy();
  }
};
