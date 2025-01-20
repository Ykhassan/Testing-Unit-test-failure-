import { json } from "express";
import { Issue, IssueComments, Comment, Project, User, Reply } from "../models/index.js";

const IssueController = {
    /**
     * @swagger
     * /issues/{project_id}:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a new issue for a project
     *     description: Create a new issue under a specific project. The issue will be created with an "open" status by default.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to which the issue belongs.
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 description: The title of the issue.
     *               description:
     *                 type: string
     *                 description: A detailed description of the issue.
     *               user_id:
     *                 type: string
     *                 description: The ID of the user reporting the issue.
     *     responses:
     *       201:
     *         description: Issue created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "issue created successfully"
     *                 issue:
     *                   type: object
     *                   properties:
     *                     project_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     title:
     *                       type: string
     *                     description:
     *                       type: string
     *                     status:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *       500:
     *         description: Error creating issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error creating issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async createIssue(req, res) {
        try {
            //get project Id from the url parms 
            const { project_id } = req.params;
            //this is a choice, I think all issues should be open when first created
            const status = "open"
            const { title, description, user_id } = req.body
            const newIssue = await Issue.create({ project_id, user_id, title, description, status })
            return res.status(201).json(newIssue);
        } catch (error) {
            return res.status(500).json({ message: "Error creating issue", error: error.message });
        }
    },

    /**
     * @swagger
     * /issues/{project_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all issues for a specific project
     *     description: Retrieve all issues associated with a particular project.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to fetch issues for.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Issues retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "issues returned successfully"
     *                 issues:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       project_id:
     *                         type: integer
     *                       user_id:
     *                         type: string
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       status:
     *                         type: string
     *                       createdAt:
     *                         type: string
     *                         format: date-time
     *                       updatedAt:
     *                         type: string
     *                         format: date-time
     *       500:
     *         description: Error fetching issues.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching issues"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async getAllProjectIssues(req, res) {
        try {
            //get project Id from the url parms 
            const { project_id } = req.params;
            const issues = await Issue.findAll({ where: { project_id: project_id } })
            //return the issues to front end so user could see them
            return res.status(200).json(issues);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching issues", error: error.message });
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get a specific issue by its ID within a project
     *     description: Retrieve a specific issue by its unique ID within a given project.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project that the issue belongs to.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue to fetch.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Issue retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "issue returned successfully"
     *                 issue:
     *                   type: object
     *                   properties:
     *                     project_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     title:
     *                       type: string
     *                     description:
     *                       type: string
     *                     status:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *       500:
     *         description: Error fetching issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async getIssueById(req, res) {
        try {
            const { issue_id } = req.params;
            //no need to re-fetch the issue since issueExists has it
            const issue = await Issue.findByPk(issue_id)
            if (issue) {
                res.status(200).json(issue);
            } else {
                res.status(404).json({ message: "Issue not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching issue", error: error.message });
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update an issue within a project
     *     description: Update the title, description, and status of an issue. If the status is set to "closed", the closed_at timestamp is calculated.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project that the issue belongs to.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue to update.
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 description: The new title of the issue.
     *               description:
     *                 type: string
     *                 description: The new description of the issue.
     *               status:
     *                 type: string
     *                 enum: [open, closed]
     *                 description: The new status of the issue. Set to "closed" to calculate the closed_at timestamp.
     *     responses:
     *       200:
     *         description: Issue updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "issue updated successfully"
     *                 issue:
     *                   type: object
     *                   properties:
     *                     project_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     title:
     *                       type: string
     *                     description:
     *                       type: string
     *                     status:
     *                       type: string
     *                     closed_at:
     *                       type: string
     *                       format: date-time
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *       500:
     *         description: Error updating issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error updating issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async updateIssue(req, res) {
        try {
            const { issue_id } = req.params;
            const { title, description, status } = req.body
            //initilize closed_at time with null, and change and calcualte close time only if status is changed to closed
            var closed_at = null;
            //might need to use user_id to decied the time zone for the user for later conversion to user-appropriate time zone later on
            if (status == "closed") {
                const time = new Date();
                const timeInUTC = Date.UTC(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
                closed_at = new Date(timeInUTC).toISOString();
            }
            //update issue
            const [updated] = await Issue.update({ title: title, description: description, status: status, closed_at: closed_at }, { where: { issue_id: issue_id } })
            if (updated) {
                const updatedIssue = await Issue.findByPk(issue_id);
                res.status(200).json(updatedIssue);
            } else {
                res.status(404).json({ message: "Issue not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error updating issue", error: error.message });
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete an issue within a project
     *     description: Delete the specified issue from the project by its ID.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project that the issue belongs to.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue to delete.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Issue deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "issue starting with 'Issue Title'... has been deleted successfully"
     *       500:
     *         description: Error deleting issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error deleting issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    //you will face cascade deletion issue and that is fine
    //happens when an issue have a comment, so it will be in the issueComments table
    async deleteIssue(req, res) {
        try {
            const { issue_id } = req.params;
            // const issue = await Issue.findByPk(issue_id)
            // const placeHolder = issue.title
            const deleted = await Issue.destroy({ where: { issue_id: issue_id } })
            if (deleted) {
                res.status(204).json({ message: "Issue deleted" });
            } else {
                res.status(404).json({ message: "Issue not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error deleting issue", error: error.message });
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a comment for an issue within a project
     *     description: Add a comment to the specified issue within a project. The comment can optionally be a reply to another comment.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project the issue belongs to.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue the comment belongs to.
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user creating the comment.
     *               content:
     *                 type: string
     *                 description: The content of the comment.
     *               parent_comment_id:
     *                 type: integer
     *                 description: The ID of the parent comment if the comment is a reply. Set to 0 if the comment is not a reply.
     *                 example: 0
     *     responses:
     *       200:
     *         description: Comment created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "comment created successfully"
     *                 comment:
     *                   type: object
     *                   properties:
     *                     comment_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     content:
     *                       type: string
     *                 parent_comment:
     *                   type: object
     *                   nullable: true
     *                   properties:
     *                     comment_id:
     *                       type: integer
     *                     user_id:
     *                       type: string
     *                     content:
     *                       type: string
     *       500:
     *         description: Error creating comment for selected issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error creating comment for selected issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async createIssueComment(req, res) {
        try {
            const { issue_id } = req.params;
            const { user_id, content, parent_comment_id } = req.body
            const createComment = await Comment.create({ user_id: user_id, content: content })
            await IssueComments.create({ issue_id: issue_id, comment_id: createComment.comment_id })
            //This needs to be created for CommentController too, I believe I didn't cover this scenario 
            var parentComment;
            //chec if comment is a reply
            if (parent_comment_id != 0) {
                //create reply record for this comment
                await Reply.create({ comment_id: createComment.comment_id, parent_comment_id: parent_comment_id })
                //fetch parent comment so we can return it to the front end
                parentComment = await Comment.findByPk(parent_comment_id)
            }
            //parent_comment will be null if ther is no parent comment 
            return res.status(201).json({ comment: createComment, parent_comment: parentComment })

        } catch (error) {
            return res.status(500).json({ message: "Error creating comment for selected issue", error: error.message })
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all comments for an issue within a project
     *     description: Retrieves all comments for the specified issue in the project.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project the issue belongs to.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue for which comments are being retrieved.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Comments returned successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "comments returned successfully"
     *                 comments:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       comment_id:
     *                         type: integer
     *                       user_id:
     *                         type: string
     *                       content:
     *                         type: string
     *       500:
     *         description: Error fetching all comments for selected issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching all comments for selected issue"
     *                 error:
     *                   type: string
     *                   example: "Error message"
     */
    async getAllIssueComments(req, res) {
        try {
            const { issue_id } = req.params;
            //returns all comments objects in current issue using issuecomments table
            const comments = await IssueComments.findAll({ where: { issue_id: issue_id }, include: { model: Comment }, attributes: [] })
            return res.status(200).json(comments)
        } catch (error) {
            return res.status(500).json({ message: "Error fetching all comments for selected issue", error: error.message })
        }
    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments/{comment_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update a specific comment
     *     description: Update the content of a comment or modify up/down votes based on query parameters, ensuring the user is the owner of the comment.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to which the comment belongs.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue to which the comment belongs.
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
     *                     issue_id:
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
    //this endpoint is copy paste of the endpoint updateComment, except this will be triggered inside an issue,
    //where the other endpoint will be triggered inside the project comments
    async updateIssueComment(req, res) {
        try {
            const { comment_id } = req.params;
            const { content } = req.body
            const { actions } = req.query;

            const comment = await Comment.findByPk(comment_id)
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
            //return new comment after modification to interface
            //(handling how will user know if he liked or disliked might be handeled from interface)
            //maybe we return the type of action i.e. remove_up_vote to interface so it can translate the action in the interface
            //we can save the action of the query in a parameter and return it to the front end so it can do different animations
            return res.status(200).json(updatedComment)

        } catch (error) {
            return res.status(500).json({ message: "Error updating comment", error: error.message });
        }
    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments/{comment_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a specific comment
     *     description: Deletes a comment for a specific issue in a project.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         description: The ID of the project to which the comment belongs.
     *         schema:
     *           type: integer
     *       - in: path
     *         name: issue_id
     *         required: true
     *         description: The ID of the issue to which the comment belongs.
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
     *                   example: "Comment starting with: [content]... has been deleted successfully"
     *       500:
     *         description: Internal server error while processing the request.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error deleting comment for selected issue"
     */
    //will have cascade effect
    //due to comments being able to be in, issueComments, and Replies
    async deleteIssueComment(req, res) {
        try {
            const { comment_id } = req.params;
            //optional
            // const comment = await Comment.findByPk(comment_id)
            // let placeHolder = comment.content
            //need to configure cascade deletion
            const deleted = await Comment.destroy({ where: { comment_id: comment_id } })
            if (deleted) {
                res.status(204).json({ message: "Comment deleted" });
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error deleting comment for selected issue", error: error.message })
        }
    },
};

export default IssueController