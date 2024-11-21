import User from './User.js';
import Project from './Project.js';
import Tag from './Tag.js';
import ProjectTags from './ProjectTags.js';
import Connection from './Connection.js';
import Clone from './Clone.js';
import Branch from './Branch.js';
import Commit from './Commit.js';
import Collaborator from './Collaborator.js';
import Comment from './Comment.js';
import Reply from './Reply.js';
import Issue from './Issue.js'
import IssueComments from './IssueComments.js';
import ProjectComments from './ProjectComments.js';
import Deployment from './Deployment.js';

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

// User has many deployments   
User.hasMany(Deployment, { foreignKey: 'user_id' })
Deployment.belongsTo(User, { foreignKey: 'user_id' })

// Projects have multiple deployments 
Project.hasMany(Deployment, { foreignKey: 'project_id' })
Deployment.belongsTo(Project, { foreignKey: 'project_id' })

// Deployments have multiple connection
Connection.hasMany(Deployment, {foreignKey: 'connection_id'})
Deployment.belongsTo(Connection, {foreignKey: 'connection_id'})

// User has multiple comments
User.hasMany(Comment, { foreignKey: 'user_id' })
Comment.belongsTo(User, { foreignKey: 'user_id' })

// User creates multiple Issues
User.hasMany(Issue, { foreignKey: 'user_id' })
Issue.belongsTo(User, { foreignKey: 'user_id' })

// Project has many Issues
Project.hasMany(Issue, { foreignKey: 'project_id' })
Issue.belongsTo(Project, { foreignKey: 'project_id' })

// Comments heve multiple replies
Comment.hasOne(Reply, {foreignKey: 'comment_id'})
Reply.belongsTo(Comment, {foreignKey: 'comment_id'})
Comment.hasMany(Reply, {foreignKey: 'parent_comment_id'})
Reply.belongsTo(Comment, {foreignKey: 'parent_comment_id'})

//Issue has multiple comments
Comment.hasOne(IssueComments, { foreignKey: 'comment_id' })
IssueComments.belongsTo(Comment, {foreignKey: 'comment_id' })
Issue.hasMany(IssueComments, {foreignKey: 'issue_id'})
IssueComments.belongsTo(Issue, {foreignKey: 'issue_id'})

//Project has multiple comments 
Project.hasOne(ProjectComments, {foreignKey: 'comment_id'})
ProjectComments.belongsTo(Comment, {foreignKey: 'comment_id'})
Project.hasMany(ProjectComments, {foreignKey: 'project_id'})
ProjectComments.belongsTo(Project, {foreignKey: 'project_id'})


export {
    User,
    Connection,
    Project,
    Tag,
    ProjectTags,
    Clone,
    Branch,
    Commit,
    Collaborator,
    Comment,
    Reply,
    ProjectComments,
    Issue,
    IssueComments,
    Deployment
};