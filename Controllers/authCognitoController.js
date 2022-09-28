const AwsConfig = require("../AWS/Cognito/cognitoConfig");

const signUp = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    console.log(username, email, role, password);

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
          return res.json(err);
        }

        return res.status(201).json({
          username: result.user.getUsername(),
          userConfirmed: result.userConfirmed,
          message: `Verification Code sent on this ${result.user.getUsername()} email.`,
        });
      }
    );
  } catch (error) {
    console.log(error, list);
  }
};

const verify = async (req, res) => {
  try {
    const { email, verifiactionCode } = req.body;
    AwsConfig.getCognitoUser(email).confirmRegistration(
      verifiactionCode,
      true,
      (err, result) => {
        if (err) {
          return res.json({ statusCode: 422, response: err });
        }
        return res
          .status(200)
          .json({ message: "Email Verified", response: result });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let data = AwsConfig.getCognitoUser(email);
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: (result) => {
          const token = result.getAccessToken().getJwtToken();
          const uid = AwsConfig.decodeJWTToken(token);

          return res.status(200).json({
            uid,
            email: data.username,
            token,
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
  const { email } = req.body;
  try {
    let data = AwsConfig.getCognitoUser(email);

    // res.json(data. .signOut());
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
