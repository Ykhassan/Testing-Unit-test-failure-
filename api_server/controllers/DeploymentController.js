import { Deployment, Project, Connection } from '../models/index.js'

const DeploymentController = {
    /**
     * @swagger
     * /deployments/{project_id}:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Create a new deployment for a project
     *     description: Create a new deployment associated with a specific project using the project ID.
     *     tags: [Deployments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project for which to create the deployment.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: integer
     *                 description: The ID of the user creating the deployment.
     *                 example: user_1
     *               version:
     *                 type: string
     *                 description: The version of the deployment.
     *                 example: "1.0.0"
     *               connection_id:
     *                 type: integer
     *                 description: The ID of the connection.
     *                 example: 456
     *     responses:
     *       200:
     *         description: Successfully created the deployment.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deployment'
     *       400:
     *         description: Connection is not active or invalid data provided.
     *       404:
     *         description: Project or connection not found.
     *       500:
     *         description: Internal server error while creating the deployment.
     */

    async createDeployment(req, res) {
        // query params :project_id
        // I must check also weather the project belong to the user || he is a collaborator with the respected permissions
        // Some checks can be at client side, to check weather the connection is valid for the project cloud_provider (I think the connection status also can be done client side)
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // else{
        // return created   
        // }
        try {
            const { user_id, version, connection_id } = req.body;
            const project_id = req.params.project_id;
            const cloud_provider = await Project.findOne({ where: { project_id: req.params.project_id, user_id: user_id }, attributes: ['cloud_provider'] });
            if (!cloud_provider) {
                return res.status(404).json({ message: 'Project not found' });
            }
            const connection_status = await Connection.findOne({ where: { connection_id: connection_id }, attributes: ['status'] });
            if (!connection_status) {
                return res.status(404).json({ message: 'No connection found' });
            }
            if (connection_status.dataValues.status === "active") {
                const provider = cloud_provider.dataValues.cloud_provider;
                const status = 'sucessfull';
                const total_duration = '3 seconds';
                const deployments = await Deployment.create({ user_id, project_id, status, provider, version, total_duration, connection_id });
                return res.status(200).json(deployments);
            }
            else {
                return res.status(400).json({ message: 'Error creating deployment connection is not active' });
            }
        } catch (error) {
            res.status(500).json({ message: "Error creating deployments", error: error.message });
        }
    },
    /**
     * @swagger
     * /deployments/{project_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve all deployments for a specific project
     *     description: Fetches all deployments associated with a given project ID. The user is authenticated via the Authorization header.
     *     tags: [Deployments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The unique identifier of the project for which deployments are being retrieved.
     *     responses:
     *       200:
     *         description: A list of deployments for the specified project.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Deployment'
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching deployments."
     *                 error:
     *                   type: string
     *                   example: "Detailed error message."
     */

    async getAllProjectDeployments(req, res) {
        // query params :project_id (user_id already exsist in authheader)
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permession
        // }
        // else{
        // return deployments   
        // }
        try {
            const deployments = await Deployment.findAll({ where: { project_id: req.params.project_id } });
            return res.status(200).json(deployments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching deployments", error: error.message });
        }
    },
    /**
     * @swagger
     * /deployments/{project_id}/{deployment_id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get a specific deployment by ID for a project
     *     description: Retrieve a deployment associated with a specific project using both project and deployment IDs.
     *     tags: [Deployments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project to fetch the deployment for.
     *       - in: path
     *         name: deployment_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the deployment to retrieve.
     *     responses:
     *       200:
     *         description: Deployment found for the specified project.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deployment'
     *       404:
     *         description: Deployment not found for the specified project.
     *       500:
     *         description: Internal server error while fetching deployment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: integer
     *                   example: Error fetching deployment.
     *                 error:
     *                   type: integer
     *                   example: Detailed error message.
     */
    async getDeploymentById(req, res) {
        // query params :project_id/:deployment_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permession
        // }
        // else{
        // return deployment   
        // }
        try {
            const deployments = await Deployment.findOne({ where: { project_id: req.params.project_id, deployment_id: req.params.deployment_id } });
            if (deployments) {
                return res.status(200).json(deployments);
            }
            else {
                return res.status(404).json({message: 'Deployment not found'});
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching deployment", error: error.message });
        }
    },
    /**
     * @swagger
     * /deployments/{project_id}/{deployment_id}/cancel:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     summary: Cancel a deployment
     *     description: Updates the status of a specific deployment to "canceled" for the given project and deployment ID.
     *     tags: [Deployments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project to which the deployment belongs.
     *       - in: path
     *         name: deployment_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the deployment to cancel.
     *     responses:
     *       204:
     *         description: Deployment successfully canceled.
     *       404:
     *         description: Deployment not found for the specified project.
     *       500:
     *         description: Internal server error while canceling the deployment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: integer
     *                   example: Error canceling deployment.
     *                 error:
     *                   type: integer
     *                   example: Detailed error message.
     */
    async cancelDeployment(req, res) {
        // query params :project_id/:deployment_id/cancel
        // change status
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permession
        // }
        // else{
        // return canceled   
        // }
        try {
            // const project_id = req.params.project_id; // where will I use this?, I might use it to check weather the user owns, or a collaborator with suitable permssions 
            // const deployment_id = req.params.deployment_id;
            const [canceled] = await Deployment.update({ status: 'canceled' }, { where: { deployment_id: req.params.deployment_id, project_id: req.params.project_id } });
            if (canceled) {
                return res.status(204).json({ message: 'Deployment canceled'});
            }
            else {
                return res.status(404).json({ message: 'Deployment not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Error canceling deployment", error: error.message });
        }
    },
    /**
     * @swagger
     * /deployments/{project_id}/{deployment_id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     summary: Delete a specific deployment
     *     description: Deletes a deployment based on the given project and deployment IDs.
     *     tags: [Deployments]
     *     parameters:
     *       - in: path
     *         name: project_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the project to which the deployment belongs.
     *       - in: path
     *         name: deployment_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the deployment to delete.
     *     responses:
     *       204:
     *         description: Successfully deleted the deployment.
     *       404:
     *         description: Deployment not found for the specified project and deployment ID.
     *       500:
     *         description: Internal server error while deleting the deployment.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: integer
     *                   example: Error deleting deployment.
     *                 error:
     *                   type: integer
     *                   example: Detailed error message.
     */
    async deleteDeployment(req, res) {
        // query params :project_id/:deployment_id'
        // I might need to check if exsisting deployments are using this connection!
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
        // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permession
        // }
        // else{
        // return deleted 
        try {
            const deleted = await Deployment.destroy({ where: { deployment_id: req.params.deployment_id, project_id: req.params.project_id } });
            if (deleted) {
                return res.status(204).json({ message:'Deployment deleted' });
            }
            else {
                return res.status(404).json({ message: 'Deployment not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting deployment", error: error.message });
        }
    }
};

export default DeploymentController;