// import { App, Stack } from 'aws-cdk-lib';
import * as path from 'path';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, DockerImage, Stack } from '@aws-cdk/core';

import { ProwlerAudit } from '../src/index';

const app = new App();

const stack = new Stack(app, 'ProwlerAudit-allowlist-test');

new ProwlerAudit(stack, 'ProwlerAudit', {
  allowlist: new Asset(stack, 'AllowList', {
    path: path.join(__dirname),
    bundling: {
      image: DockerImage.fromRegistry('alpine'),
      command: ['/bin/sh', '-c', 'cat allowlist.txt > /asset-output/allowlist.txt'],
    },
  }),
});

app.synth();