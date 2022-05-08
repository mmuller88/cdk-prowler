const fs = require('fs');
const { awscdk } = require('projen');

const exampleFile = fs
  .readFileSync('src/integ.default.ts', 'utf8')
  .split('\n');
const example = exampleFile.slice(8, exampleFile.length - 7);

const propertiesFile = fs.readFileSync('API.md', 'utf8');

const cdkVersion = '2.21.0';

const deps = ['cdk-iam-floyd'];
const devDeps = [`aws-cdk@${cdkVersion}`, 'cdk-dia'];

const shortDescription = 'An AWS CDK custom construct for deploying Prowler to your AWS Account. Prowler is a security tool to perform AWS security best practices assessments, audits, incident response, continuous monitoring, hardening and forensics readiness. It contains all CIS controls listed here https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf and more than 100 additional checks that help on GDPR, HIPAA …';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Martin Mueller',
  authorAddress: 'damadden88@googlemail.com',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  minNodeVersion: '14.17.0',
  cdkVersion,
  cdkVersionPinning: false,
  description: shortDescription,
  defaultReleaseBranch: 'main',
  name: 'cdk-prowler',
  repositoryUrl: 'https://github.com/mmuller88/cdk-prowler',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  autoApproveOptions: {
    allowedUsernames: ['aws-cdk-automation', 'github-bot'],
    secret: 'GITHUB_TOKEN',
  },
  peerDeps: deps,
  devDeps: [...deps, ...devDeps],
  catalog: {
    twitter: 'MartinMueller_',
  },
  keywords: [
    'awscdk',
    'prowler',
    'audit',
    'security',
    'hardening',
    'aws',
    'cdk',
  ],
  publishToPypi: {
    distName: 'cdk-prowler',
    module: 'cdk_prowler',
  },
  // publishToNuget: {
  //   dotNetNamespace: 'com.github.mmuller88',
  //   packageId: 'com.github.mmuller88.cdkProwler',
  // },
  readme: {
    contents: `[![NPM version](https://badge.fury.io/js/cdk-prowler.svg)](https://badge.fury.io/js/cdk-prowler)
[![PyPI version](https://badge.fury.io/py/cdk-prowler.svg)](https://badge.fury.io/py/cdk-prowler)
[![.NET version](https://img.shields.io/nuget/v/com.github.mmuller88.awsCdkBuildBadge.svg?style=flat-square)](https://www.nuget.org/packages/com.github.mmuller88.cdkProwler/)
![Release](https://github.com/mmuller88/cdk-prowler/workflows/Release/badge.svg)

Author = <https://martinmueller.dev>

# cdk-prowler
${shortDescription}

It generates security html results which are stored in an s3 bucket:

![html results](https://raw.githubusercontent.com/mmuller88/cdk-prowler/main/misc/html-out.png)

And in your Codebuild Report group:

![Report group](https://raw.githubusercontent.com/mmuller88/cdk-prowler/main/misc/report-group-out.png)

# AWS AMI
If you just want to make the Prowler security checks in your account try my [Prowler AWS Marketplace AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6). With just $1 Prowler will do over 180 security checks across a huge amount of AWS services in all your regions. Don't forget the terminate the Ec2 instance when the Prowler stack got created for not paying more than that $1 :).

With buying the AMI you support my on my passion for creating open source products like this cdk-prowler construct. Furthermore you enable me to work on future features like mentioned in the **Planned Features** section. Thank you so much :) !

# Example
\`\`\`ts
import { ProwlerAudit } from 'cdk-prowler';
...
${example.join('\n')}
\`\`\`

# Architect diagram
![diagram](https://raw.githubusercontent.com/mmuller88/cdk-prowler/main/misc/cdk-prowler.png)

# cdk-prowler Properties
cdk-prowler supports some properties to tweak your stack. Like for running a Cloudwatch schedule to regualary run the Prowler scan with a defined cron expression.

${propertiesFile}

# Cross Account Buckets

By providing your own Bucket you can have the CodeBuild project drop the Prowler results in another account. Make sure that you have your Bucket policy setup to allow the account running the Prowler reports access to writing those record.
Additionally, you will probably want to provide an \`additionalS3CopyArgs: '--acl bucket-owner-full-control'\` to ensure that those object can be read by the account owner.

# Planned Features
* Supporting AWS SecurityHub https://github.com/prowler-cloud/prowler#security-hub-integration
* Triggering an event with SNS when prowler finishes the run
* AMI EC2 executable

# Architecture
![cfn](misc/cfn.jpg)

# Misc

\`\`\`sh
yes | yarn destroy && yarn deploy --require-approval never
\`\`\`

Rerun Prowler on deploy

\`\`\`sh
yarn deploy --require-approval never -c reRunProwler=true
\`\`\`

# Thanks To
* My friend and fellaw ex colleague Tony de la Fuente (https://github.com/toniblyx https://twitter.com/ToniBlyx) for developing such a cool security tool as [Prowler](https://github.com/prowler-cloud/prowler)
* As always to the amazing CDK / Projen Community. Join us on [Slack](https://cdk-dev.slack.com)!
* [Projen](https://github.com/projen/projen) project and the community around it

    `,
  },
});

project.setScript('deploy', './node_modules/.bin/cdk deploy');
project.setScript('destroy', './node_modules/.bin/cdk destroy');
project.setScript('synth', 'yarn cdk synth && yarn cdk-dia && mv diagram.png diagrams/prowler.png');

project.setScript(
  'integ:allowlist',
  "cdk synth --app 'ts-node -P tsconfig.jest.json src/integ.allowlist.ts'",
);
project.setScript(
  'integ:allowlist-zip',
  "cdk synth --app 'ts-node -P tsconfig.jest.json src/integ.allowlist-zip.ts'",
);

const common_exclude = ['cdk.out'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);
project.gitignore.addPatterns('diagram.dot', 'diagram.png');

project.synth();
