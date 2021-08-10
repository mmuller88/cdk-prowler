// import { App, Stack } from 'aws-cdk-lib';
import { App, Stack } from '@aws-cdk/core';

import { ProwlerAudit } from '../src/index';

export class IntegTesting {
  readonly stack: Stack[];
  constructor() {
    const app = new App();

    const stack = new Stack(app, 'ProwlerAudit-stack');

    new ProwlerAudit(stack, 'ProwlerAudit');

    this.stack = [stack];
  }
}

new IntegTesting();
