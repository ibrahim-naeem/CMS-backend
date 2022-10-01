// // global.fetch = require("node-fetch");

// require("dotenv").config();
// const Cognito = require("./authCognitoController");

// const Signup = async () => {
//   try {
//     const res = fetch("http://localhost:5000/cognito/sign");
//     // const response = await Cognito.signUp(body.email, body.password);
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const Verify = async () => {
//   const res = fetch("http://localhost:5000/cognito/verify");
//   // const response = await Cognito.verify(body.email, "860086");
//   console.log(res);
// };

// const SignIn = async () => {
//   const response = await Cognito.signIn(body.email, body.password);

//   console.log(response);
// };

// const SignOut = async () => {
//   const res = fetch("http://localhost:5000/cognito/signout");

//   console.log(res);
// };

// module.exports = {
//   Signup,
//   Verify,
//   SignIn,
// };

// // Signup();
// // Verify();
// // SignIn();
