import User from './User.js';
import Project from './Project.js';
import Tag from './Tag.js';
import ProjectTags from './ProjectTags.js';
import Connection from './Connection.js';
import Clone from './Clone.js';
import Branch from './Branch.js';
import Commit from './Commit.js';
import Collaborator from './Collaborator.js';

// Associations
// User has many Connections
User.hasMany(Connection);
Connection.belongsTo(User);

// User has many Projects
User.hasMany(Project, { foreignKey: 'user_id'});
Project.belongsTo(User, { foreignKey: 'user_id'});

// Projects have many Tags (many-to-many relationship)
Project.belongsToMany(Tag, { through: ProjectTags, foreignKey: 'project_id'});
Tag.belongsToMany(Project, { through: ProjectTags, foreignKey: 'tag_id'});

// Project has many Branches
Project.hasMany(Branch, { foreignKey: 'project_id'})
Branch.belongsTo(Project, { foreignKey: 'project_id'})

// User has many Commits
User.hasMany(Commit, { foreignKey: 'user_id'})
Commit.belongsTo(User, { foreignKey: 'user_id'})
// Branch has many Commits
Branch.hasMany(Commit, { foreignKey: 'branch_id'})
Commit.belongsTo(Branch, {foreignKey: 'branch_id'})

// Project has many Clones, and a cloned project have one parent project (self-referential relationship)
Project.hasOne(Clone, { foreignKey: 'project_id'});
Clone.belongsTo(Project, { foreignKey: 'project_id'});
Project.hasMany(Clone, { foreignKey: 'parent_project_id'});
Clone.belongsTo(Project, { foreignKey: 'parent_project_id'});

// User contributes to many Branches through Collaborator (many-to-many relationship)
User.belongsToMany(Branch, { through: Collaborator, foreignKey: 'user_id'})
Branch.belongsToMany(User, { through: Collaborator, foreignKey: 'branch_id'})


export {
    User,
    Connection,
    Project,
    Tag,
    ProjectTags,
    Clone,
    Branch,
    Commit,
    Collaborator
};