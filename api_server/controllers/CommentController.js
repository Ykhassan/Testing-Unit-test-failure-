import { Comment, ProjectComments, Project, User } from '../models/index.js'
import { Op } from "sequelize";

const CommentController = {
    /**
     * @swagger
     * /comments/{project_id}:
     *   post:
     *     security:
     *      - bearerAuth: []
     *     summary: Create a new comment for a project
     *     description: Create a new comment with the provided information, associating it with a project and user.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the comment is associated with.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user who is creating the comment.
     *               content:
     *                 type: string
     *                 description: The content of the comment.
     *     responses:
     *       201:
     *         description: Comment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comments'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Project not found
     *       503:
     *         description: Internal Server Error
     */


    async createComment(req, res) {
        // check if the project is existing at the first place
        // by checking projectid from the route
        // then, check if user is logged in
        // by checking firebase token
        try {
            //getting project id and checking if it exists or not
            const { project_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            //getting the imbbeddded firebase token within the request to decode it
            // const authHeader = req.headers["Bearer <token>"]
            //wouldn't work now, so subtitue the second if check with user_id status instead of token temporarly. In case we integrate firebase, we change it  to check the token, then rather than user id
            const { user_id } = req.body
            const userExists = await User.findByPk(user_id)

            //error creating a comment, project doesn't exist
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }

            //error creating a comment, unauthorized access
            if (!userExists) {
                return res.status(401).json({ message: "Error creating comment" });
            }
            /* example of token decoding from firebase using Admin SDK
               note: idToken will be sent as an authorization header from the front end within the req
               idToken comes from the client app
               getAuth()
               .verifyIdToken(idToken)
               .then((decodedToken) => {
                 const uid = decodedToken.uid;
                 // ...
               })
               .catch((error) => {
                 // Handle error
               });
               here, I will use req.user_id for testing, but in reality, the above commented section of code should be ran first to decode a token
               so we should use uid from above rather than user_id
               */
            try {
                const { content } = req.body
                const newComment = await Comment.create({ user_id, content })
                //we return the new comment so front-end can auto-refresh the page and add the comment object to the interface
                return res.status(201).json(newComment);
                //error creating a comment, internal issue within DB
            } catch (error) {
                return res.status(500).json({ message: "Error creating comment", error: error.message });
            }
        }
        catch (error) {
            //API error
            return res.status(503).json({ message: "API error", error: error.message });
        }
    },
    /**
     * @swagger
     * /comments/{project_id}:
     *   get:
     *     security:
     *      - bearerAuth: []
     *     summary: Create a new comment for a project
     *     description: Create a new comment with the provided information, associating it with a project and user.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the comment is associated with.
     *     responses:
     *       200:
     *         description: Comments fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comments'
     *       404:
     *         description: Project not found
     *       503:
     *         description: Internal Server Error
     */
    async getAllProjectComments(req, res) {
        try {
            //getting project id and checking if it exists or not
            const { project_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            //error creating a comment, project doesn't exist
            //might need to check if the user is authenticated first to view the project comments, if he is collab (including his permissions) and project is private he can see it, else return an error.
            //then we will add 401 
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            const comments = await ProjectComments.findAll({ where: { project_id: project_id } })
            //no need to check for error, if it is empty, just return the comments anyway
            //can change to (comments) instead of ({comments})
            return res.status(200).json({ comments });
        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }
    },

    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get a specific comment for a project
     *     description: Retrieve a specific comment from a project by its ID and comment ID.
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
     *         description: The comment exists and has been retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Either the project or the comment does not exist.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Bad request, project doesn't exist"
     *       503:
     *         description: API error, unable to retrieve the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Bad request, comment doesn't exist"
     *                 error:
     *                   type: string
     *                   example: "Internal server error"
     */

    async getCommentById(req, res) {
        try {
            const { project_id, comment_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const comment_exist = await Comment.findByPk(comment_id)
            //error creating a comment, project doesn't exist
            //might need to check if the user is authenticated first to view the project comments, if he is collab (including his permissions) and project is private he can see it, else return an error.
            //then we will add 401 
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            //now we check comment if it exist
            if (!comment_exist) {
                return res.status(404).json({ message: "Bad request, comment doesn't exist" });
            }
            const comment = await ProjectComments.findOne({ where: { comment_id: comment_id } })
            //if there is comment but not under that project, there is a lot of things we can do such as resolve to the correct comment rather than project, which is what I prefer
            //for now, I will return an error,
            if (!comment)
                return res.status(404).json({ message: "Bad request, this comment doesn't exist in this project" });

            return res.status(200).json(comment);
        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }
    },


    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update a comment
     *     description: Update the content of a comment if the user owns it, or update up_vote/down_vote based on query parameters.
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
     *         description: The ID of the comment to update.
     *       - in: query
     *         name: up_vote
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, -1]
     *         description: Increment (+1) or decrement (-1) the up_vote count.
     *       - in: query
     *         name: down_vote
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, -1]
     *         description: Increment (+1) or decrement (-1) the down_vote count.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *                 description: The new content of the comment (if the user owns the comment).
     *               user_id:
     *                 type: string
     *                 description: The ID of the user making the update.
     *     responses:
     *       200:
     *         description: Comment updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 project_id:
     *                   type: string
     *                 user_id:
     *                   type: string
     *                 content:
     *                   type: string
     *                 up_vote:
     *                   type: integer
     *                 down_vote:
     *                   type: integer
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *       401:
     *         description: Unauthorized. The user does not own the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Bad request. Either the project or comment does not exist, or invalid query parameter values were provided.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: Internal server error while saving the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       503:
     *         description: API error.
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



    async updateComment(req, res) {
        try {
            const { project_id, comment_id } = req.params;
            const { content, user_id } = req.body
            const projectExists = await Project.findByPk(project_id)
            const comment_exist = await Comment.findByPk(comment_id)
            const user_exist = await User.findByPk(user_id)
            const { up_vote, down_vote } = req.query;
            //might need to check if the user is authenticated first to view the project comments, if he is collab (including his permissions) and project is private he can see it, else return an error.
            //then we will add 401 
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            //now we check comment if it exist
            if (!comment_exist) {
                return res.status(404).json({ message: "Bad request, comment doesn't exist" });
            }
            if (!user_exist) {
                return res.status(404).json({ message: "Bad request, user doesn't exist" });
            }

            var comment = await Comment.findByPk(comment_id)
            //user doesn't own, only up_vote, or down_vote
            if (!up_vote && down_vote) {
                if (down_vote === '1')
                    await Comment.update({ down_votes: comment.down_votes + 1 }, { where: { comment_id: comment.comment_id } });
                else if (down_vote === '-1')
                    await Comment.update({ down_votes: comment.down_votes - 1 }, { where: { comment_id: comment.comment_id } });
                else
                    return res.status(404).json({ message: "Bad request, invalid value for down_vote" });
            }

            else if (up_vote && !down_vote) {

                if (up_vote === '1')
                    await Comment.update({ up_votes: comment.up_votes + 1 }, { where: { comment_id: comment.comment_id } });
                else if (up_vote === '-1')
                    await Comment.update({ up_votes: comment.up_votes - 1 }, { where: { comment_id: comment.comment_id } });
                else
                    return res.status(404).json({ message: "Bad request, invalid value for up_vote" });
            }
            else if (up_vote && down_vote)
                return res.status(404).json({ message: "Bad request, can't without quires or both at the same time!" });


            //check if user owns the comment
            if (user_id == comment.user_id) {
                //need to edit the Comment since all the data is there
                var [updatedComment] = await Comment.update({ content: content }, { where: { comment_id: comment_id } });
                //check db if the update happened truly
                if (!updatedComment) {
                    return res.status(500).json({ message: "Couldn't update comment" });
                }
                //return comment to interface
                updatedComment = await Comment.findByPk(comment_id)
                return res.status(200).json(updatedComment)
            }
            else {
                comment = await Comment.findByPk(comment_id)
                if (content) {
                    return res.status(401).json({ message: "you are not the owner of the comment to change its contents!", comment: comment });
                }
                else
                    return res.status(200).json({ comment });
            }
        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });

        }
    },
    /**
     * @swagger
     * /comments/{project_id}/{comment_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a comment
     *     description: Delete a comment if the user owns it.
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project from which the comment will be deleted.
     *       - in: path
     *         name: comment_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the comment to delete.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user making the update.
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
     *                   description: Success message indicating the comment was deleted.
     *               example:
     *                 message: "Comment starting with: This is a sample comment... has been deleted successfully"
     *       401:
     *         description: Unauthorized. The user does not own the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: "You are not the owner of the comment to delete it!"
     *       404:
     *         description: Not Found. Either the project or comment does not exist.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: "Bad request, project doesn't exist"
     *       503:
     *         description: Internal server error while deleting the comment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 error:
     *                   type: string
     *               example:
     *                 message: "API error"
     *                 error: "Detailed error message"
     */

    async deleteComment(req, res) {
        try {
            //remember, cascade deletion needs to be in the DB to begin with
            const { project_id, comment_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const comment_exist = await Comment.findByPk(comment_id)
            const { user_id } = req.body
            const user_exist = await User.findByPk(user_id)
            //might need to check if the user is authenticated first to view the project comments, if he is collab (including his permissions) and project is private he can see it, else return an error.
            //then we will add 401 
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            //now we check comment if it exist
            if (!comment_exist) {
                return res.status(404).json({ message: "Bad request, comment doesn't exist" });
            }
            if (!user_exist) {
                return res.status(404).json({ message: "Bad request, user doesn't exist" });
            }
            let placeHolder = comment_exist.content
            if (comment_exist.user_id != user_id) {
                return res.status(401).json({ message: "you are not the owner of the comment to delete it!" });
            }
            //need to configure cascade deletion
            await Comment.destroy({ where: { comment_id: comment_exist.comment_id } })
            return res.status(200).json({ message: "comment starting with: " + placeHolder.substring(0, 25) + "... has been deleted successfully " })
        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }
    }
};

export default CommentController;