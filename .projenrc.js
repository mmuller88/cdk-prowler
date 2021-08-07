const { AwsCdkConstructLibrary } = require('projen');

const cdkVersion = '1.117.0';

const deps = [
  '@types/aws-lambda',
  'aws-lambda',
  'aws-sdk',
  'esbuild@^0',
  `@aws-cdk/assert@${cdkVersion}`,
  `cdk@${cdkVersion}`,
  'cdk-iam-floyd',
];

const cdkDependencies= [
  '@aws-cdk/aws-codebuild',
  '@aws-cdk/core',
  '@aws-cdk/aws-lambda',
  '@aws-cdk/aws-logs',
  '@aws-cdk/aws-s3',
  '@aws-cdk/aws-iam',
  '@aws-cdk/custom-resources',
];

const project = new AwsCdkConstructLibrary({
  author: 'Martin Mueller',
  authorAddress: 'damadden88@googlemail.com',
  // cdkVersion: '2.0.0-rc.16',
  cdkVersion,
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'cdk-prowler',
  repositoryUrl: 'https://github.com/mmuller88/cdk-prowler',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  autoApproveOptions: {
    allowedUsernames: ['aws-cdk-automation','github-bot'],
    secret: 'GITHUB_TOKEN',
  },
  cdkVersion,
  cdkVersionPinning: true,
  cdkDependencies,
  cdkDependenciesAsDeps: cdkDependencies,
  deps,
  // peerDeps: deps,
  bundledDeps: deps,
  cdkDependencies,
  // peerDeps: [
  //   'aws-cdk-lib@2.0.0-rc.16',
  //   'constructs',
  //   'ts-node',
  // ],
  // devDeps: [
  //   'aws-cdk-lib@2.0.0-rc.16',
  //   'constructs',
  //   'ts-node',
  // ],
  // cdkDependencies: [
  //   '@aws-cdk/core',
  // ],
  keywords: ['cdk', 'aws', 'prowler', 'audit', 'security', 'hardening'],
  python: {
    distName: 'cdk-prowler',
    module: 'cdk_prowler',
  },
  dotnet: {
    dotNetNamespace: 'com.github.mmuller88',
    packageId: 'com.github.mmuller88.cdkProwler',
  },
});

project.setScript('deploy', './node_modules/.bin/cdk deploy');
project.setScript('destroy', './node_modules/.bin/cdk destroy');
project.setScript('synth', './node_modules/.bin/cdk synth');

const common_exclude = ['cdk.out'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();