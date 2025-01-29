const jwt = require('jsonwebtoken');
const verifyToken = async (req, res, next) => {
    try {
        const authHeader =req.headers.authorization;
        if(!authHeader){
            console.log("Authorization header is missing");
            return res.status(401).json({ message: "Authorization header not provided" });
        }
        const token = authHeader.split(' ')[1];

        if(!token){
            console.log("Token is missing");
            return res.status(401).json({ message: "Token not provided" });
        }else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
    } catch (error) {
        console.error("Error while verifying token:", error);
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(400).json({ message: "Invalid token" });
    }
}

module.exports = {verifyToken}