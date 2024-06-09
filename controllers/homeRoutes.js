const router = require('express').Router(); 
const { Post, User, Comment } = require('../models'); 
const withAuth = require('../utils/auth'); 

router.get('/', async (req, res) => {
    try {
        // Get all posts and JOIN with user data 
        const postData = await Post.findAll({
            include: [
                {
                    model: User, 
                    attributes: ['id'],
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['name'],
                    },
                }
            ],
        }); 
        // Serialize data so the template can read it 
        const posts = postData.map((post) => post.get({ plain: true })); 
        // Pass serialized data and session flag into template 
        res.render('homepage', {
            posts, 
            logged_in: req.session.logged_in
        });
    } catch (err) { 
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User, 
                    attributes: ['id'],
                },
                {
                    model: Comment, 
                    include: {
                        model: User, 
                        attributes: ['name'],
                    },
                },
            ],
        }); 
        if (!postData) {
            res.status(404).json({ message: 'No posts found with this id!' });
        }
        const post = postData.get({ plain: true });
        res.render('post', {
            ...post, 
            logged_in: req.session.logged_in
        });
    } catch (err) { 
        console.error(err);
        res.status(500).json(err);
    }
});  

// withAuth middleware to prevent access to route 
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] }, 
            include: [
                { 
                    model: Post, 
                    include: {
                        model: Comment, 
                        include: { 
                            model: User, 
                            attributes: ['name'],
                        },
                    },
                 },
                ],
        });
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        const user = userData.get({ plain: true }); 
        res.render('profile', {
            ...user, 
            logged_in: true
        }); 
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}); 

router.get('/login', (req, res) => {
    // if user is logged in, will redirect the request to another route 
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    } 
    res.render('login');
}); 

module.exports = router;