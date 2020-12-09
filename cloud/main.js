Parse.Cloud.define('hello', function(req, res) 
{
  return 'Hello World!';
});

Parse.Cloud.define('validate', async(request) =>
{
	var clientIP = request.headers['x-forwarded-for'];
	if (clientIP == "109.12.81.168")
		return false;
	else
		return true;
});
