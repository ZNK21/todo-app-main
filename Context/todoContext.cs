using Microsoft.EntityFrameworkCore;
using todoApp.Entities;

namespace todoApp.Context {
    public class todoContext : DbContext {

        public todoContext(DbContextOptions options) : base(options) { }
        public DbSet<todo> todo { get; set; }
    }
}
