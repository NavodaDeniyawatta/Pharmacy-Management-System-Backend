// -----------------------Custom libraries & modules-----------------------
const { VerifyTokens } = require("../libraries");

// -----------------------Middleware function to authenticate the user-----------------------
const AuthenticateUser = (req, res, next) => {
  // Token header
  const TokenHeader = req.headers.token;

  try {
    // Validate the token header
    if (TokenHeader) {
      const AccessToken = TokenHeader.split("Bearer ")[1];
      if (AccessToken) {
        // Verify the access token
        const VerifiedToken = VerifyTokens(AccessToken);
        if (!VerifiedToken.status) {
          return res.status(401).json({
            status: false,
            error: {
              message: "Your session has expired. Please log in again.",
            },
          });
        }

        // Add user to the request
        req.user = VerifiedToken.tokenDetails;
        return next();
      }

      return res.status(401).json({
        status: false,
        error: { message: "Access token must be properly provided!" },
      });
    }

    return res.status(401).json({
      status: false,
      error: { message: "Token header must be provided!" },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to authenticate the user due to server error!",
      },
    });
  }
};

// -----------------------Function to authorize the user-----------------------
const AuthorizeUser = (roles) => {
  return (req, res, next) => {
    const UserRole = req.user.userType;
    try {
      if (roles.includes(UserRole)) {
        return next();
      }
      return res.status(401).json({
        status: false,
        error: {
          message: "Permission denied to access use this feature!",
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: {
          message: "Failed to authorize the user due to server error!",
        },
      });
    }
  };
};

module.exports = { AuthenticateUser, AuthorizeUser };
