using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.Queries
{
    public class GetDepartmentUsersRequestHandler : IRequestHandler<GetDepartmentUsersRequest, DepartmentUserVm>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetDepartmentUsersRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DepartmentUserVm> Handle(GetDepartmentUsersRequest request, CancellationToken cancellationToken)
        {
            var root = new DepartmentUserVm()
            {
                Id = Guid.NewGuid(),
                Name = "Departments",
                Children = new List<DepartmentUserVm>()
            };

            var deps = await _dbContext.Departments.OrderBy(i => i.ParentDepartmentId).Include(u => u.ParentDepartment).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);
            var users = await _dbContext.Users.Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);

            HandleDepartment(null, root, deps, users);        

            return await Task.FromResult(root);
        }

        private void HandleDepartment(Guid? parentId, DepartmentUserVm parentVm, List<Domain.Department> deps, List<Domain.User> users)
        {
            var childs = deps.Where(i => i.ParentDepartmentId == parentId).ToList();
            foreach (var c in childs)
            {
                var newDepVm = new DepartmentUserVm
                {
                    Id = c.Id,
                    Name = $"{c.Name}",
                    Children = new List<DepartmentUserVm>(),
                    Type = DepartmentUserType.Department
                };

                parentVm.Children!.Add(newDepVm);

                // add users
                foreach (var u in users.Where(u => u.UserDepartments.Any(uu => uu.DepartmentId == newDepVm.Id)).OrderBy(u => u.Name))
                {
                    var userVm = new DepartmentUserVm
                    {
                        Id = u.Id,
                        Name = $"{u.Name} / {u.UserDepartments.First(uu => uu.DepartmentId == newDepVm.Id).UserPosition.Name}",
                        Children = new List<DepartmentUserVm>(),
                        Type = DepartmentUserType.User
                    };

                    newDepVm.Children.Add(userVm);
                }

                HandleDepartment(c.Id, newDepVm, deps, users);
            }
        }
    }
}