
var m_bannedIPs = [ "80.139.85.62", "87.156.143.217" ];
var m_bannedUsername = [ "g_a_1060033833193007731", "g_a_8306138703989681063", "g_a_7284003036751094310" ];

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
	var username = request.params.username;
	var banned = (m_bannedIPs.indexOf(clientIP) >= 0) || ((m_bannedUsername.indexOf(username) >= 0));
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
		result.set("username", username);
		result.set("playername", playername);
		result.set("lastlogin", currentDate);
		result.set("banned", banned);
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
