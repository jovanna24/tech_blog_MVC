const router = require('express').Router(); 
const { Comment } = require('../../models'); 
const withAuth = require('../../utils/auth'); 

// route to retrieve comments 
router.get('/', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.findAll({
        where: {
          user_id: req.session.user_id,
        },
      });
      const comments = commentData.map((comment) => comment.get({ plain: true }));
      res.render('comments', {
        comments, 
        logged_in: req.session.logged_in,
      });
    } catch (err) { 
      console.error(err);
      res.status(500).json(err);
    }
  });
// route to create a new comment
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id
        }); 
        res.status(200).json(newComment);
    } catch (err) { 
        console.error(err);
        res.status(400).json(err);
    }
}); 

// route to delet a comment by id
router.delete('/:id', withAuth, async (req, res) => {
    try{
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id, 
                user_id: req.session.user_id,
            }, 
        });
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.status(200).json({ message: 'Comment deleted successfully!' });
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;