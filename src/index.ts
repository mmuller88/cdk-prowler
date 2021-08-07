import { Stack, aws_s3 as s3, RemovalPolicy } from 'aws-cdk-lib';
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
  readonly logsRetentionInDays: LogsRetentionInDays;

  /**
   * Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports. Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"
   * @default 'no options'
   */
  readonly prowlerOptions: string;

  /**
   * The time when Prowler will run in cron format. Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.
   * @default 'cron(0 22 * * ? *)'
   */
  readonly prowlerScheduler: string;
}

export enum LogsRetentionInDays {
  _1 = 1,
  _3 = 3,
  _5 = 5,
}
export class ProwlerAudit extends Construct {
  constructor(parent: Stack, id: string) {
    super(parent, id);

    new s3.Bucket(this, 'ReportBucket', {
      bucketName: `${'123456'}-prowler-reports`,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}