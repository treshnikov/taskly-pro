namespace Taskly.Domain
{
    public class Note
    {
        public Guid Id {get; set;}
        public Guid UserId {get; set;}
        public string? Title {get; set;}
        public string? Details {get; set;}
        public DateTime CreationDate {get; set;}
        public DateTime? EditTime {get; set;}
    
        public Note()
        {
            
        }

        public Note(Guid id, Guid userId, string? title, string? details, DateTime creationDate, DateTime? editTime)
        {
            Id = id;
            UserId = userId;
            Title = title;
            Details = details;
            CreationDate = creationDate;
            EditTime = editTime;
        }
    }
        
}