const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try{
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User, 
          attributes: ['name'],
        },
      ],
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('profile', {
      posts, 
      logged_in: req.session.logged_in,
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json(err)
  }
});
// route to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    // creates a new post with the data from the request bodu and the user ID from the session
    // const newPost = await Post.create({
    //   ...req.body,
    //   user_id: req.session.user_id,
    // });
    const { title, content } = req.body;
    if(!title || !content) {
      return res.status(400).json({ error: 'Title and content required!'});
    }
    const newPost = await Post.create({
      title, 
      content, 
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
}); 

// route to retrieve a post based on post id
router.get('/post/:id', withAuth, async (req, res)=> {
  try{
    const postData = await Post.findByPk(req.params.id);
    if(!postData) {
      res.status(404).json({ message: 'No post found with this id.'});
      return;
    } 
    const post = postData.get({ plain: true });
    console.log(post)
    res.render('post', {
      post, 
      logged_in: req.session.logged_in,
    }); 
  }catch(err) {
      res.status(500).json(err);
    }
});

// route to delet post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
