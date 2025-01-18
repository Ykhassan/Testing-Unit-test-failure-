import { Project } from "../models/index.js";

const ProjectController = {
    /**
     * @swagger
     * /projects/{user_id}:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a new project
     *     description: Creates a new project with the specified attributes.
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the user who owns the project.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The name of the project.
     *                 example: My New Project
     *               description:
     *                 type: string
     *                 description: A description of the project.
     *                 example: A detailed project description.
     *               visibility:
     *                 type: string
     *                 description: The visibility of the project (e.g., public or private).
     *                 example: public
     *               cloud_provider:
     *                 type: string
     *                 description: The cloud provider for the project.
     *                 example: AWS
     *     responses:
     *       200:
     *         description: Project successfully created.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Project created
     *       500:
     *         description: Server error while creating the project.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Error creating project
     *                 error:
     *                   type: string
     *                   example: Detailed error message
     */
    async createProject(req, res) {
        // query params = user_id
        // Check if the authenticated user is the same to whom he wants to delete
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" });
        // }
        try {
            // remaining attributes {like_cound, durability, aviliablity, blob_url, estimated_cost}
            // I might need to check if the project already exsisted (name) so many check😒
            const user_id = req.params.user_id;
            const blob_url = 'blob:https://example.com/123e4567-e89b-12d3-a456-426614174000'
            const { name, description, visibility, cloud_provider } = req.body
            const project = await Project.create({ user_id, name, description, visibility, blob_url, cloud_provider });
            return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json({ message: "Error creating project", error: error.message });
        }
    },
    /**
     * @swagger
     * /projects/{user_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all projects for a user
     *     description: Retrieve all projects associated with a specific user by their unique ID.
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the user who owns the project.
     *     responses:
     *       200:
     *         description: A list of projects belonging to the user.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Project'
     *       500:
     *         description: An error occurred while fetching the projects.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Error fetching projects
     *                 error:
     *                   type: string
     *                   example: Detailed error message
     */
    async getAllUserProjects(req, res) {
        // query params :user_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in to display info
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions 
        // }
        // else{
        // return all project data with editing Permissions   
        // }
        // check for the user exsistance!!! 😒
        try {
            const userProjects = await Project.findAll({ where: { user_id: req.params.user_id } });
            return res.status(200).json(userProjects);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching projects", error: error.message });
        }
    },
    /**
     * @swagger
     * /projects/{user_id}/{project_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get project by ID
     *     description: Retrieve a specific project by its ID. If the authenticated user's ID matches the `user_id`, private information is also retrieved.
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project to retrieve.
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the user who owns the project.
     *     responses:
     *       200:
     *         description: Project retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Project'
     *       404:
     *         description: Project not found.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Project not found.
     *       500:
     *         description: Server error while retrieving the project.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Error fetching project.
     *                 error:
     *                   type: string
     *                   example: Detailed error message.
     */
    async getProjectById(req, res) {
        // query params :user_id/:project_id {here is where i check when user_id==authnticated user retrive private informations and allow to update}
        // when user_id dont match those in projects it will retrun and empty response
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in to display info
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permissions
        // }
        // else{
        // return projcte with all its details    
        // }
        try {
            const userProject = await Project.findOne({ where: { project_id: req.params.project_id, user_id: req.params.user_id } });
            if (userProject) {
                return res.status(200).json(userProject);
            }
            else {
                return res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching project", error: error.message });
        }
    },
    /**
 * @swagger
 * /projects/{user_id}/{project_id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update project by ID
 *     description: Updates a specific project by its ID. Requires the user to be authenticated and authorized to modify the project.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project to update.
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the project.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the project.
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 description: The updated description of the project.
 *                 example: Updated project description.
 *               visibility:
 *                 type: string
 *                 description: The updated visibility (e.g., public or private).
 *                 example: private
 *               cloud_provider:
 *                 type: string
 *                 description: The updated cloud provider.
 *                 example: GCP
 *     responses:
 *       204:
 *         description: Project updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

    async updateProject(req, res) {
        // query params :user_id/:project_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permissions
        // }
        // else{
        // return updated  😊
        // }
        try {
            const [updated] = await Project.update(req.body, {
                where: { project_id: req.params.project_id, user_id: req.params.user_id }
            });
            if (updated) {
                const updatedProject = await Project.findByPk(req.params.project_id);
                res.status(200).json({ message: 'Updated project' });
            } else {
                res.status(404).json({ message: "Project not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating project", error: error.message });
        }
    },
    /**
     * @swagger
     * /projects/{user_id}/{project_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a project
     *     description: Deletes a project by its ID and the user's ID. Requires user authentication.
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project to delete.
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the user who owns the project.
     *     responses:
     *       204:
     *         description: Project deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Project deleted.
     *       404:
     *         description: Project not found.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Project not found.
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Error deleting project.
     *                 error:
     *                   type: string
     *                   example: Detailed error message.
     */
    async deleteProject(req, res) {
        // there should be cascade deletion activated
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permissions
        // }
        // else{
        // return deleted  😊
        // }
        try {
            const deleted = await Project.destroy({ where: { project_id: req.params.project_id, user_id: req.params.user_id } })
            if (deleted) {
                return res.status(204).json({ message: 'Project deleted' });
            }
            else {
                res.status(404).json({ message: "Project not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting project", error: error.message });
        }
    }

};

export default ProjectController;