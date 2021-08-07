import { Stack, Duration, RemovalPolicy, CustomResource } from 'aws-cdk-lib';
// eslint-disable-next-line no-duplicate-imports
import { aws_logs as logs, aws_s3 as s3, aws_codebuild as codebuild, aws_lambda as lambda, custom_resources as cr } from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface ProwlerAuditProps {
  /**
   * Specifies the service name used within component naming
   * @default: prowler
   */
  readonly serviceName: string;

  /**
   * Specifies the number of days you want to retain CodeBuild run log events in the specified log group. Junit reports are kept for 30 days, HTML reports in S3 are not deleted
   * @default: 3
   */
  readonly logsRetentionInDays: logs.RetentionDays;

  /**
   * Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports. Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"
   * @default 'no options'
   */
  readonly prowlerOptions?: string;

  /**
   * The time when Prowler will run in cron format. Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.
   * @default 'cron(0 22 * * ? *)'
   */
  readonly prowlerScheduler: string;
}

/**
 * Creates a CodeBuild project to audit an AWS account with Prowler and stores the html report in a S3 bucket. This will run onece at the beginning and on a schedule afterwards. Partial contribution from https://github.com/stevecjones
 */
export class ProwlerAudit extends Construct {
  constructor(parent: Stack, id: string, props: ProwlerAuditProps = { serviceName: 'prowler', logsRetentionInDays: logs.RetentionDays.THREE_DAYS, prowlerScheduler: 'cron(0 22 * * ? *)' }) {
    super(parent, id);

    const reportBucket = new s3.Bucket(this, 'ReportBucket', {
      //bucketName: `${'123456'}-prowler-reports`,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new codebuild.Project(this, 'Codebuild', {
      description: 'Run Prowler assessment',
      timeout: Duration.hours(5),
      environment: {
        environmentVariables: {
          BUCKET_REPORT: { value: reportBucket.bucketArn || '' },
          PROWLER_OPTIONS: { value: props.prowlerOptions },
        },
        buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-x86_64-standard:3.0'),
        // computeType: codebuild.ComputeType.SMALL,
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
              'git clone https://github.com/toniblyx/prowler',
            ],
          },
          build: {
            commands: [
              'echo "Running Prowler as ./prowler $PROWLER_OPTIONS"',
              'cd prowler',
              './prowler $PROWLER_OPTIONS',
            ],
          },
          post_build: {
            command: [
              'echo "Uploading reports to S3..." ',
              'aws s3 cp --sse AES256 output/ s3://$BUCKET_REPORT/ --recursive',
              'echo "Done!"',
            ],
          },
        },
        reports: {
          prowler: {
            'files': ['**/*'],
            'base-directory': 'prowler/junit-reports',
            'file-format': 'JunitXml',
          },
        },
      }),
    });

    const prowlerBuild = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.PYTHON_3_6,
      timeout: Duration.seconds(120),
      handler: 'index.lambda_handler',
      code: lambda.Code.fromInline(`import boto3
import cfnresponse
from botocore.exceptions import ClientError
def lambda_handler(event,context):
  props = event['ResourceProperties']
  codebuil_client = boto3.client('codebuild')
  if (event['RequestType'] == 'Create' or event['RequestType'] == 'Update'):
    try:
        response = codebuil_client.start_build(projectName=props['Build'])
        print(response)
        print("Respond: SUCCESS")
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
    except Exception as ex:
        print(ex.response['Error']['Message'])
        cfnresponse.send(event, context, cfnresponse.FAILED, ex.response)
      `),
    });

    const myProvider = new cr.Provider(this, 'MyProvider', {
      onEventHandler: prowlerBuild,
      logRetention: props.logsRetentionInDays,
    });

    new CustomResource(this, 'Resource1', { serviceToken: myProvider.serviceToken });
  }
}