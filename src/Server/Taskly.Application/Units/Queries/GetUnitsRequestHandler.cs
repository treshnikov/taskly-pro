using MediatR;

namespace Taskly.Application.Units.Queries
{
    public class GetUnitsRequestHandler : IRequestHandler<GetUnitsRequest, UnitVm>
    {
        public Task<UnitVm> Handle(GetUnitsRequest request, CancellationToken cancellationToken)
        {
            var res =
                new UnitVm
                {
                    Id = Guid.NewGuid(),
                    Name = "root",
                    Children = new UnitVm[]{
                        new UnitVm{
                            Id = Guid.NewGuid(),
                            Name = "child 1"
                        },
                        new UnitVm{
                            Id = Guid.NewGuid(),
                            Name = "child 2"
                        },
                        new UnitVm{
                            Id = Guid.NewGuid(),
                            Name = "child 3",
                            Children = new UnitVm[]{
                                new UnitVm{
                                    Id = Guid.NewGuid(),
                                    Name = "child 4"
                                }
                            }
                        }
                    }
                };


            return Task.FromResult(res);
        }
    }
}