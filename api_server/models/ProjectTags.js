import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectTags:
 *       type: object
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The unique identifier for the project.
 *         tag_id:
 *           type: integer
 *           description: The unique identifier for the tag.
 *       required:
 *         - project_id
 *         - tag_id
 *       example:
 *         project_id: 1
 *         tag_id: 1
 */
const ProjectTags = sequelize.define('ProjectTags', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
}, {
    tableName: 'Projects_tags',
    schema: 'public',
    timestamps: true
});

export default ProjectTags;