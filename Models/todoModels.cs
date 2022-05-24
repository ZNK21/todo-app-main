using System.Collections.Generic;
using todoApp.Entities;

namespace todoApp.Models {
    public class todoModels {
        public int id { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public int position { get; set; }
        public int items { get; set; }


        public List<todo> todo { get; set; }
    }
}
