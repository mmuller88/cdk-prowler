// import { App, Stack } from 'aws-cdk-lib';
import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';

import { ProwlerAudit } from '../src/index';

const app = new App();

const stack = new Stack(app, 'ProwlerAudit-allowlist-test');

new ProwlerAudit(stack, 'ProwlerAudit', {
  allowlist: new Asset(stack, 'AllowList', {
    path: path.join(__dirname, 'allowlist.txt'),
  }),
});

app.synth();
