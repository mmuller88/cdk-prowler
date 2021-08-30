// eslint-disable-next-line import/no-extraneous-dependencies
import * as lambda from 'aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
const codebuild = new AWS.CodeBuild();

export async function handler(event: lambda.CloudFormationCustomResourceEvent) {
  // exports.handler = async (event/*: lambda.DynamoDBStreamEvent*/) => {
  console.debug(`event: ${JSON.stringify(event)}`);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    // const accounts = ['981237193288'];

    let params: AWS.CodeBuild.StartBuildInput = {
      projectName: event.ResourceProperties.Build,
      environmentVariablesOverride: [{ name: 'ACCOUNT_ID', value: '981237193288' }],
    };
    console.debug(`params: ${JSON.stringify(params)}`);
    let response = await codebuild.startBuild(params).promise();
    console.debug(`response: ${JSON.stringify(response)}`);
  }
};