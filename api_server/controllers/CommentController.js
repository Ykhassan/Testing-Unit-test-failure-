import { Comment, ProjectComments, Reply } from '../models/index.js'
import { Op } from "sequelize";

const CommentController = {
    /**
     * @swagger
     * /comments/{project_id}:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a new comment
     *     description: Create a new comment for a specific project. If the comment is a reply, it associates it with the parent comment.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project where the comment is being added.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *                 description: The content of the comment.
     *               user_id:
     *                 type: string
     *                 description: The ID of the user making the comment.
     *               parent_comment_id:
     *                 type: integer
     *                 description: The ID of the parent comment (set to 0 if it's not a reply).
     *     responses:
     *       201:
     *         description: Comment created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 comment:
     *                   type: object
     *                   properties:
     *                     comment_id:
     *                       type: string
     *                     user_id:
     *                       type: string
     *                     content:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *                 parent_comment:
     *                   type: object
     *                   nullable: true
     *                   properties:
     *                     comment_id:
     *                       type: string
     *                     user_id:
     *                       type: string
     *                     content:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *       500:
     *         description: Internal server error while creating the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 error:
     *                   type: string
     */
    async createComment(req, res) {
        try {
            const { project_id } = req.params
            const { content, user_id, parent_comment_id } = req.body
            const newComment = await Comment.create({ user_id, content })
            await ProjectComments.create({ project_id, comment_id: newComment.comment_id })
            var replyComment;
            var parent_comment;
            //if the comment is a reply 
            if (parent_comment_id != 0) {
                replyComment = await Reply.create({ comment_id: newComment.comment_id, parent_comment_id: parent_comment_id })
                parent_comment = await Comment.findByPk(parent_comment_id)
            }
            //we return the new comment so front-end can auto-refresh the page and add the comment object to the interface
            return res.status(201).json({ comment: newComment, parent_comment: parent_comment }) // [NOTE] parent_comment will return undefiend if its not a reply
            //error creating a comment, internal issue within DB
        } catch (error) {
            return res.status(500).json({ message: "Error creating comment", error: error.message });
        }
    },

    /**
     * @swagger
     * /comments/{project_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all comments for a project
     *     description: Retrieve all comments associated with a specific project, including their details.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project whose comments are being retrieved.
     *     responses:
     *       200:
     *         description: List of comments retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 comments:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       project_id:
     *                         type: string
     *                       comment:
     *                         type: object
     *                         properties:
     *                           comment_id:
     *                             type: string
     *                           user_id:
     *                             type: string
     *                           content:
     *                             type: string
     *                           createdAt:
     *                             type: string
     *                             format: date-time
     *                           updatedAt:
     *                             type: string
     *                             format: date-time
     *       500:
     *         description: API error while retrieving comments.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 error:
     *                   type: string
     */
    async getAllProjectComments(req, res) {
        try {
            //getting project id and checking if it exists or not
            const { project_id } = req.params;
            //attributes execuldes the attributes from ProjectComments which are comment_id and parent_comment_id
            //can use execlude to execulte set of attributes or attribute [att1, att2, ...] to determine a set of attributes
            const comments = await ProjectComments.findAll({ where: { project_id: project_id }, include: { model: Comment }, attributes: [] })
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching comments", error: error.message });
        }
    },

    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get a specific comment by its ID
     *     description: Retrieve a specific comment associated with a project using its ID.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project to which the comment belongs.
     *       - in: path
     *         name: comment_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the comment to retrieve.
     *     responses:
     *       200:
     *         description: Comment retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 comment_id:
     *                   type: string
     *                 user_id:
     *                   type: string
     *                 content:
     *                   type: string
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *       404:
     *         description: Comment not found.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: API error while retrieving the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 error:
     *                   type: string
     */
    async getCommentById(req, res) {
        try {
            const { comment_id } = req.params;
            const comment = await Comment.findByPk(comment_id);
            if (comment) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching comment", error: error.message });
        }
    },

    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update a specific comment
     *     description: Update the content of a comment or modify up/down votes based on query parameters, ensuring the user owns the comment.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to which the comment belongs.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: comment_id
     *         required: true
     *         description: The ID of the comment to update.
     *         schema:
     *           type: integer
     *       - in: query
     *         name: actions
     *         required: false
     *         description: Action to perform on the comment's vote (up_vote, remove_up_vote, down_vote, remove_down_vote).
     *         schema:
     *           type: string
     *           enum:
     *             - up_vote
     *             - remove_up_vote
     *             - down_vote
     *             - remove_down_vote
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *                 description: The new content for the comment if the user is the owner.
     *     responses:
     *       200:
     *         description: Comment updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comment updated successfully"
     *                 comment:
     *                   type: object
     *                   properties:
     *                     comment_id:
     *                       type: integer
     *                     project_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     content:
     *                       type: string
     *                     up_vote:
     *                       type: integer
     *                     down_vote:
     *                       type: integer
     *                     created_at:
     *                       type: string
     *                       format: date-time
     *                     updated_at:
     *                       type: string
     *                       format: date-time
     *       500:
     *         description: Internal server error while processing the request.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error updating comment"
     */
    async updateComment(req, res) {
        try {
            const { comment_id } = req.params;
            const { content } = req.body
            const { actions } = req.query;

            const comment = await Comment.findByPk(comment_id);
            if(!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            //check if there is content value or not. based on it, we add/don't add content in changes
            //this step is accounting for when a user likes/dislikes other users comments 
            //if this step is ignored, every upvote or downvote, will wipe the comment content clean
            var changes = !content ? {} : { content: content }

            if (actions == "up_vote")
                changes = { ...changes, up_votes: comment.up_votes + 1 }
            else if (actions == "remove_up_vote")
                changes = { ...changes, up_votes: comment.up_votes - 1 }
            else if (actions == "down_vote")
                changes = { ...changes, down_votes: comment.down_votes + 1 }
            else if (actions == "remove_down_vote")
                changes = { ...changes, down_votes: comment.down_votes - 1 }

            //need to edit the Comment since all the data is there
            await Comment.update(changes, { where: { comment_id: comment_id } });
            //return comment to interface
            const updatedComment = await Comment.findByPk(comment_id)
            //return new comment after modification to interface ( handling how will user know if he liked or disliked might be handeled from interface)
            //maybe we return the type of action i.e. remove_up_vote to interface so it can translate the action in the interface
            return res.status(200).json(updatedComment)

        } catch (error) {
            return res.status(500).json({ message: "Error updating comment", error: error.message });

        }
    },

    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a specific comment by project ID and comment ID
     *     description: Delete a comment from a specific project based on the project ID and comment ID. The deletion is cascading if set up in the database.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to which the comment belongs.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: comment_id
     *         required: true
     *         description: The ID of the comment to delete.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Comment deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comment starting with: 'Some content...' has been deleted successfully"
     *       500:
     *         description: API error while deleting the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "API error"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    //will have cascade effect
    //due to comments being able to be in projectComments, and Replies
    async deleteComment(req, res) {
        try {
            const { comment_id } = req.params;
            //optional
            // const comment = await Comment.findByPk(comment_id)
            // let placeHolder = comment.content
            //need to configure cascade deletion
            const deleted = await Comment.destroy({ where: { comment_id: comment_id} })
            if (deleted) {
                res.status(204).json({ message: "Comment deleted" });
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error deleting comment", error: error.message });
        }
    }
};

export default CommentController;