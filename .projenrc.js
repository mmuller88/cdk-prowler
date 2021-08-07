const { AwsCdkConstructLibrary } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Martin Mueller',
  authorAddress: 'damadden88@googlemail.com',
  cdkVersion: '2.0.0-rc.16',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'cdk-prowler',
  repositoryUrl: 'https://github.com/mmuller88/cdk-prowler',
  peerDeps: [
    'aws-cdk-lib@2.0.0-rc.16',
    'constructs',
    'ts-node',
  ],
  devDeps: [
    'aws-cdk-lib@2.0.0-rc.16',
    'constructs',
    'ts-node',
  ],
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
    packageId: 'com.github.mmuller88.awsCdkBuildBadge',
  },
});

project.setScript('deploy', 'cdk deploy');
project.setScript('destroy', 'cdk destroy');
project.setScript('synth', 'cdk synth');

project.synth();