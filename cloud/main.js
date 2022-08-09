
// Banned player ips
var m_bannedIPs = [ "80.139.85.62", "87.156.143.217" ];

// Test method
Parse.Cloud.define('hello', function(req, res) 
{
  return 'Hello World!';
});

// Validate that a player is allow to access the server
Parse.Cloud.define('validate', async(request) =>
{
	var clientIP = request.headers['x-forwarded-for'];
	if (m_bannedIPs.indexOf(clientIP) >= 0)
		return false;
	else
		return true;
});

// Validate that a player is allowed to access the server and store some analytics data
Parse.Cloud.define('validateUser', async(request) =>
{
	var clientIP = request.headers['x-forwarded-for'];
	var currentDate = new Date();
	var username = request.params.username;
	var banned = (m_bannedIPs.indexOf(clientIP) >= 0);
	var playername = request.params.playername;
	var version = request.params.version;
	var purchased = request.params.purchased;
	var devicetype = request.params.devicetype;
	var devicename = request.params.devicename;
	var devicemodel = request.params.devicemodel;
	
	const UserHistory = Parse.Object.extend("UserHistory");
	const query = new Parse.Query(UserHistory);
	query.equalTo("username", username);
	const result = await query.first();
	if (result != null)
	{
		banned = result.get("banned");
		result.set("username", username);
		result.set("playername", playername);
		result.set("lastlogin", currentDate);
		result.set("ip", clientIP);
		result.set("version", version);
		result.set("purchased", purchased);
		result.set("devicetype", devicetype);
		result.set("devicename", devicename);
		result.set("devicemodel", devicemodel);
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
		uhistory.set("purchased", purchased);
		uhistory.set("devicetype", devicetype);
		uhistory.set("devicename", devicename);
		uhistory.set("devicemodel", devicemodel);
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

// Get the server time
Parse.Cloud.define('getTime', async (request) =>
{
	let d = new Date();
	let time = d.getTime();

	return time;
});
