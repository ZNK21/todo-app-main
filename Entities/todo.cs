using System.ComponentModel.DataAnnotations;

namespace todoApp.Entities {
    public class todo {
        [Key()]
        public int id { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public int position { get; set; }
    }
}
