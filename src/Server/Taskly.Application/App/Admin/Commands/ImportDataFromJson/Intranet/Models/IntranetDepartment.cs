/*
    Warning: code below is quite messy, it considers a very special format that is only used by my current employer. 
    A universal importer is not considered in this project. 
    Please eliminate this part of the code and add support for your format if needed. 
*/

namespace Taskly.Application.Users
{
    public class IntranetDepartment
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int OrderNumber { get; set; }
    }

}