import sql from "../configs/db.js";

// Get user's own creations
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await sql`
      SELECT * FROM CREATIONS WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all published creations
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM CREATIONS WHERE publish = true ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle like/unlike for a creation
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) return res.json({ success: false, message: "Creation not found" });

    const currentLikes = Array.isArray(creation.likes) ? creation.likes : [];
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    // Update likes in PostgreSQL text[]
    await sql`
      UPDATE creations
      SET likes = ${updatedLikes}::text[]
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
