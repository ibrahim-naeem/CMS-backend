const AwsConfig = require("../AWS/Cognito/cognitoConfig");

const signUp = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;
    agent = "none";
    AwsConfig.initAWS();
    AwsConfig.setCognitoAttributeList(email, agent);
    AwsConfig.getUserPool().signUp(
      email,
      password,
      AwsConfig.getCognitoAttributeList(),
      null,
      (err, result) => {
        if (err) {
          return res.json({ statusCode: 422, response: err });
        }
        const response = {
          username: result.user.getUsername(),
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };
        return res.json({ statusCode: 201, response: response });
      }
    );
  } catch (error) {
    console.log(error, list);
  }
};

const verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    AwsConfig.getCognitoUser(email).confirmRegistration(
      code,
      true,
      (err, result) => {
        if (err) {
          return res.json({ statusCode: 422, response: err });
        }
        return res.json({ statusCode: 400, response: result });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: (result) => {
          const token = result.getAccessToken().getJwtToken();

          return res.json({
            statusCode: 200,
            response: AwsConfig.decodeJWTToken(token),
          });
        },

        onFailure: (err) => {
          return res.json({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const signOut = async (req, res) => {
  try {
    let cognitoUser = AwsConfig.getUserPool().getCurrentUser();
    // cognitoUser.signOut();
    res.json(cognitoUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signUp,
  verify,
  signIn,
  signOut,
};
