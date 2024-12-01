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
     *         required: true
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
     *       400:
     *         description: Missing search query
     *       500:
     *         description: Error searching projects
     */
    async searchProjects(req, res) {
        try {
            // Access query parameters
            let { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: "Missing search query" });
            }
            const projects = await Project.findAll({
                where: {
                    ...(q && { name: { [Op.iLike]: `%${q}%` } }),
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
     *         name: q
     *         schema:
     *           type: string
     *         required: true
     *         description: The search keyword to filter users by username or full name
     *     responses:
     *       200:
     *         description: A list of users that match the search criteria
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       400:
     *         description: Missing search query
     *       500:
     *         description: Error searching users
     */
    async searchUsers(req, res) {
        try {
            // Access query parameters
            let { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: "Missing search query" });
            }
            const users = await User.findAll({
                where: {
                    ...(q && {
                        [Op.or]: [
                            { username: { [Op.iLike]: `%${q}%` } },
                            { fullname: { [Op.iLike]: `%${q}%` } }
                        ]
                    }),
                }
            });

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error searching users", error: error.message });
        }
    }
};

export default SearchController;