type User = {
  // A unique identifier for the user.
  cognitoId: string,
  // The username
  username: string,
  // Generated id for a user. read-only
  id: string,
  registered: boolean
};

export default User;
