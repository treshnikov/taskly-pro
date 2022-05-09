using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Units.Queries
{
    public class GetUnitUserssRequestHandler : IRequestHandler<GetUnitUserssRequest, UnitUserVm>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetUnitUserssRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UnitUserVm> Handle(GetUnitUserssRequest request, CancellationToken cancellationToken)
        {
            var root = new UnitUserVm()
            {
                Id = Guid.NewGuid(),
                Name = "Departments",
                Children = new List<UnitUserVm>()
            };

            var units = await _dbContext.Units.OrderBy(i => i.ParentUnitId).Include(u => u.ParentUnit).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);
            var users = await _dbContext.Users.Include(u => u.UserUnits).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);

            HandleUnit(null, root, units, users);        

            return await Task.FromResult(root);
        }

        private void HandleUnit(Guid? parentId, UnitUserVm parentVm, List<Domain.Unit> units, List<Domain.User> users)
        {
            var childs = units.Where(i => i.ParentUnitId == parentId).ToList();
            foreach (var c in childs)
            {
                var newUnitVm = new UnitUserVm
                {
                    Id = c.Id,
                    Name = c.Name,
                    Children = new List<UnitUserVm>(),
                    Type = UnitUserType.Unit
                };

                parentVm.Children!.Add(newUnitVm);

                // add users
                foreach (var u in users.Where(u => u.UserUnits.Any(uu => uu.UnitId == newUnitVm.Id)).OrderBy(u => u.Name))
                {
                    var userVm = new UnitUserVm
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Children = new List<UnitUserVm>(),
                        Type = UnitUserType.User
                    };

                    newUnitVm.Children.Add(userVm);
                }

                HandleUnit(c.Id, newUnitVm, units, users);
            }
        }
    }
}