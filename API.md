# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="constructs"></a>

### ProwlerAudit <a name="cdk-prowler.ProwlerAudit" id="cdkprowlerprowleraudit"></a>

Creates a CodeBuild project to audit an AWS account with Prowler and stores the html report in a S3 bucket.

This will run onece at the beginning and on a schedule afterwards. Partial contribution from https://github.com/stevecjones

#### Initializers <a name="cdk-prowler.ProwlerAudit.Initializer" id="cdkprowlerprowlerauditinitializer"></a>

```typescript
import { ProwlerAudit } from 'cdk-prowler'

new ProwlerAudit(parent: Stack, id: string, props?: ProwlerAuditProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`parent`](#cdkprowlerprowlerauditparameterparent)<span title="Required">*</span> | [`aws-cdk-lib.Stack`](#aws-cdk-lib.Stack) | *No description.* |
| [`id`](#cdkprowlerprowlerauditparameterid)<span title="Required">*</span> | `string` | *No description.* |
| [`props`](#cdkprowlerprowlerauditparameterprops) | [`cdk-prowler.ProwlerAuditProps`](#cdk-prowler.ProwlerAuditProps) | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.parameter.parent" id="cdkprowlerprowlerauditparameterparent"></a>

- *Type:* [`aws-cdk-lib.Stack`](#aws-cdk-lib.Stack)

---

##### `id`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.parameter.id" id="cdkprowlerprowlerauditparameterid"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAudit.parameter.props" id="cdkprowlerprowlerauditparameterprops"></a>

- *Type:* [`cdk-prowler.ProwlerAuditProps`](#cdk-prowler.ProwlerAuditProps)

---



#### Properties <a name="Properties" id="properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`codebuildProject`](#cdkprowlerprowlerauditpropertycodebuildproject)<span title="Required">*</span> | [`aws-cdk-lib.aws_codebuild.Project`](#aws-cdk-lib.aws_codebuild.Project) | *No description.* |
| [`enableScheduler`](#cdkprowlerprowlerauditpropertyenablescheduler)<span title="Required">*</span> | `boolean` | *No description.* |
| [`logsRetentionInDays`](#cdkprowlerprowlerauditpropertylogsretentionindays)<span title="Required">*</span> | [`aws-cdk-lib.aws_logs.RetentionDays`](#aws-cdk-lib.aws_logs.RetentionDays) | *No description.* |
| [`prowlerOptions`](#cdkprowlerprowlerauditpropertyprowleroptions)<span title="Required">*</span> | `string` | *No description.* |
| [`prowlerScheduler`](#cdkprowlerprowlerauditpropertyprowlerscheduler)<span title="Required">*</span> | `string` | *No description.* |
| [`prowlerVersion`](#cdkprowlerprowlerauditpropertyprowlerversion)<span title="Required">*</span> | `string` | *No description.* |
| [`serviceName`](#cdkprowlerprowlerauditpropertyservicename)<span title="Required">*</span> | `string` | *No description.* |

---

##### `codebuildProject`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.codebuildProject" id="cdkprowlerprowlerauditpropertycodebuildproject"></a>

```typescript
public readonly codebuildProject: Project;
```

- *Type:* [`aws-cdk-lib.aws_codebuild.Project`](#aws-cdk-lib.aws_codebuild.Project)

---

##### `enableScheduler`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.enableScheduler" id="cdkprowlerprowlerauditpropertyenablescheduler"></a>

```typescript
public readonly enableScheduler: boolean;
```

- *Type:* `boolean`

---

##### `logsRetentionInDays`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.logsRetentionInDays" id="cdkprowlerprowlerauditpropertylogsretentionindays"></a>

```typescript
public readonly logsRetentionInDays: RetentionDays;
```

- *Type:* [`aws-cdk-lib.aws_logs.RetentionDays`](#aws-cdk-lib.aws_logs.RetentionDays)

---

##### `prowlerOptions`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerOptions" id="cdkprowlerprowlerauditpropertyprowleroptions"></a>

```typescript
public readonly prowlerOptions: string;
```

- *Type:* `string`

---

##### `prowlerScheduler`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerScheduler" id="cdkprowlerprowlerauditpropertyprowlerscheduler"></a>

```typescript
public readonly prowlerScheduler: string;
```

- *Type:* `string`

---

##### `prowlerVersion`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.prowlerVersion" id="cdkprowlerprowlerauditpropertyprowlerversion"></a>

```typescript
public readonly prowlerVersion: string;
```

- *Type:* `string`

---

##### `serviceName`<sup>Required</sup> <a name="cdk-prowler.ProwlerAudit.property.serviceName" id="cdkprowlerprowlerauditpropertyservicename"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* `string`

---


## Structs <a name="Structs" id="structs"></a>

### ProwlerAuditProps <a name="cdk-prowler.ProwlerAuditProps" id="cdkprowlerprowlerauditprops"></a>

#### Initializer <a name="[object Object].Initializer" id="object-objectinitializer"></a>

```typescript
import { ProwlerAuditProps } from 'cdk-prowler'

const prowlerAuditProps: ProwlerAuditProps = { ... }
```

#### Properties <a name="Properties" id="properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`additionalS3CopyArgs`](#cdkprowlerprowlerauditpropspropertyadditionals3copyargs) | `string` | An optional parameter to add to the S3 bucket copy command. |
| [`allowlist`](#cdkprowlerprowlerauditpropspropertyallowlist) | [`aws-cdk-lib.aws_s3_assets.Asset`](#aws-cdk-lib.aws_s3_assets.Asset) | An Prowler-specific Allowlist file. |
| [`enableScheduler`](#cdkprowlerprowlerauditpropspropertyenablescheduler) | `boolean` | enables the scheduler for running prowler periodically. |
| [`logsRetentionInDays`](#cdkprowlerprowlerauditpropspropertylogsretentionindays) | [`aws-cdk-lib.aws_logs.RetentionDays`](#aws-cdk-lib.aws_logs.RetentionDays) | Specifies the number of days you want to retain CodeBuild run log events in the specified log group. |
| [`prowlerOptions`](#cdkprowlerprowlerauditpropspropertyprowleroptions) | `string` | Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports. |
| [`prowlerScheduler`](#cdkprowlerprowlerauditpropspropertyprowlerscheduler) | `string` | The time when Prowler will run in cron format. |
| [`prowlerVersion`](#cdkprowlerprowlerauditpropspropertyprowlerversion) | `string` | Specifies the concrete Prowler version. |
| [`reportBucket`](#cdkprowlerprowlerauditpropspropertyreportbucket) | [`aws-cdk-lib.aws_s3.IBucket`](#aws-cdk-lib.aws_s3.IBucket) | An optional S3 bucket to store the Prowler reports. |
| [`reportBucketPrefix`](#cdkprowlerprowlerauditpropspropertyreportbucketprefix) | `string` | An optional prefix for the report bucket objects. |
| [`serviceName`](#cdkprowlerprowlerauditpropspropertyservicename) | `string` | Specifies the service name used within component naming. |

---

##### `additionalS3CopyArgs`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.additionalS3CopyArgs" id="cdkprowlerprowlerauditpropspropertyadditionals3copyargs"></a>

```typescript
public readonly additionalS3CopyArgs: string;
```

- *Type:* `string`

An optional parameter to add to the S3 bucket copy command.

---

##### `allowlist`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.allowlist" id="cdkprowlerprowlerauditpropspropertyallowlist"></a>

```typescript
public readonly allowlist: Asset;
```

- *Type:* [`aws-cdk-lib.aws_s3_assets.Asset`](#aws-cdk-lib.aws_s3_assets.Asset)
- *Default:* undefined

An Prowler-specific Allowlist file.

If a value is provided then this is passed to Prowler on runs using the '-w' flag. If no value is provided, the -w parameter is not used. If you provide an asset that is zipped, it must contain an 'allowlist.txt' file which will be passed to Prowler.

---

##### `enableScheduler`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.enableScheduler" id="cdkprowlerprowlerauditpropspropertyenablescheduler"></a>

```typescript
public readonly enableScheduler: boolean;
```

- *Type:* `boolean`
- *Default:* false

enables the scheduler for running prowler periodically.

Together with prowlerScheduler.

---

##### `logsRetentionInDays`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.logsRetentionInDays" id="cdkprowlerprowlerauditpropspropertylogsretentionindays"></a>

```typescript
public readonly logsRetentionInDays: RetentionDays;
```

- *Type:* [`aws-cdk-lib.aws_logs.RetentionDays`](#aws-cdk-lib.aws_logs.RetentionDays)
- *Default:* : 3

Specifies the number of days you want to retain CodeBuild run log events in the specified log group.

Junit reports are kept for 30 days, HTML reports in S3 are not deleted

---

##### `prowlerOptions`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerOptions" id="cdkprowlerprowlerauditpropspropertyprowleroptions"></a>

```typescript
public readonly prowlerOptions: string;
```

- *Type:* `string`
- *Default:* '-M text,junit-xml,html,csv,json'

Options to pass to Prowler command, make sure at least -M junit-xml is used for CodeBuild reports.

Use -r for the region to send API queries, -f to filter only one region, -M output formats, -c for comma separated checks, for all checks do not use -c or -g, for more options see -h. For a complete assessment use  "-M text,junit-xml,html,csv,json", for SecurityHub integration use "-r region -f region -M text,junit-xml,html,csv,json,json-asff -S -q"

---

##### `prowlerScheduler`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerScheduler" id="cdkprowlerprowlerauditpropspropertyprowlerscheduler"></a>

```typescript
public readonly prowlerScheduler: string;
```

- *Type:* `string`
- *Default:* 'cron(0 22 * * ? *)'

The time when Prowler will run in cron format.

Default is daily at 22:00h or 10PM 'cron(0 22 * * ? *)', for every 5 hours also works 'rate(5 hours)'. More info here https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.

---

##### `prowlerVersion`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.prowlerVersion" id="cdkprowlerprowlerauditpropspropertyprowlerversion"></a>

```typescript
public readonly prowlerVersion: string;
```

- *Type:* `string`
- *Default:* 2.6.0

Specifies the concrete Prowler version.

---

##### `reportBucket`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.reportBucket" id="cdkprowlerprowlerauditpropspropertyreportbucket"></a>

```typescript
public readonly reportBucket: IBucket;
```

- *Type:* [`aws-cdk-lib.aws_s3.IBucket`](#aws-cdk-lib.aws_s3.IBucket)

An optional S3 bucket to store the Prowler reports.

---

##### `reportBucketPrefix`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.reportBucketPrefix" id="cdkprowlerprowlerauditpropspropertyreportbucketprefix"></a>

```typescript
public readonly reportBucketPrefix: string;
```

- *Type:* `string`

An optional prefix for the report bucket objects.

---

##### `serviceName`<sup>Optional</sup> <a name="cdk-prowler.ProwlerAuditProps.property.serviceName" id="cdkprowlerprowlerauditpropspropertyservicename"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* `string`
- *Default:* : prowler

Specifies the service name used within component naming.

---



