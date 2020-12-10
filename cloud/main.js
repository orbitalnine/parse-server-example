
var m_bannedIPs = ["109.12.81.168", "70.36.60.80"];

Parse.Cloud.define('hello', function(req, res) 
{
  return 'Hello World!';
});

Parse.Cloud.define('validate', async(request) =>
{
	var clientIP = request.headers['x-forwarded-for'];
	if (m_bannedIPs.indexOf(clientIP) >= 0)
		return false;
	else
		return true;
});

Parse.Cloud.define('validateUser', async(request) =>
{
	var clientIP = request.headers['x-forwarded-for'];
	var currentDate = new Date();
	var banned = (m_bannedIPs.indexOf(clientIP) >= 0);
	
	const User = Parse.Object.extend("User");
	const user = new User();
	user.set("username", request.params.username);
	user.set("userid", request.params.userid);
	user.set("lastlogin", currentDate);
	user.set("banned", banned);
	user.save();
	
	if (banned)
		return false;
	else
		return true;
},{
	fields : ['username', 'userid']
});
