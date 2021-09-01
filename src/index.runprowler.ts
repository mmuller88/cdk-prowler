// eslint-disable-next-line import/no-extraneous-dependencies
import * as lambda from 'aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
const codebuild = new AWS.CodeBuild();
const organizations = new AWS.Organizations();

const USE_ORGANIZATION = process.env.USE_ORGANIZATION || 'false';

export async function handler(event: lambda.CloudFormationCustomResourceEvent, context: lambda.Context) {
  // exports.handler = async (event/*: lambda.DynamoDBStreamEvent*/) => {
  console.debug(`event: ${JSON.stringify(event)}`);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {

    let ids: string[] = [];
    // Add additional accounts via AWS Organizations
    if (USE_ORGANIZATION === 'true') {
      let listAccounts = await organizations.listAccounts().promise();
      console.debug(`listAccounts: ${JSON.stringify(listAccounts)}`);
      ids = listAccounts.Accounts?.map<string>(account => account.Id?.toString() || '') || [];
    }

    // merge used account with organizations accounts and de duplicate
    let accounts = [...new Set([JSON.stringify(context.invokedFunctionArn).split(':')[4], ...ids])];
    console.debug(`accounts: ${JSON.stringify(accounts)}`);

    for (let account of accounts) {
      let params: AWS.CodeBuild.StartBuildInput = {
        projectName: event.ResourceProperties.Build,
        environmentVariablesOverride: [{ name: 'ACCOUNT_ID', value: account }],
      };
      console.debug(`params: ${JSON.stringify(params)}`);
      let response = await codebuild.startBuild(params).promise();
      console.debug(`response: ${JSON.stringify(response)}`);
    }

  }
};