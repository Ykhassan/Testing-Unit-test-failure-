import {Connection} from '../models/index.js'

const ConnectionController = {

    /**
     * @swagger
     * /connections/{user_id}:
     *   post:
     *     security:
     *      - bearerAuth: []
     *     summary: Create a new connection for a user
     *     description: Create a new connection with the provided information.
     *     tags: [Connections]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Connection'
     *     responses:
     *       201:
     *         description: Connection created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Connection'
     *       400:
     *         description: Bad request
     */
    async createConnection(req, res){
        try {
            // Check if the authenticated user is the same to whom he wants to create a connection for
            // if (!req.user) {
            //     return res.status(401).json({ message: "User not authenticated" });
            // }
            // if (req.user.user_id !== req.params.user_id) {
            //     return res.status(403).json({ message: "You are not authorized to create a connection" });
            // }
            const user_id = req.params.user_id;
            const { name, cloud_provider,  status, details } = req.body;
            const newConnection = await Connection.create({ user_id, name, cloud_provider,  status, details });
            res.status(201).json(newConnection);
        } catch (error) {
            res.status(400).json({ message: "Error creating connection", error: error.message });
        }
    },

    /**
     * @swagger
     * /connections/{user_id}:
     *   get:
     *     summary: Get all connections for a user
     *     description: Retrieve all connections associated with the specified user ID.
     *     tags: [Connections]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose connections are to be retrieved
     *     responses:
     *       200:
     *         description: A list of connections
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Connection'
     *       401:
     *         description: User not authenticated
     *       403:
     *         description: User not authorized to fetch connections
     *       500:
     *         description: Error fetching connections
     */
    async getAllUserConnections(req, res){
        try {
            // Check if the authenticated user is the same to whom he wants to fetch connections for
            // if (!req.user) {
            //     return res.status(401).json({ message: "User not authenticated" });
            // }
            // if (req.user.user_id !== req.params.user_id) {
            //     return res.status(403).json({ message: "You are not authorized to get the connections" });
            // }
            const connections = await Connection.findAll({ where: { user_id: req.params.user_id } });
            res.status(200).json(connections);
        } catch (error) {
            res.status(500).json({ message: "Error fetching connections", error: error.message });
        }
    },

    /**
     * @swagger
     * /connections/{user_id}/{connection_id}:
     *   get:
     *     summary: Get a specific connection by ID for a user
     *     description: Retrieve a specific connection associated with the specified user ID and connection ID.
     *     tags: [Connections]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose connection is to be retrieved
     *       - in: path
     *         name: connection_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the connection to be retrieved
     *     responses:
     *       200:
     *         description: Connection retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Connection'
     *       401:
     *         description: User not authenticated
     *       403:
     *         description: User not authorized to fetch the connection
     *       404:
     *         description: Connection not found
     *       500:
     *         description: Error fetching connection
     */
    async getConnectionById(req, res){
        try {
            // Check if the authenticated user is the same to whom he wants to fetch connections for
            // if (!req.user) {
            //     return res.status(401).json({ message: "User not authenticated" });
            // }
            // if (req.user.user_id !== req.params.user_id) {
            //     return res.status(403).json({ message: "You are not authorized to get a connection" });
            // }
            // [DANGER] if not {if (req.user.user_id !== req.params.user_id)}, any user can fetch any connection, we can use findOne with where clause
            const connection = await Connection.findOne({ where: { user_id: req.params.user_id, connection_id: req.params.connection_id } });
            if (connection) {
                res.status(200).json(connection);
            } else {
                res.status(404).json({ message: "Connection not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching connection", error: error.message });
        }
    },

    /**
     * @swagger
     * /connections/{user_id}/{connection_id}:
     *   put:
     *     summary: Update a specific connection by ID for a user
     *     description: Update a specific connection associated with the specified user ID and connection ID.
     *     tags: [Connections]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose connection is to be updated
     *       - in: path
     *         name: connection_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the connection to be updated
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Connection'
     *     responses:
     *       200:
     *         description: Connection updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Connection'
     *       400:
     *         description: Error updating connection
     *       401:
     *         description: User not authenticated
     *       403:
     *         description: User not authorized to update the connection
     *       404:
     *         description: Connection not found
     */
    async updateConnection(req, res){
        try {
            // Check if the authenticated user is the same to whom he wants to fetch connections for
            // if (!req.user) {
            //     return res.status(401).json({ message: "User not authenticated" });
            // }
            // if (req.user.user_id !== req.params.user_id) {
            //     return res.status(403).json({ message: "You are not authorized to update a connection" });
            // }
            const [updated] = await Connection.update(req.body, {
                where: { user_id: req.params.user_id, connection_id: req.params.connection_id }
            });
            if (updated) {
                const updatedConnection = await Connection.findByPk(req.params.connection_id);
                res.status(200).json(updatedConnection);
            } else {
                res.status(404).json({ message: "Connection not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating connection", error: error.message });
        }
    },

    /**
     * @swagger
     * /connections/{user_id}/{connection_id}:
     *   delete:
     *     summary: Delete a specific connection by ID for a user
     *     description: Delete a specific connection associated with the specified user ID and connection ID.
     *     tags: [Connections]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose connection is to be deleted
     *       - in: path
     *         name: connection_id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the connection to be deleted
     *     responses:
     *       204:
     *         description: Connection deleted successfully
     *       401:
     *         description: User not authenticated
     *       403:
     *         description: User not authorized to delete the connection
     *       404:
     *         description: Connection not found
     *       500:
     *         description: Error deleting connection
     */
    async deleteConnection(req, res){
        try {
            // Check if the authenticated user is the same to whom he wants to fetch connections for
            // if (!req.user) {
            //     return res.status(401).json({ message: "User not authenticated" });
            // }
            // if (req.user.user_id !== req.params.user_id) {
            //     return res.status(403).json({ message: "You are not authorized to delete a connection" });
            // }
            const deleted = await Connection.destroy({
                where: { user_id: req.params.user_id, connection_id: req.params.connection_id }
            });
            if (deleted) {
                res.status(204).json({ message: "Connection deleted" });
            } else {
                res.status(404).json({ message: "Connection not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting connection", error: error.message });
        }
    }
};

export default ConnectionController;