[![codecov](https://codecov.io/gh/UsableSystemsLab/cdhub/graph/badge.svg?token=vIRfeXqXjk)](https://codecov.io/gh/UsableSystemsLab/cdhub)
![Unit test workflow status](https://github.com/UsableSystemsLab/cdhub/actions/workflows/unitTest.yml/badge.svg)

## Usage

```
cd ../
docker compose up
curl 'http://localhost:4000/api/health' --header 'Authorization: Bearer API_TOKEN_GOES_HERE'
```

### Test

```shell
docker exec -it api_server_container npm test
```

# API endpoints

### Users

- `POST /users`: Create a new user
- `GET /users`: List all users
- `GET /users/:user_id`: Get a specific user details by id 
- `PUT /users/:user_id`: Update a specific user details by id
- `DELETE /users/:user_id`: Delete a specific user by id

### Connections

- `POST /connections/:user_id`: Create a new connection for a user
- `GET /connections/:user_id`: Get all connection for a specific user
- `GET /connections/:user_id/:connection_id`: Get a specific connection by id
- `PUT /connections/:user_id/:connection_id`: Update a specific connection by id
- `DELETE /connections/:user_id/:connection_id`: Delete a specific connection by id

### Search

- `GET /search/projects?q=projectName`: Find projects with many criteria
- `GET /search/users?q=usernameORname`: Find users with many criteria

### Projects

- `POST /projects/:user_id`: Create a new project
- `GET /projects/:user_id`: Get all projects
- `GET /projects/:user_id/:project_id`: Get a specific project
- `PUT /projects/:user_id/:project_id`: Update a specific project by id
- `DELETE /projects/:user_id/:project_id`: Delete a specific project by id

### Files

- `POST /files/:project_id`: Add, upload a new file in a project
- `GET /files/:project_id`: Get all files for a project
- `GET /files/:project_id/:file_id`: Get a specific file
- `PUT /files/:project_id/:file_id`: Update a specific file by id
- `DELETE /files/:project_id/:file_id`: Delete a specific file by id

### Deployments

- `POST /deployments/:project_id`: Start a new deployment for a project
- `GET /deployments/:project_id`: Get all deployments for a project
- `GET /deployments/:project_id/:deployment_id`:  Get a specific deployment by id
- `PUT /deployments/:project_id/:deployment_id/cancel`: Cancel an ongoing deployment
- `DELETE /deployments/:project_id/:deployment_id`: Delete a specific deployment

### Issues

- `POST /issues/:project_id`: Create a new issue on a specific project
- `GET /issues/:project_id`: Get all issues on a specific project
- `GET /issues/:project_id/:issue_id`: Get a specific issue by id
- `PUT /issues/:project_id/:issue_id`: Update a specific issues by id
- `DELETE /issues/:project_id/:issue_id`: Delete a specific issues by id
- `POST /issues/:project_id/:issue_id/comments`: Create a comment under an issue
- `GET /issues/:project_id/:issue_id/comments`: Get the comments under an issue
- `PUT /issues/:project_id/:issue_id/comments/comment_id?actions=[up_vote, remove_up_vote, down_vote, remove_down_vote]`: Update a specific comment under an issue. An optional query action can be provided.
- `Delete /issues/:project_id/:issue_id/comments/comment_id`: Delete a specific comment under an issue

### Comments

- `POST /comments/:project_id`: Create a new comment on a specific project. If in the body there is 'parent_comment_id' then its a reply.
- `GET /comments/:project_id`: Get all comments on a specific project
- `PUT /comments/:project_id/:comment_id?actions=[up_vote, remove_up_vote, down_vote, remove_down_vote]`: Update a specific comment by id. An optional query action can be provided.
- `DELETE /comments/:project_id/:comment_id`: Delete a specific comment by id
