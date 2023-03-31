export enum errorMessages
{
	MISSING = "Missing code or state parameter !",
	DIFFERENT = "State received differ from state generated by the server !",
	INVALIDARG = "The value for one of the fields in the request was invalid !",
	NONAME = "Parameter name is missing !",
	INVALIDIMAGE = "Avatar must be to format png or jpeg and be less than 8 mb!",
	CANTSAVE = "Error while saving file !",
	ALREADYTAKEN = "This user name is already taken !",
	ALREADYREGISTER = "You have already set your name !",
	CODEINVALID = "The code sent has already been used !",
	MISSINGNAME = "No name specified in the request !",
	NOTREGISTERED = "Socket is not registered !",
	INVALIDNAME = "The user requested dont exist !",
	YOUAREIGNORED = "This user blocked you !",
	ALREADYFRIEND = "This user and you are already friends !",
	ALREADYIGNORED = "You already ignored this user !",
	NOREQUEST = "This user didn't asked to be your friend !",
	NOTFRIEND = "This user and you arn't friend !",
	NOTIGNORED = "You dont ignore this user !",
	REQUESTTOIGNORE = "You cant send a friend request to an user you blocked !",
	MESSAGETOIGNORE = "You cant send a message to an user you blocked !",
	ALREADYREQUESTED = "You already sent a friend request to this user !",
	CHANNELALREADYEXIST = "This channel name is already used !",
	PRIVATEORPASSWORD = "You cant specify a password when creating a private channel !",
	CHANNELDONTEXIST = "The channel specified dont exist !",
	ALREADYADMIN = "This user is already an adminstrator of this channel !",
	NOTANADMINISTRATOR = "This user is not an administrator of this channel !",
	NOTINTHISCHANNEL = "This user is not in this channel !",
	ALREADYINCHANNEL = "You are already in this channel !",
	ALREADYINVITED = "This user is already invited in this channel !",
	NOTJOINED = "You are not in this channel !",
	INCORRECTPASSWORD = "The password provided dont match !",
	NOTONTHELIST = "You have not been invited to join this channel !",
	NOTTHEOWNER = "Only the owner of this channel can do this operation !",
	NOTOP = "Only an administrator or the owner of this channel can do this operation !",
	NOTINVITED = "This user wasnt invited to this channel !",
	NOTBAN = "This user isn't ban from this channel !",
	NOTMUTE = "This user isn't mute in this channel !",
	ACAPTAINDONTLEAVEHISSHIP = "You are the owner of this channel you can't leave it !",
	CANTSANCTIONOWNER = "You cant sanction the mighty owner of this channel !",
	CANTSANCTIONEQUAL = "This user's power is equal to yours, you cannot defeat him !",
	YOUAREBAN = "You are ban from this channel !",
	YOUAREMUTE = "You are mute in this channel !",
	ALREADYBAN = "This user is already ban from this channel !",
	ALREADYMUTE = "This user is already mute from this channel !",
	YOUARECRINGE = "Stop that, you are cringe :/",
	SOSFRIEND = "You can contact S.O.S Amitié at this phone number : 09.72.39.40.50 :)"
}

export enum urls
{
	TOKEN = "https://api.intra.42.fr/oauth/token",
	URI = "http://localhost:3000",
	ORIGIN = "http://localhost:3000",
	ME = "https://api.intra.42.fr/v2/me",
}
