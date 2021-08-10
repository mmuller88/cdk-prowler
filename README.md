[![NPM version](https://badge.fury.io/js/cdk-prowler.svg)](https://badge.fury.io/js/cdk-prowler)
[![PyPI version](https://badge.fury.io/py/cdk-prowler.svg)](https://badge.fury.io/py/cdk-prowler)
[![.NET version](https://img.shields.io/nuget/v/com.github.mmuller88.awsCdkBuildBadge.svg?style=flat-square)](https://www.nuget.org/packages/com.github.mmuller88.cdkProwler/)
![Release](https://github.com/mmuller88/cdk-prowler/workflows/Release/badge.svg)

# cdk-prowler
An AWS CDK custom construct for deploying Prowler to you AWS Account. The following description about Prowler is taken from https://github.com/toniblyx/prowler: 

Prowler is a security tool to perform AWS security best practices assessments, audits, incident response, continuous monitoring, hardening and forensics readiness. It contains all CIS controls listed here https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf and more than 100 additional checks that help on GDPR, HIPAA…

It generates security html results which are stored in an s3 bucket:

![html results](misc/html-out.png)

And in your Codebuild Report group:

![Report group](misc/report-group-out.png)

# Example
```ts
    const app = new App();

    const stack = new Stack(app, 'ProwlerAudit-stack');

    new ProwlerAudit(stack, 'ProwlerAudit');
```

# cdk-prowler Properties
cdk-prowler supports some properties to tweak your stack. Like for running a Cloudwatch schedule to regualary run the Prowler scan with a defined cron expression.

You can see the supported properties in [Api.md](Api.md)

# Planned Features
* Supporting AWS SecurityHub https://github.com/toniblyx/prowler#security-hub-integration
* Triggering an event with SNS when prowler finishes the run
* AMI EC2 executable

# Architecture
![cfn](misc/cfn.jpg)

# Misc

```sh
yes | yarn destroy && yarn deploy --require-approval never
```

Rerun Prowler on deploy

```sh
yarn deploy --require-approval never -c reRunProwler=true
```

# Thanks To
* My friend and fellaw ex colleague Tony de la Fuente (https://github.com/toniblyx https://twitter.com/ToniBlyx) for developing such a cool security tool as [Prowler](https://github.com/toniblyx/prowler)
* As always to the amazing CDK / Projen Community. Join us on [Slack](https://cdk-dev.slack.com)!
* [Projen](https://github.com/projen/projen) project and the community around it

    