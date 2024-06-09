const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json'); 
const commentData = require('./commentData.json')

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced!');

        const users = await User.bulkCreate(userData, {
            individualHooks: true, 
            returning: true,
        }); 
        console.log('Users seeded!');

        const posts = await Promise.all(
            postData.map(async (post) => {
                const createdPost = await Post.create({
                    ...post, 
                    user_id: users[Math.floor(Math.random() * users.length)].id,
                }); 
                return createdPost;
            })
        );
        console.log('Posts seeded!'); 

        await Promise.all(
            commentData.map(async (comment) => {
                return await Comment.create({
                    ...comment, 
                    user_id: users[Math.floor(Math.random() * users.length)].id,
                    post_id: posts[Math.floor(Math.random() * posts.length)].id,
                });
            })
        );
        console.log('Comments seeded!');
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Failed to seed database: ', err);
    } 
    process.exit(0);
};

seedDatabase();