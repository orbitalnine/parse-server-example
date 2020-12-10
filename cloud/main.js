
var m_bannedIPs = ["109.12.81.168"];

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
	
	const UserHistory = Parse.Object.extend("UserHistory");
	const query = new Parse.Query(UserHistory);
	query.equalTo("username", request.params.username);
	const result = await query.first();
	if (result != null)
	{
		result.set("lastlogin", currentDate);
		result.set("banned", banned);
		result.set("ip", clientIP);
		await result.save().then((result) => 
		{
			console.log("User history updated.");
		}, (error) => 
		{
			console.error("Error updating user history: " + error);
		});
	}
	else
	{
		const uhistory = new UserHistory();
		uhistory.set("username", request.params.username);
		uhistory.set("playername", request.params.playername);
		uhistory.set("lastlogin", currentDate);
		uhistory.set("ip", clientIP);
		uhistory.set("banned", banned);
		await uhistory.save().then((uhistory) => 
		{
			console.log("User history created.");
		}, (error) => 
		{
			console.error("Error creating user history: " + error);
		});
	}
	
	if (banned)
		return false;
	else
		return true;
},{
	fields : ['username', 'playername']
});
