# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### ProwlerAudit <a name="cdk-prowler.ProwlerAudit"></a>

Creates a CodeBuild project to audit an AWS account with Prowler and stores the html report in a S3 bucket.

This will run onece at the beginning and on a schedule afterwards. Partial contribution from https://github.com/stevecjones

#### Initializers <a name="cdk-prowler.ProwlerAudit.Initializer"></a>

```typescript
import { ProwlerAudit } from 'cdk-prowler'

new ProwlerAudit(parent: Stack, id: string, props?: ProwlerAuditProps)
```

##### `parent`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.parameter.parent"></a>

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---

##### `id`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAudit.parameter.props"></a>

- *Type:* [`cdk-prowler.ProwlerAuditProps`](#cdk-prowler.ProwlerAuditProps)

---



#### Properties <a name="Properties"></a>

##### `codebuildProject`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.codebuildProject"></a>

```typescript
public readonly codebuildProject: Project;
```

- *Type:* [`@aws-cdk/aws-codebuild.Project`](#@aws-cdk/aws-codebuild.Project)

---

##### `enableScheduler`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.enableScheduler"></a>

```typescript
public readonly enableScheduler: boolean;
```

- *Type:* `boolean`

---

##### `logsRetentionInDays`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.logsRetentionInDays"></a>

```typescript
public readonly logsRetentionInDays: RetentionDays;
```

- *Type:* [`@aws-cdk/aws-logs.RetentionDays`](#@aws-cdk/aws-logs.RetentionDays)

---

##### `prowlerOptions`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerOptions"></a>

```typescript
public readonly prowlerOptions: string;
```

- *Type:* `string`

---

##### `prowlerScheduler`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerScheduler"></a>

```typescript
public readonly prowlerScheduler: string;
```

- *Type:* `string`

---

##### `prowlerVersion`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerVersion"></a>

```typescript
public readonly prowlerVersion: string;
```

- *Type:* `string`

---

##### `serviceName`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* `string`

---


## Structs <a name="Structs"></a>

### ProwlerAuditProps <a name="cdk-prowler.ProwlerAuditProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ProwlerAuditProps } from 'cdk-prowler'

const prowlerAuditProps: ProwlerAuditProps = { ... }
```

##### `additionalS3CopyArgs`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.additionalS3CopyArgs"></a>

```typescript
public readonly additionalS3CopyArgs: string;
```

- *Type:* `string`

An optional parameter to add to the S3 bucket copy command.

---

##### `allowlist`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.allowlist"></a>

```typescript
public readonly allowlist: Asset;
```

- *Type:* [`@aws-cdk/aws-s3-assets.Asset`](#@aws-cdk/aws-s3-assets.Asset)
- *Default:* undefined

An Prowler-specific Allowlist file.

If a value is provided then this is passed to Prowler on runs using the '-w' flag.
If no value is provided, the -w parameter is not used. If you provide an asset that is zipped, it must contain
an 'allowlist.txt' file which will be passed to Prowler.

---

##### `enableScheduler`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.enableScheduler"></a>

```typescript
public readonly enableScheduler: boolean;
```

- *Type:* `boolean`
- *Default:* false

enables the scheduler for running prowler periodically.

Together with prowlerScheduler.

---

##### `logsRetentionInDays`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.logsRetentionInDays"></a>

```typescript
public readonly logsRetentionInDays: RetentionDays;
```

- *Type:* [`@aws-cdk/aws-logs.RetentionDays`](#@aws-cdk/aws-logs.RetentionDays)
- *Default:* : 3

Specifies the number of days you want to retain CodeBuild run log events in the specified log group.

Junit reports are kept for 30 days, HTML reports in S3 are not deleted

---

##### `prowlerOptions`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerOptions"></a>

```typescript
public readonly prowlerOptions: string;
```

- *Type:* `string`
- *Default:* '-M text,junit-xml,html,csv,json'

Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports.

Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"

---

##### `prowlerScheduler`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerScheduler"></a>

```typescript
public readonly prowlerScheduler: string;
```

- *Type:* `string`
- *Default:* 'cron(0 22 * * ? *)'

The time when Prowler will run in cron format.

Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.

---

##### `prowlerVersion`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerVersion"></a>

```typescript
public readonly prowlerVersion: string;
```

- *Type:* `string`
- *Default:* 2.6.0

Specifies the concrete Prowler version.

---

##### `reportBucket`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.reportBucket"></a>

```typescript
public readonly reportBucket: IBucket;
```

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

An optional S3 bucket to store the Prowler reports.

---

##### `reportBucketPrefix`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.reportBucketPrefix"></a>

```typescript
public readonly reportBucketPrefix: string;
```

- *Type:* `string`

An optional prefix for the report bucket objects.

---

##### `serviceName`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* `string`
- *Default:* : prowler

Specifies the service name used within component naming.

---



