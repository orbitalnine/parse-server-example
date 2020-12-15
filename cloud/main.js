
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
	var username = request.params.username;
	var playername = request.params.playername;
	var version = request.params.version;
	
	const UserHistory = Parse.Object.extend("UserHistory");
	const query = new Parse.Query(UserHistory);
	query.equalTo("username", username);
	const result = await query.first();
	if (result != null)
	{
		result.set("username", username);
		result.set("playername", playername);
		result.set("lastlogin", currentDate);
		result.set("banned", banned);
		result.set("ip", clientIP);
		result.set("version", version);
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
		uhistory.set("username", username);
		uhistory.set("playername", playername);
		uhistory.set("lastlogin", currentDate);
		uhistory.set("banned", banned);
		uhistory.set("ip", clientIP);
		uhistory.set("version", version);
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
	fields : ['username', 'playername', 'version']
});
