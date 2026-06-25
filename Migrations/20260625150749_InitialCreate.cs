using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: false),
                    Tag = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Image", "Name", "Price", "Tag" },
                values: new object[,]
                {
                    { 1, "Vestes", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80", "Veste en Jean Oversize", 59.99m, "Nouveau" },
                    { 2, "T-shirts", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", "T-Shirt Coton Bio Blanc", 24.99m, "" },
                    { 3, "Pantalons", "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&q=80", "Pantalon Cargo Beige", 45.00m, "Promo" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
