'use babel';

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
