import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Bucket } from '@aws-cdk/aws-s3';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack } from '@aws-cdk/core';
import { ProwlerAudit, ProwlerAuditProps } from '../src';

const prowlerVersion = '2.6.0';

describe('Prowler Construct', () => {
  function createTestStack(makeProps: Function = () => ({})) {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new ProwlerAudit(stack, 'TestAudit', makeProps({ stack }));
    const assert = Template.fromStack(stack);
    return { stack, assert };
  }

  test('Uses default s3 bucket if none provided', () => {
    const { assert } = createTestStack();
    assert.resourceCountIs('AWS::S3::Bucket', 1);
    assert.hasResource('AWS::S3::Bucket', {});
  });

  test('Uses provided s3 bucket', () => {
    const { assert } = createTestStack(({ stack }: { stack: Stack }) => {
      return { reportBucket: new Bucket(stack, 'TestBucket', { bucketName: 'mytestbucket' }) };
    });
    assert.resourceCountIs('AWS::S3::Bucket', 1);
    assert.hasResourceProperties('AWS::S3::Bucket', { BucketName: 'mytestbucket' });
  });

  test('Uses provided report prefix', () => {
    const { assert } = createTestStack((): ProwlerAuditProps => {
      return { reportBucketPrefix: 'someprefix' };
    });
    assert.hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        EnvironmentVariables: [
          {
            Name: 'BUCKET_REPORT',
            Type: 'PLAINTEXT',
            Value: {
              Ref: 'TestAuditReportBucket865A4698',
            },
          },
          {
            Name: 'BUCKET_PREFIX',
            Type: 'PLAINTEXT',
            Value: 'someprefix',
          },
          {
            Name: 'ADDITIONAL_S3_ARGS',
            Type: 'PLAINTEXT',
            Value: '',
          },
          {
            Name: 'PROWLER_OPTIONS',
            Type: 'PLAINTEXT',
            Value: '-M text,junit-xml,html,csv,json',
          },
        ],
      },
      Source: {
        BuildSpec: {
          'Fn::Join': [
            '',
            [
              `{\n  "version": "0.2",\n  "phases": {\n    "install": {\n      "runtime-versions": {\n        "python": 3.8\n      },\n      "commands": [\n        "echo \\"Installing Prowler and dependencies...\\"",\n        "pip3 install detect-secrets",\n        "yum -y install jq",\n        "curl \\"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\\" -o \\"awscliv2.zip\\"",\n        "unzip awscliv2.zip",\n        "./aws/install",\n        "git clone -b ${prowlerVersion} https://github.com/toniblyx/prowler"\n      ]\n    },\n    "pre_build": {\n      "commands": []\n    },\n    "build": {\n      "commands": [\n        "echo \\"Running Prowler as ./prowler -M text,junit-xml,html,csv,json && echo OK || echo FAILED\\"",\n        "cd prowler",\n        "./prowler -M text,junit-xml,html,csv,json && echo OK || echo FAILED"\n      ]\n    },\n    "post_build": {\n      "commands": [\n        "echo \\"Uploading reports to S3...\\" ",\n        "aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/$BUCKET_PREFIX --recursive $ADDITIONAL_S3_ARGS",\n        "echo \\"Done!\\""\n      ]\n    }\n  },\n  "reports": {\n    "`,
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '/',
                      {
                        Ref: 'TestAuditreportGroup202AA555',
                      },
                    ],
                  },
                ],
              },
              '": {\n      "files": [\n        "**/*"\n      ],\n      "base-directory": "prowler/junit-reports",\n      "file-format": "JunitXml"\n    }\n  }\n}',
            ],
          ],
        },
        Type: 'NO_SOURCE',
      },
    });
  });

  test('Uses provided s3 copy arguments', () => {
    const { assert } = createTestStack((): ProwlerAuditProps => {
      return { additionalS3CopyArgs: '--acl bucket-owner-full-control' };
    });
    assert.hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        EnvironmentVariables: [
          {
            Name: 'BUCKET_REPORT',
            Type: 'PLAINTEXT',
            Value: {
              Ref: 'TestAuditReportBucket865A4698',
            },
          },
          {
            Name: 'BUCKET_PREFIX',
            Type: 'PLAINTEXT',
            Value: '',
          },
          {
            Name: 'ADDITIONAL_S3_ARGS',
            Type: 'PLAINTEXT',
            Value: '--acl bucket-owner-full-control',
          },
          {
            Name: 'PROWLER_OPTIONS',
            Type: 'PLAINTEXT',
            Value: '-M text,junit-xml,html,csv,json',
          },
        ],
      },
      Source: {
        BuildSpec: {
          'Fn::Join': [
            '',
            [
              `{\n  "version": "0.2",\n  "phases": {\n    "install": {\n      "runtime-versions": {\n        "python": 3.8\n      },\n      "commands": [\n        "echo \\"Installing Prowler and dependencies...\\"",\n        "pip3 install detect-secrets",\n        "yum -y install jq",\n        "curl \\"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\\" -o \\"awscliv2.zip\\"",\n        "unzip awscliv2.zip",\n        "./aws/install",\n        "git clone -b ${prowlerVersion} https://github.com/toniblyx/prowler"\n      ]\n    },\n    "pre_build": {\n      "commands": []\n    },\n    "build": {\n      "commands": [\n        "echo \\"Running Prowler as ./prowler -M text,junit-xml,html,csv,json && echo OK || echo FAILED\\"",\n        "cd prowler",\n        "./prowler -M text,junit-xml,html,csv,json && echo OK || echo FAILED"\n      ]\n    },\n    "post_build": {\n      "commands": [\n        "echo \\"Uploading reports to S3...\\" ",\n        "aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/$BUCKET_PREFIX --recursive $ADDITIONAL_S3_ARGS",\n        "echo \\"Done!\\""\n      ]\n    }\n  },\n  "reports": {\n    "`,
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '/',
                      {
                        Ref: 'TestAuditreportGroup202AA555',
                      },
                    ],
                  },
                ],
              },
              '": {\n      "files": [\n        "**/*"\n      ],\n      "base-directory": "prowler/junit-reports",\n      "file-format": "JunitXml"\n    }\n  }\n}',
            ],
          ],
        },
        Type: 'NO_SOURCE',
      },
    });
  });

  test('is allowlist setup correctly', () => {

    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new ProwlerAudit(stack, 'TestAudit', {
      allowlist: new Asset(stack, 'AllowList', {
        path: path.join(__dirname, 'allowlist.txt'),
      }),
    });
    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        EnvironmentVariables: [
          {
            Name: 'BUCKET_REPORT',
            Type: 'PLAINTEXT',
            Value: {
              Ref: 'TestAuditReportBucket865A4698',
            },
          },
          {
            Name: 'BUCKET_PREFIX',
            Type: 'PLAINTEXT',
            Value: '',
          },
          {
            Name: 'ADDITIONAL_S3_ARGS',
            Type: 'PLAINTEXT',
            Value: '',
          },
          {
            Name: 'PROWLER_OPTIONS',
            Type: 'PLAINTEXT',
            Value: '-M text,junit-xml,html,csv,json -w allowlist.txt',
          },
        ],
      },
      Source: {
        BuildSpec: {
          'Fn::Join': [
            '',
            [
              `{\n  "version": "0.2",\n  "phases": {\n    "install": {\n      "runtime-versions": {\n        "python": 3.8\n      },\n      "commands": [\n        "echo \\"Installing Prowler and dependencies...\\"",\n        "pip3 install detect-secrets",\n        "yum -y install jq",\n        "curl \\"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\\" -o \\"awscliv2.zip\\"",\n        "unzip awscliv2.zip",\n        "./aws/install",\n        "git clone -b ${prowlerVersion} https://github.com/toniblyx/prowler"\n      ]\n    },\n    "pre_build": {\n      "commands": [\n        "aws s3 cp s3://`,
              {
                Ref: 'AssetParameters9aea54d9a7efe166d507f4871a7a1a483e26e0735cb063ce42afd545ce703601S3Bucket5E97AAE6',
              },
              '/',
              {
                'Fn::Select': [
                  0,
                  {
                    'Fn::Split': [
                      '||',
                      {
                        Ref: 'AssetParameters9aea54d9a7efe166d507f4871a7a1a483e26e0735cb063ce42afd545ce703601S3VersionKey1A9EEC90',
                      },
                    ],
                  },
                ],
              },
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '||',
                      {
                        Ref: 'AssetParameters9aea54d9a7efe166d507f4871a7a1a483e26e0735cb063ce42afd545ce703601S3VersionKey1A9EEC90',
                      },
                    ],
                  },
                ],
              },
              ' prowler/allowlist.txt"\n      ]\n    },\n    "build": {\n      "commands": [\n        "echo \\"Running Prowler as ./prowler -M text,junit-xml,html,csv,json -w allowlist.txt && echo OK || echo FAILED\\"",\n        "cd prowler",\n        "./prowler -M text,junit-xml,html,csv,json -w allowlist.txt && echo OK || echo FAILED"\n      ]\n    },\n    "post_build": {\n      "commands": [\n        "echo \\"Uploading reports to S3...\\" ",\n        "aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/$BUCKET_PREFIX --recursive $ADDITIONAL_S3_ARGS",\n        "echo \\"Done!\\""\n      ]\n    }\n  },\n  "reports": {\n    "',
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '/',
                      {
                        Ref: 'TestAuditreportGroup202AA555',
                      },
                    ],
                  },
                ],
              },
              '": {\n      "files": [\n        "**/*"\n      ],\n      "base-directory": "prowler/junit-reports",\n      "file-format": "JunitXml"\n    }\n  }\n}',
            ],
          ],
        },
        Type: 'NO_SOURCE',
      },
    });
  });

});