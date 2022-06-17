﻿using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Projects;
using Taskly.Application.Projects.Commands.AddNewTask;
using Taskly.Application.Projects.Commands.DeleteTask;
using Taskly.Application.Projects.Queries;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/projects")]
    public class ProjectsController : BaseController
    {
        [HttpGet]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetProjects()
        {            
            var res = await Mediator.Send(new GetProjectsShortInfoRequest());
            return Ok(res);
        }

        [HttpGet("{id}")]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetProject(int id)
        {            
            var res = await Mediator.Send(new GetProjectsDetailedInfoRequest{
                ProjectId = id
            });
            return Ok(res);
        }

        [HttpGet("defaultEstimations")]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetDefaultTaskEstimations()
        {            
            var res = await Mediator.Send(new GetDefaultTaskEstimationsRequest());
            return Ok(res);
        }

        [HttpPost()]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProjectTaskVm>> AddNewTask([FromBody]int projectId)
        {            
            var res = await Mediator.Send(new AddNewTaskRequest{
                ProjectId = projectId
            });

            return res;
        }

        [HttpDelete()]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> DeleteTask([FromBody]Guid taskId)
        {            
            await Mediator.Send(new DeleteTaskRequest{
                TaskId = taskId
            });

            return Ok(new object());
        }
    }
}
