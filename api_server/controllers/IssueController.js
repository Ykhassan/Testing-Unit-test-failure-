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
     *     description: Create a new issue with the provided information, associating it with a project and user.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user who is creating the issue.
     *               title:
     *                 type: string
     *                 description: The title of the issue.
     *               description:
     *                 type: string
     *                 description: A detailed description of the issue.
     *               status:
     *                 type: string
     *                 description: The status of the issue (e.g., open, in-progress, resolved).
     *     responses:
     *       201:
     *         description: Issue created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Issues'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Project not found
     *       503:
     *         description: Internal Server Error
     */
    async createIssue(req, res) {
        try {
            //get project Id from the url parms 
            const { project_id } = req.params;
            //check if the project exists
            const projectExists = await Project.findByPk(project_id)
            //user id to regiester issue under
            const { user_id } = req.body
            //check if the user exists
            const userExists = await User.findByPk(user_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!userExists) {
                return res.status(401).json({ message: "Error creating comment" });
            }
            try {
                //this is a choice, I think all issues should be open when first created
                const status = "open"
                const { title, description } = req.body
                const newIssue = await Issue.create({ project_id, user_id, title, description, status })
                return res.status(201).json(newIssue);
            } catch (error) {
                return res.status(500).json({ message: "Error creating issue", error: error.message });
            }

        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });

        }

    },
    /**
     * @swagger
     * /issues/{project_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve all issues for a project
     *     description: Fetch all issues associated with a specific project by providing the project ID.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project whose issues are being fetched.
     *     responses:
     *       200:
     *         description: A list of issues for the specified project
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Issues'
     *       404:
     *         description: Project not found
     *       500:
     *         description: Error fetching issues
     *       503:
     *         description: API error
     */
    async getAllProjectIssues(req, res) {

        try {
            //get project Id from the url parms 
            const { project_id } = req.params;
            //check if the project exists
            const projectExists = await Project.findByPk(project_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            try {
                const issues = await Issue.findAll({ where: { project_id: project_id } })
                //return the issues to front end so user could see them
                return res.status(200).json(issues);
            } catch (error) {
                return res.status(500).json({ message: "Error fetching issues", error: error.message });
            }

        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });

        }


    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve a specific issue by ID
     *     description: Fetch details of a specific issue associated with a project by providing the project ID and issue ID.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the issue to retrieve.
     *     responses:
     *       200:
     *         description: Issue retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Issues'
     *       404:
     *         description: Project or issue not found
     *       500:
     *         description: Error fetching issue
     *       503:
     *         description: API error
     */
    async getIssueById(req, res) {
        try {
            const { project_id, issue_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }
            try {
                //no need to re-fetch the issue since issueExists has it
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }
                return res.status(200).json(issue)
            } catch (error) {
                return res.status(500).json({ message: "Error fetching issue", error: error.message });

            }
        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }
    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update an existing issue
     *     description: Modify the details of a specific issue associated with a project, including its title, description, and status. Only the issue's creator can update it.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the issue to update.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user making the update. Must match the issue's creator.
     *               title:
     *                 type: string
     *                 description: The updated title of the issue.
     *               description:
     *                 type: string
     *                 description: The updated description of the issue.
     *               status:
     *                 type: string
     *                 description: The updated status of the issue (e.g., open, in-progress, closed).
     *     responses:
     *       200:
     *         description: Issue updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 updatedIssue:
     *                   $ref: '#/components/schemas/Issues'
     *       403:
     *         description: User not authorized to update the issue
     *       404:
     *         description: Project or issue not found
     *       500:
     *         description: Error updating the issue
     *       503:
     *         description: API error
     */
    async updateIssue(req, res) {
        try {
            const { project_id, issue_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            try {
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }
                //we need user id to make sure only owner can changes these data
                //we can later edit this to allow others to modify this information
                const { user_id, title, description, status } = req.body
                //might need to use user_id to decied the time zone for the user for later conversion to user-appropriate time zone later on
                const time = new Date();
                const timeInUTC = Date.UTC(
                    time.getUTCFullYear(),
                    time.getUTCMonth(),
                    time.getUTCDate(),
                    time.getUTCHours(),
                    time.getUTCMinutes(),
                    time.getUTCSeconds());
                const closed_at = status == "closed" ? new Date(timeInUTC).toISOString() : null
                if (issueExists.user_id != user_id)
                    return res.status(403).json({ message: "you are not authorized to edit this information!" });

                const updateIssue = await Issue.update({ title: title, description: description, status: status, closed_at: closed_at }, { where: { issue_id: issue_id } })
                // 0 = no rows affected, 1 = updated successfully
                if (updateIssue != 0) {
                    const updatedIssue = await Issue.findByPk(issue_id)
                    return res.status(200).json(updatedIssue)
                }

            } catch (error) {
                return res.status(500).json({ message: "Error updating issue", error: error.message });
            }

        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }

    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete an issue
     *     description: Remove a specific issue from a project by providing the project ID and issue ID. Only the issue's creator can delete it.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the issue to delete.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *                 description: The ID of the user requesting to delete the issue. Must match the issue's creator.
     *     responses:
     *       200:
     *         description: Issue deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Issue deleted successfully"
     *       403:
     *         description: User not authorized to delete the issue
     *       404:
     *         description: Project or issue not found
     *       500:
     *         description: Error deleting issue
     *       503:
     *         description: API error
     */
    async deleteIssue(req, res) {

        try {
            const { project_id, issue_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            try {

                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }

                const { user_id } = req.body

                if (issueExists.user_id != user_id)
                    return res.status(403).json({ message: "you are not authorized to edit this information!" });


                const deleteIssue = Issue.destroy({ where: { issue_id: issue_id } })
                if (deleteIssue != 0) {
                    return res.status(200).json({ message: "issue deleted succesfully" })
                }

            } catch (error) {
                return res.status(500).json({ message: "Error deleting issue", error: error.message });

            }


        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }


    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a comment on an issue
     *     description: Add a new comment to a specific issue within a project. Optionally, add a reply to an existing comment. Comments can be either original comments or replies.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the issue to comment on.
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
     *               type:
     *                 type: string
     *                 enum: [original, reply]
     *                 description: Type of the comment (either an original comment or a reply to another comment).
     *               parent_comment_id:
     *                 type: integer
     *                 description: The ID of the parent comment for a reply (required only for replies).
     *     responses:
     *       200:
     *         description: Comment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comment created successfully"
     *                 json:
     *                   type: object
     *                   description: The newly created reply if the comment is a reply.
     *       404:
     *         description: Project or issue not found
     *       500:
     *         description: Error creating comment for the selected issue
     *       503:
     *         description: API error
     */
    async createIssueComment(req, res) {
        try {
            const { project_id, issue_id } = req.params;
            const { user_id } = req.body
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            const user_exist = await User.findByPk(user_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            if (!user_exist) {
                return res.status(401).json({ message: "Error creating comment" });
            }

            try {
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }
                //maybe not all users should be able to comment on an issue?
                //if so, restrections need to be put here
                //type is used to determine, wheather a comment is a reply, or an original comment
                //default value for parent comment id would be 0 for non-reply comment type
                const { content, type, parent_comment_id } = req.body
                const createComment = await Comment.create({ user_id: user_id, content: content })
                const createIssueComment = await IssueComments.create({ issue_id: issue_id, comment_id: createComment.comment_id })
                //This needs to be created for CommentController too, I believe I didn't cover this scenario 
                if (type == "reply") {
                    const createReply = await Reply.create({ comment_id: createComment.comment_id, parent_comment_id: parent_comment_id })
                    const parentComment = await Comment.findByPk(parent_comment_id)
                    return res.status(200).json({ message: "comment created successfully", comment: createReply, parent_comment: parentComment })
                }
                return res.status(200).json({ message: "comment created successfully", json: createComment })

            } catch (error) {
                return res.status(500).json({ message: "Error creating comment for selected issue", error: error.message })
            }


        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }

    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all comments for an issue
     *     description: Retrieve all comments associated with a specific issue within a project.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project the issue is associated with.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the issue whose comments are to be fetched.
     *     responses:
     *       200:
     *         description: Comments returned successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comments returned successfully"
     *                 json:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       comment_id:
     *                         type: integer
     *                         description: The ID of the comment.
     *                       user_id:
     *                         type: integer
     *                         description: The ID of the user who made the comment.
     *                       content:
     *                         type: string
     *                         description: The content of the comment.
     *       404:
     *         description: Project or issue not found
     *       500:
     *         description: Error fetching comments
     *       503:
     *         description: API error
     */
    async getAllIssueComments(req, res) {

        try {
            const { project_id, issue_id } = req.params;
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            try {
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }

                //returns all comments objects in current issue using issuecomments table
                const comments = await IssueComments.findAll({ where: { issue_id: issue_id } })
                if (!comments)
                    return res.status(200).json({ message: "there are no comments for this issue" })

                //promise.all allow us to wait for all the promises i.e. the comments to be returned fully since map inherently doesn't wait
                const allComments = await Promise.all(comments.map(async (comment) => (await Comment.findByPk(comment.comment_id))))
                return res.status(200).json({ message: "comments returned successfully", json: allComments })
            } catch (error) {
                return res.status(500).json({ message: "Error fetching all comments for selected issue", error: error.message })
            }


        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }

    },

    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments/{comment_id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Update a comment for an issue
     *     description: Update the content of a comment if the user owns it, or update up_vote/down_vote based on query parameters.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project to which the issue belongs.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the issue to which the comment belongs.
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
     *           type: string
     *           enum: ['1', '-1']
     *         description: Increment (+1) or decrement (-1) the up_vote count.
     *       - in: query
     *         name: down_vote
     *         required: false
     *         schema:
     *           type: string
     *           enum: ['1', '-1']
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
     *                 comment_id:
     *                   type: string
     *                   description: The ID of the updated comment.
     *                 user_id:
     *                   type: string
     *                   description: The ID of the user who made the update.
     *                 content:
     *                   type: string
     *                   description: The updated content of the comment.
     *                 up_votes:
     *                   type: integer
     *                   description: The updated up_vote count.
     *                 down_votes:
     *                   type: integer
     *                   description: The updated down_vote count.
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
     *         description: Bad request. Either the project, issue, or comment does not exist, or invalid query parameter values were provided.
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
    async updateIssueComment(req, res) {
        try {
            const { project_id, issue_id, comment_id } = req.params;
            const { content, user_id } = req.body
            const { up_vote, down_vote } = req.query;
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            const commentExists = await Comment.findByPk(comment_id)
            const user_exist = await User.findByPk(user_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            if (!commentExists) {
                return res.status(404).json({ message: "Bad request, comment doesn't exist" });
            }
            if (!user_exist) {
                return res.status(401).json({ message: "Error updating comment for selected issue" });
            }


            try {
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }
                var comment = await IssueComments.findOne({ where: { issue_id: issue_id, comment_id: comment_id } })
                if (!comment) {
                    return res.status(404).json({ message: "Bad request, comment doesn't exist under this issue" });

                }

                comment = await Comment.findByPk(comment_id)
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
                return res.status(500).json({ message: "Error updating comment for selected issue", error: error.message })
            }


        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }


    },
    /**
     * @swagger
     * /issues/{project_id}/{issue_id}/comments/{comment_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a comment for an issue
     *     description: Delete a comment if the user owns it.
     *     tags: [Issues]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the project to which the issue belongs.
     *       - in: path
     *         name: issue_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the issue to which the comment belongs.
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
     *                 description: The ID of the user making the delete request.
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
     *         description: Bad request. Either the project, issue, or comment does not exist.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: Internal server error while deleting the comment.
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
    //will have cascade effect
    async deleteIssueComment(req, res) {
        try {
            const { project_id, issue_id, comment_id } = req.params;
            const { user_id } = req.body
            const projectExists = await Project.findByPk(project_id)
            const issueExists = await Issue.findByPk(issue_id)
            const commentExists = await Comment.findByPk(comment_id)
            const user_exist = await User.findByPk(user_id)
            if (!projectExists) {
                return res.status(404).json({ message: "Bad request, project doesn't exist" });
            }
            if (!issueExists) {
                return res.status(404).json({ message: "Bad request, issue doesn't exist" });
            }

            if (!commentExists) {
                return res.status(404).json({ message: "Bad request, comment doesn't exist" });
            }
            if (!user_exist) {
                return res.status(401).json({ message: "Error deleting comment for selected issue" });
            }

            try {
                const issue = await Issue.findOne({ where: { project_id: project_id, issue_id: issue_id } })
                if (!issue) {
                    return res.status(404).json({ message: "Bad request, issue doesn't exist under this project" });
                }
                const comment = await IssueComments.findOne({ where: { issue_id: issue_id, comment_id: comment_id } })
                if (!comment) {
                    return res.status(404).json({ message: "Bad request, comment doesn't exist under this issue" });

                }

                let placeHolder = commentExists.content
                if (commentExists.user_id != user_id) {
                    return res.status(401).json({ message: "you are not the owner of the comment to delete it!" });
                }
                //need to configure cascade deletion
                await Comment.destroy({ where: { comment_id: comment_id } })
                return res.status(200).json({ message: "comment starting with: " + placeHolder.substring(0, 25) + "... has been deleted successfully " })


            } catch (error) {
                return res.status(500).json({ message: "Error deleting comment for selected issue", error: error.message })
            }


        } catch (error) {
            return res.status(503).json({ message: "API error", error: error.message });
        }

    },

};

export default IssueController