/**
 * Determine the status of a post based on its expiration time.
 * @param {Date} expirationTime - The expiration time of the post.
 * @returns {string} - Returns "Live" if the post is still active, otherwise "Expired".
 */
const statusCheck = (expirationTime) => {
    const currentTime = new Date();
    return currentTime < new Date(expirationTime) ? "Live" : "Expired";
};

module.exports = statusCheck;