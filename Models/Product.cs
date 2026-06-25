namespace Backend.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public int Stock { get; set; } // NOUVEAU : Gestion des quantités en stock
}