using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // C'est cette ligne qui va créer la table "Products"
    public DbSet<Product> Products { get; set; }

    // On en profite pour injecter nos données de test directement à la création de la BDD
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Veste en Jean Oversize", Price = 59.99m, Category = "Vestes", Image = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80", Tag = "Nouveau" },
            new Product { Id = 2, Name = "T-Shirt Coton Bio Blanc", Price = 24.99m, Category = "T-shirts", Image = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", Tag = "" },
            new Product { Id = 3, Name = "Pantalon Cargo Beige", Price = 45.00m, Category = "Pantalons", Image = "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&q=80", Tag = "Promo" }
        );
    }
}