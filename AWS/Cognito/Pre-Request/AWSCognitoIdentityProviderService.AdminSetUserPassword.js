var access_key = pm.globals.get("AWS_ACCESS_KEY");
var secret_key = pm.globals.get("AWS_SECRET_KEY");
var session_token = pm.globals.get("AWS_SESSION_TOKEN");
var cognito_password = pm.environment.get("cognito_password");
var cognito_username = pm.environment.get("cognito_username");
var user_pool_id = pm.globals.get("AWS_USER_POOLS_ID");
var region = "us-east-1";
var url = "cognito-idp." + pm.globals.get("AWS_REGION") + ".amazonaws.com";
var service = "cognito-idp";
var method = "POST";
var path = "/";

// Create X-Amz-Date and Other Date
var x_amz_date = get_amz_date(new Date().toISOString());
var auth_date = x_amz_date.split("T")[0];


function get_amz_date(date_string) {
    var chars = [":", "-"];
    for (var i = 0; i < chars.length; i++) {
        while (date_string.indexOf(chars[i]) != -1) {
            date_string = date_string.replace(chars[i], "");
        }
    }
    date_string = date_string.split(".")[0] + "Z";
    return date_string;
}

// Payload
var payload = '{\n   \"Password\": \"' + cognito_password + '\",\n   \"Permanent\": true,\n   \"Username\": \"' + cognito_username + '\",\n   \"UserPoolId\": \"' + user_pool_id + '\"\n}';


// Payload SHA256 hash value
var hashed_payload = CryptoJS.SHA256(payload).toString();


// Canonical Request
var canonical_request = method + '\n' +
    path + '\n' +
    '\n' +
    'host:' + url + '\n' +
    'x-amz-content-sha256:' + hashed_payload + '\n' +
    'x-amz-date:' + x_amz_date + '\n' +
    '\n' +
    'host;x-amz-content-sha256;x-amz-date' + '\n' +
    hashed_payload;

// Canonical Request Hash
var canonical_request_hash = CryptoJS.SHA256(canonical_request).toString();

// String-to-Sign
var string_to_sign = 'AWS4-HMAC-SHA256\n' +
    x_amz_date + '\n' +
    auth_date + '/' + region + '/' + service + '/aws4_request\n' +
    canonical_request_hash;

// Signature Key
function getSignatureKey(CryptoJS, key, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
}

// Signing Key
var signing_key = getSignatureKey(CryptoJS, secret_key, auth_date, region, service);

// String-to-Sign
var auth_key = CryptoJS.HmacSHA256(string_to_sign, signing_key);

// Authorization Header
var auth_string = 'AWS4-HMAC-SHA256 ' +
    'Credential=' +
    access_key + '/' +
    auth_date + '/' +
    region + '/' +
    service + '/aws4_request,' +
    'SignedHeaders=host;x-amz-content-sha256;x-amz-date,' +
    'Signature=' + auth_key;

// Headers
headers = {
    'Authorization': auth_string,
    'content-type': 'application/x-amz-json-1.1',
    'X-Amz-Content-Sha256': hashed_payload,
    'X-Amz-Date': x_amz_date,
    'X-Amz-Security-Token': session_token,
    'x-amz-target': 'AWSCognitoIdentityProviderService.AdminSetUserPassword'
};

// Send Request
pm.sendRequest({
    url: "https://cognito-idp." + pm.globals.get("AWS_REGION") + ".amazonaws.com/",
    method: 'POST',
    header: headers,
    body: {
        mode: 'raw',
        raw: payload
    }, function(error, response) {
        console.log(response.json());
    }
});