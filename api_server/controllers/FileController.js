import { where } from "sequelize";
import { Project } from "../models/index.js";

const FileController= {
/**
 * @swagger
 * /files/{project_id}:
 *   post:
 *     summary: Create a new file for a specific project.
 *     description: Fetches the blob URL of a project by its ID and creates a new file associated with the project.
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project for which the file is being created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_name:
 *                 type: string
 *                 description: The name of the file to create.
 *                 example: new_file.tf
 *               content:
 *                 type: string
 *                 description: The content of the file.
 *                 example: "resource \"aws_instance\" \"example\" { ... }"
 *     responses:
 *       200:
 *         description: File created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File created
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating file
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
    async createFile(req, res){
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
                // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // query params :project_id 
        // [DANGER] must see how to create a file, what to return to user...
        try{
            // fetch files blob
            const blob_url = await Project.findOne({attributes: ['blob_url'], where: {project_id: req.params.project_id}});
            if (blob_url){
                // create file logic
                // logic to push the created file
                return res.status(200).json(req.body);
            }
            else {
                return res.status(404).json({message: 'Project not found'})
            }
        }catch(error){
            res.status(500).json({ message: "Error creating file", error: error.message });
        }

    },
/**
 * @swagger
 * /files/{project_id}:
 *   get:
 *     summary: Retrieve all files for a specific project.
 *     description: Fetches the blob URL of a project by its ID and retrieves all files associated with the project.
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project whose files are being retrieved.
 *     responses:
 *       200:
 *         description: Files retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     description: The name of the file.
 *                     example: main.tf
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching all project files
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
    async getAllProjectFiles(req, res){
        // query params :project_id 
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
                // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // else{
        // return all project data with editing Permissions   
        // }
        try{
            // fetch files blob
            const blob_url = await Project.findOne({attributes: ['blob_url'], where: {project_id: req.params.project_id}});
            if (blob_url){
                // logic to fetch files from blob 
                // if (found){
                    const files = [{file: "main.tf"}]
                    return res.status(200).json(files);
                // }
                // else {
                    // return res.status(404).json({message: 'No files found'});
                // }
            }
            else {
                return res.status(404).json({message: 'Project not found'})
            }
        }catch(error){
            res.status(500).json({ message: "Error fetching all project files", error: error.message });
        }
    },
/**
 * @swagger
 * /files/{project_id}/{file_id}:
 *   get:
 *     summary: Retrieve a specific file by its ID for a given project.
 *     description: Fetches the blob URL of a project by its ID, retrieves a specific file by its ID, and returns the file information.
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project.
 *       - in: path
 *         name: file_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to retrieve.
 *     responses:
 *       200:
 *         description: File retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     description: The ID of the retrieved file.
 *                     example: "file123"
 *       404:
 *         description: Project or file not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching file by ID
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
    async getFileById(req, res){
        // query params :project_id /:file_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
                // Must sign in
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // else{
        // return all project data with editing Permissions   
        // }
        try{
            // fetch files blob
            const blob_url = await Project.findOne({attributes: ['blob_url'], where: {project_id: req.params.project_id}});
            if (blob_url){
                // logic to fetch file by ID from blob 
                // if (found){
                    const files = [{file: req.params.file_id}]
                    return res.status(200).json(files);
                // }
                // else {
                    // return res.status(404).json({message: 'File not found'});
                // }
            }
            else {
                return res.status(404).json({message: 'Project not found'})
            }
        }catch(error){
            res.status(500).json({ message: "Error fetching file by ID", error: error.message });
        }
    },
/**
 * @swagger
 * /files/{project_id}/{file_id}:
 *   put:
 *     summary: Update a specific file for a given project.
 *     description: Updates the content of a file by its ID for a specific project.
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project.
 *       - in: path
 *         name: file_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to update.
 *     responses:
 *       204:
 *         description: File updated successfully.
 *       404:
 *         description: Project or file not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating file
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
    async updateFile(req, res){
        // query params :project_id /:file_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
                // Must sign in 
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // else{
        // return updated   
        // }
        try{
            // fetch files blob
            const blob_url = await Project.findOne({attributes: ['blob_url'], where: {project_id: req.params.project_id}});
            if (blob_url){
                // logic to fetch file by ID from blob 
                // if (found){
                    // logic to update the file
                    return res.status(200).json({message:'File update'});
                // }
                // else {
                    // return res.status(404).json({message: 'File not found'});
                // }
            }
            else {
                return res.status(404).json({message: 'Project not found'})
            }
        }catch(error){
            res.status(500).json({ message: "Error updating file", error: error.message });
        }
    },
/**
 * @swagger
 * /files/{project_id}/{file_id}:
 *   delete:
 *     summary: Delete a specific file for a given project.
 *     description: Fetches the blob URL of a project by its ID, retrieves the specific file by its ID, and deletes it.
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project.
 *       - in: path
 *         name: file_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to delete.
 *     responses:
 *       204:
 *         description: File deleted successfully.
 *       404:
 *         description: Project or file not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting file
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
    async deleteFile(req, res){
        // query params :project_id /:file_id
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated" }); 
                // Must sign in
        // }
        // if (req.user.user_id !== req.params.user_id) {
        //     check if he is a collaborator with permessions
        // }
        // else{
        // return deleted   
        // }
        try{
            // fetch files blob
            const blob_url = await Project.findOne({attributes: ['blob_url'], where: {project_id: req.params.project_id}});
            if (blob_url){
                // logic to fetch file by ID from blob 
                // if (found){
                    // logic to update the file
                    return res.status(204).json({message:'File deleted'});
                // }
                // else {
                    // return res.status(404).json({message: 'File not found'});
                // }
            }
            else {
                return res.status(404).json({message: 'Project not found'})
            }
        }catch(error){
            res.status(500).json({ message: "Error deleting file", error: error.message });
        }
        
    }
};

export default FileController;