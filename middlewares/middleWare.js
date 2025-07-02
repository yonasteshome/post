import jwt from "jsonwebtoken";
import userSchema from "../models/user.js"; // Ensure .js is included

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await userSchema.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error("Error in protect middleware:", error.message);
            res.status(401).json({ message: "Not authorized" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export default protect;
