import User from "../models/user.js";

// ✅ Get a single user by ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow if the authenticated user's ID matches the requested ID
        if (req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get friends of a user (Fixed)
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const friends = await Promise.all(
            user.friends.map((friendId) => User.findById(friendId))
        );

        const validFriends = friends.filter(friend => friend !== null); // ✨ Filter out nulls

        const formattedFriends = validFriends.map(
            ({ _id, firstName, lastName, picturePath, location, occupation }) => ({
                _id,
                firstName,
                lastName,
                picturePath,
                location,
                occupation,
            })
        );

        console.log("Friends fetched and formatted:", formattedFriends); // ✅ Debug

        res.status(200).json(formattedFriends);
    } catch (error) {
        console.error("Error fetching friends:", error); // ✅ Debug
        res.status(500).json({ error: error.message });
    }
};

// ✅ Add or remove friend from user's list
export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        if (user.friends.includes(friendId)) {
            // Remove friend
            user.friends = user.friends.filter(fid => fid.toString() !== friendId.toString());
            friend.friends = friend.friends.filter(fid => fid.toString() !== id.toString());
        } else {
            // Add friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((fid) => User.findById(fid))
        );

        const validFriends = friends.filter(friend => friend !== null); // ✨ Filter out nulls

        const formattedFriends = validFriends.map(
            ({ _id, firstName, lastName, picturePath, location, occupation }) => ({
                _id,
                firstName,
                lastName,
                picturePath,
                location,
                occupation,
            })
        );

        res.status(200).json(formattedFriends);
    } catch (error) {
        console.error("Error adding/removing friends:", error); // ✅ Debug
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get users who are not friends of a user
export const getNotFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Get all users except the current user
        const allUsers = await User.find({ _id: { $ne: id } });

        // Filter out friends from the list
        const notFriends = allUsers.filter(u => !user.friends.includes(u._id.toString()));

        // Format the not-friends list
        const formattedNotFriends = notFriends.map(
            ({ _id, firstName, lastName, picturePath, location, occupation }) => ({
                _id,
                firstName,
                lastName,
                picturePath,
                location,
                occupation,
            })
        );


        res.status(200).json(formattedNotFriends);
    } catch (error) {
        console.error("Error fetching not friends:", error);
        res.status(500).json({ error: error.message });
    }
};
