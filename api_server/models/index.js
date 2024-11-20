import User from './User.js';
import Project from './Project.js';
import Tag from './Tag.js';
import Connection from './Connection.js';
import Branch from './Branch.js';
import Commit from './Commit.js';
import Collaborator from './Collaborator.js';
// Associations
User.hasMany(Connection);
Connection.belongsTo(User);

User.hasMany(Project, { foreignKey: 'user_id'});
Project.belongsTo(User, { foreignKey: 'user_id'});

Project.belongsToMany(Tag, {through: 'ProjectTags'})
Tag.belongsToMany(Project, {through: 'ProjectTags'})

Project.hasMany(Branch, { foreignKey: 'project_id'})
Branch.belongsTo(Project, { foreignKey: 'project_id'})

User.hasMany(Commit, { foreignKey: 'user_id'})
Commit.belongsTo(User, { foreignKey: 'user_id'})

Branch.hasMany(Commit, { foreignKey: 'branch_id'})
Commit.belongsTo(Branch, {foreignKey: 'branch_id'})

User.hasMany(Collaborator, { foreignKey: 'user_id'})
Collaborator.belongsTo(User, { foreignKey: 'user_id'})

//specifying forign key in many to many might be needed in case of a confliction with sequlize base naming for keys
User.belongsToMany(Branch, { through: 'Collaborator'})
Branch.belongsToMany(User, { through: 'Collaborator'})


export {
    User,
    Connection,
    Project,
    Tag,
    Branch,
    Commit,
    Collaborator
};