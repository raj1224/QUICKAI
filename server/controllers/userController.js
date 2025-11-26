import sql from "../configs/db.js";

export const getUserCreations= async (req, res) => {
    try {
        const {userID}=req.auth()
        const creations = await sql`SELECT * FROM creations WHERE user_id=${userID} ORDER BY created_at DESC`;
        res.json({success:true, creations});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export const getPublishedCreations= async (req, res) => {
    try {
        const creations = await sql`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;
        res.json({success:true, creations});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export const toggleLikeCreations= async (req, res) => {
    try {
        const {userID}=req.auth()
        const {id} = req.body;


        const [creation] = await sql`SELECT * FROM creations WHERE user_id=${id}`;
        if (!creation) {
            return res.json({success:false, message:"Creation not found"});
        }

        const currentLikes = creation.likes;
        const userIdStr = userID.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = "creation UnLiked";
        }else{
            updatedLikes = [...currentLikes, userIdStr];
            message = "creation Liked";
        }

        const formattedArray= `{${updatedLikes.json(',')}}`

        const creations = await sql`UPDATE creations SET likes=${formattedArray}::text[] WHERE id=${id}`;
        res.json({success:true, message});

    } catch (error) {
        res.json({success:false, message:error.message});
    }
}