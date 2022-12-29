var uuid = require('uuid');
var cognito_username = uuid.v4();
var environment = pm.globals.get("ENVIRONMENT").toLowerCase();
var email = "test_user" + "@gmail.com";

pm.environment.set("cognito_username", cognito_username);
pm.environment.set("cognito_email", email);
pm.environment.set("cognito_first_name", pm.variables.replaceIn('{{$randomFirstName}}'));
pm.environment.set("cognito_last_name", pm.variables.replaceIn('{{$randomLastName}}'));

pm.sendRequest({
  url: "https://cognito-idp." + pm.globals.get("AWS_REGION") + ".amazonaws.com/",
  method: 'POST',
  header: {
    'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
    'Content-Type': 'application/x-amz-json-1.1'
  },
  body: {
    mode: 'raw',
    raw: JSON.stringify({
      "ClientId": pm.globals.get("AWS_USER_POOLS_CLIENT"),
      "Username": pm.environment.get("cognito_username"),
      "Password": pm.environment.get("cognito_password"),
      "UserAttributes": [
        {
          "Name": "family_name",
          "Value": pm.environment.get("cognito_last_name")
        },
        {
          "Name": "email",
          "Value": pm.environment.get("cognito_email")
        },
        {
          "Name": "name",
          "Value": pm.environment.get("cognito_first_name")
        }
      ],
      "ValidationData": null,
      "ClientMetadata": {
        "store_domain": pm.globals.get("STORE_DOMAIN")
      },
    })
  }, function(error, response) {
    console.log(response.json());
  }
});
