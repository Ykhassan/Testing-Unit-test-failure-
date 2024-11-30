import { Project, User } from "../models/index.js"
import { Op } from "sequelize";

const SearchController = {

    /**
     * @swagger
     * /search/projects:
     *   get:
     *     summary: Search for projects
     *     description: Retrieve a list of projects that match the search criteria.
     *     tags: [Search]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         required: false
     *         description: The search keyword to filter projects by name
     *     responses:
     *       200:
     *         description: A list of projects that match the search criteria
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Project'
     *       500:
     *         description: Error searching projects
     */
    async searchProjects(req, res) {
        // Access query parameters
        let { q } = req.query;
        q = q.trim().toLowerCase();

        try {
            const projects = await Project.findAll({
                where: {
                    ...(q && { name: { [Op.like]: `%${q}%` } }),
                    visibility: "public"
                },
                // attributes: { exclude: ["blob_url"] },
                // attributes: ['project_id', 'name', 'description'],
            });

            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ message: "Error searching projects", error: error.message });
        }
    },

    /**
     * @swagger
     * /search/users:
     *   get:
     *     summary: Search for users
     *     description: Retrieve a list of users that match the search criteria.
     *     tags: [Search]
     *     parameters:
     *       - in: query
     *         name: username
     *         schema:
     *           type: string
     *         required: false
     *         description: The search keyword to filter users by name
     *     responses:
     *       200:
     *         description: A list of users that match the search criteria
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       500:
     *         description: Error searching users
     */
    async searchUsers(req, res) {
        // Access query parameters
        let { username } = req.query;
        username = username.trim().toLowerCase();

        try {
            const users = await User.findAll({
                where: {
                    ...(username && { username: { [Op.like]: `%${username}%` } }),
                }
            });

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error searching users", error: error.message });
        }
    }
};

export default SearchController;