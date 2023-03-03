export enum errorMessages
{
	MISSING = "Missing code or state parameter !",
	DIFFERENT = "State received differ from state generated by the server !",
	INVALIDARG = "The value for one of the fields in the request was invalid.",
	NONAME = "Parameter name is missing !",
	ALREADYTAKEN = "This user name is already taken !",
	CODEINVALID = "The code sent has already been used !",
}

export enum urls
{
	TOKEN = "https://api.intra.42.fr/oauth/token",
	URI = "http://localhost:3000",
	ORIGIN = "http://localhost:3000",
	ME = "https://api.intra.42.fr/v2/me",
}
