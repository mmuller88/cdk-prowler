// import { Stack, Duration, RemovalPolicy, CustomResource } from 'aws-cdk-lib';
// eslint-disable-next-line no-duplicate-imports
// import { aws_iam as iam, aws_logs as logs, aws_s3 as s3, aws_codebuild as codebuild, aws_lambda as lambda, custom_resources as cr } from 'aws-cdk-lib';
// import { Construct } from 'constructs';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as s3 from '@aws-cdk/aws-s3';
import { IBucket } from '@aws-cdk/aws-s3';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { Construct, CustomResource, Duration, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as statement from 'cdk-iam-floyd';

export interface ProwlerAuditProps {
  /**
   * Specifies the service name used within component naming
   * @default: prowler
   */
  readonly serviceName?: string;

  /**
   * Specifies the number of days you want to retain CodeBuild run log events in the specified log group. Junit reports are kept for 30 days, HTML reports in S3 are not deleted
   * @default: 3
   */
  readonly logsRetentionInDays?: logs.RetentionDays;

  /**
   * Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports. Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"
   * @default '-M text,junit-xml,html,csv,json'
   */
  readonly prowlerOptions?: string;

  /**
   * enables the scheduler for running prowler periodically. Together with prowlerScheduler.
   * @default false
   */
  readonly enableScheduler?: boolean;

  /**
   * The time when Prowler will run in cron format. Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.
   * @default 'cron(0 22 * * ? *)'
   */
  readonly prowlerScheduler?: string;

  /**
   * Specifies the concrete Prowler version
   * @default 2.6.0
   */
  readonly prowlerVersion?: string;

  /**
   * An optional S3 bucket to store the Prowler reports
   */
  readonly reportBucket?: IBucket;

  /**
   * An optional prefix for the report bucket objects
   */
  readonly reportBucketPrefix?: string;

  /**
   * An optional parameter to add to the S3 bucket copy command.
   *
   * @example --acl bucket-owner-full-control
   */
  readonly additionalS3CopyArgs?: string;

  /**
   * An Prowler-specific Allowlist file. If a value is provided then this is passed to Prowler on runs using the '-w' flag.
   * If no value is provided, the -w parameter is not used. If you provide an asset that is zipped, it must contain
   * an 'allowlist.txt' file which will be passed to Prowler.
   *
   * @example new Asset(this, 'AllowList', { path: path.join(__dirname, 'allowlist.txt') })
   * @default undefined
   */
  readonly allowlist?: Asset;
}

/**
 * Creates a CodeBuild project to audit an AWS account with Prowler and stores the html report in a S3 bucket. This will run onece at the beginning and on a schedule afterwards. Partial contribution from https://github.com/stevecjones
 */
export class ProwlerAudit extends Construct {
  serviceName: string;
  logsRetentionInDays: logs.RetentionDays;
  enableScheduler: boolean;
  prowlerScheduler: string;
  prowlerOptions: string;
  prowlerVersion: string;
  codebuildProject: codebuild.Project;

  constructor(parent: Stack, id: string, props?: ProwlerAuditProps) {
    super(parent, id);

    // defaults
    this.serviceName = props?.serviceName ? props.serviceName : 'prowler';
    this.logsRetentionInDays = props?.logsRetentionInDays ? props.logsRetentionInDays : logs.RetentionDays.THREE_DAYS;
    this.enableScheduler = props?.enableScheduler ? props.enableScheduler : false;
    this.prowlerScheduler = props?.prowlerScheduler ? props.prowlerScheduler : 'cron(0 22 * * ? *)';
    this.prowlerOptions = props?.prowlerOptions ? props.prowlerOptions : '-M text,junit-xml,html,csv,json';
    this.prowlerVersion = props?.prowlerVersion ? props.prowlerVersion : '2.6.0';

    const reportBucket = props?.reportBucket ?? new s3.Bucket(this, 'ReportBucket', {
      //bucketName: `${'123456'}-prowler-reports`,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const reportGroup = new codebuild.ReportGroup(this, 'reportGroup', { /**reportGroupName: 'testReportGroup', */removalPolicy: RemovalPolicy.DESTROY });

    const preBuildCommands: string[] = [];
    if (!!props?.allowlist) {
      const prowlerFilename = 'allowlist.txt';

      if (props.allowlist.isZipArchive) {
        preBuildCommands.push(`aws s3 cp ${props.allowlist.s3ObjectUrl} .`);
        preBuildCommands.push(`unzip ${props.allowlist.s3ObjectKey} -d prowler`);
      } else {
        preBuildCommands.push(`aws s3 cp ${props.allowlist.s3ObjectUrl} prowler/${prowlerFilename}`);
      }
      this.prowlerOptions = this.prowlerOptions + ` -w ${prowlerFilename}`;
    }

    const prowlerBuild = this.codebuildProject = new codebuild.Project(this, 'prowlerBuild', {
      description: 'Run Prowler assessment',
      timeout: Duration.hours(5),
      environment: {
        environmentVariables: {
          BUCKET_REPORT: { value: reportBucket.bucketName || '' },
          BUCKET_PREFIX: { value: props?.reportBucketPrefix ?? '' },
          ADDITIONAL_S3_ARGS: { value: props?.additionalS3CopyArgs ?? '' },
          PROWLER_OPTIONS: { value: this.prowlerOptions || '' },
        },
        buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-x86_64-standard:3.0'),
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              python: 3.8,
            },
            'commands': [
              'echo "Installing Prowler and dependencies..."',
              'pip3 install detect-secrets',
              'yum -y install jq',
              'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
              'unzip awscliv2.zip',
              './aws/install',
              `git clone -b ${this.prowlerVersion} https://github.com/toniblyx/prowler`,
            ],
          },
          pre_build: {
            commands: preBuildCommands,
          },
          build: {
            commands: [
              `echo "Running Prowler as ./prowler ${this.prowlerOptions} && echo OK || echo FAILED"`,
              'cd prowler',
              `./prowler ${this.prowlerOptions} && echo OK || echo FAILED`,
            ],
          },
          post_build: {
            commands: [
              'echo "Uploading reports to S3..." ',
              'aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/$BUCKET_PREFIX --recursive $ADDITIONAL_S3_ARGS',
              'echo "Done!"',
            ],
          },
        },
        reports: {
          [reportGroup.reportGroupName]: {
            'files': ['**/*'],
            'base-directory': 'prowler/junit-reports',
            'file-format': 'JunitXml',
          },
        },
      }),
    });

    if (!!props?.allowlist) {
      props.allowlist.bucket.grantRead(prowlerBuild);
    }

    prowlerBuild.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('SecurityAudit'));
    prowlerBuild.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('job-function/ViewOnlyAccess'));
    // prowlerBuild.addToRolePolicy(new statement.Dax().allow().to());
    prowlerBuild.addToRolePolicy(new statement.Ds().allow().toListAuthorizedApplications());
    prowlerBuild.addToRolePolicy(new statement.Ec2().allow().toGetEbsEncryptionByDefault());
    prowlerBuild.addToRolePolicy(new statement.Ecr().allow().toDescribeImageScanFindings().toDescribeImages().toDescribeRegistry());
    prowlerBuild.addToRolePolicy(new statement.Tag().allow().toGetTagKeys());
    prowlerBuild.addToRolePolicy(new statement.Lambda().allow().toGetFunction());
    prowlerBuild.addToRolePolicy(new statement.Glue().allow().toSearchTables().toGetConnections());
    prowlerBuild.addToRolePolicy(new statement.Apigateway().allow().toGET());
    prowlerBuild.addToRolePolicy(new iam.PolicyStatement({ actions: ['support:Describe*'], resources: ['*'] }));

    reportBucket.grantPut(prowlerBuild);

    const myRole = new iam.Role(this, 'MyRole', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });

    const prowlerStartBuildLambda = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.PYTHON_3_6,
      timeout: Duration.seconds(120),
      handler: 'index.lambda_handler',
      code: lambda.Code.fromInline(`import boto3
import cfnresponse
from botocore.exceptions import ClientError
def lambda_handler(event,context):
  props = event['ResourceProperties']
  codebuild_client = boto3.client('codebuild')
  if (event['RequestType'] == 'Create' or event['RequestType'] == 'Update'):
    try:
        response = codebuild_client.start_build(projectName=props['Build'])
        print(response)
        print("Respond: SUCCESS")
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
    except Exception as ex:
        print(ex.response['Error']['Message'])
        cfnresponse.send(event, context, cfnresponse.FAILED, ex.response)
      `),
    });

    prowlerStartBuildLambda.addToRolePolicy(new statement.Codebuild().allow().toStartBuild()); // onResource project ...

    const myProvider = new cr.Provider(this, 'MyProvider', {
      onEventHandler: prowlerStartBuildLambda,
      logRetention: this.logsRetentionInDays,
      role: myRole,
    });

    new CustomResource(this, 'Resource1', {
      serviceToken: myProvider.serviceToken,
      properties: {
        Build: prowlerBuild.projectName,
        RERUN_PROWLER: Boolean(this.node.tryGetContext('reRunProwler')) ? Date.now().toString() : '',
      },
    });

    if (this.enableScheduler) {
      const prowlerSchedulerLambda = new lambda.Function(this, 'ScheduleLambda', {
        runtime: lambda.Runtime.PYTHON_3_6,
        timeout: Duration.seconds(120),
        handler: 'index.lambda_handler',
        environment: {
          buildName: prowlerBuild.projectName,
        },
        code: lambda.Code.fromInline(`import boto3
        import os
        def lambda_handler(event,context):
          codebuild_client = boto3.client('codebuild')
          print("Running Prowler scheduled!: " + os.environ['buildName'])
          project_name = os.environ['buildName']
          response = codebuild_client.start_build(projectName=project_name)
          print(response)
          print("Respond: SUCCESS")
        `),
      });

      new events.Rule(this, 'Rule', {
        description: 'A schedule for the Lambda function that triggers Prowler in CodeBuild.',
        targets: [new targets.LambdaFunction(prowlerSchedulerLambda)],
        schedule: events.Schedule.expression(this.prowlerScheduler || ''),
      });
    }
  }
}