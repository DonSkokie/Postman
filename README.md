# Postman

This is a collection of requests and pre-request to use in Postman collections. 
I got tired of figuring something out and then data purging all that knowledge and having to figure it out again.
This is mostly due to struggles with requests to different AWS services.

All of these requests and pre-requests will require some environment and globals variables are set. 

AWS credentials will be needed on some requests and pre-requests. (Access Key, Secret Key, Session Token)

Environment variables will all be lowercase and comma seperated. Example: <span style="color:orange">{{cognito_username}}</span>

Globals variables will all be uppercase and comma seperated. Example: <span style="color:orange">{{AWS_USER_POOLS_CLIENT}}</span> 

Most script variables will be comma seperated for ease of reading. 


# Notes / Sources / Thank You:

* AWS Signing to get Pre-Request to work.
* * https://virtualbrakeman.wordpress.com/2017/02/13/aws-rest-api-authentication-using-node-js/
