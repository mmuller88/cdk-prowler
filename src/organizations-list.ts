
import * as core from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as AWS from 'aws-sdk';

export interface OrganizationsListProps {
}

export class OrganizationsList extends core.Construct {
  readonly ids: string[]
  constructor(scope: core.Construct, id: string, props: OrganizationsListProps) {
    super(scope, id);
    props;

    let ou = new cr.AwsCustomResource(this, 'OUCustomResource', {
      onCreate: {
        service: 'Organizations',
        action: 'listAccounts', //@see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listAccounts-property
        // physicalResourceId: cr.PhysicalResourceId.fromResponse('OrganizationalUnit.Id'),
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
        region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
        // parameters: {}
      },
      onUpdate: {
        service: 'Organizations',
        action: 'listAccounts',
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
        region: 'us-east-1',
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
    let accounts = JSON.parse(ou.getResponseField('Accounts')) as AWS.Organizations.Accounts;
    this.ids = accounts.map(account => account.Id || '');
  }
}