using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Units.Queries
{
    public class GetUnitsRequestHandler : IRequestHandler<GetUnitsRequest, UnitVm>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetUnitsRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UnitVm> Handle(GetUnitsRequest request, CancellationToken cancellationToken)
        {
            var root = new UnitVm()
            {
                Id = Guid.NewGuid(),
                Name = "Departments",
                Children = new List<UnitVm>()
            };

            var units = await _dbContext.Units.OrderBy(i => i.ParentUnitId).Include(u => u.ParentUnit).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);
            var users = await _dbContext.Users.Include(u => u.UserUnits).AsNoTracking().ToListAsync(cancellationToken: cancellationToken);

            HandleUnit(null, root, units, users);        

            return await Task.FromResult(root);
        }

        private void HandleUnit(Guid? parentId, UnitVm parentVm, List<Domain.Unit> units, List<Domain.User> users)
        {
            var childs = units.Where(i => i.ParentUnitId == parentId).ToList();
            foreach (var c in childs)
            {
                var newUnitVm = new UnitVm
                {
                    Id = c.Id,
                    Name = c.Name,
                    Children = new List<UnitVm>()
                };

                parentVm.Children!.Add(newUnitVm);

                // add users
                foreach (var u in users.Where(u => u.UserUnits.Any(uu => uu.UnitId == newUnitVm.Id)).OrderBy(u => u.Name))
                {
                    var userVm = new UnitVm
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Children = new List<UnitVm>()
                    };

                    newUnitVm.Children.Add(userVm);
                }

                HandleUnit(c.Id, newUnitVm, units, users);
            }
        }
    }
}