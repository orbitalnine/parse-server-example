Parse.Cloud.define('hello', function(req, res) 
{
  return 'Hello World!';
});

Parse.Cloud.define('validate', async(request) =>
{
	var bannedIPs = ["109.12.81.168", "70.36.60.80"];
	
	var clientIP = request.headers['x-forwarded-for'];
	if (bannedIPs.indexOf(clientIP) >= 0)
		return false;
	else
		return true;
});
