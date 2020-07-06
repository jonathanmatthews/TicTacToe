using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Models;

namespace server.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public static string ConnectionString;

        public AppDbContext() : base() { }
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseSqlServer(ConnectionString);
        }

        public DbSet<PlayerRecord> PlayerRecords { get; set; }
    }
}