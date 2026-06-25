using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/products
    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    // GET: /api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new { message = "Ce vêtement n'existe pas ou plus." });
        }

        return Ok(product);
    }

    // POST: /api/products
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] Product newProduct)
    {
        if (newProduct == null)
        {
            return BadRequest("Les données du vêtement sont invalides.");
        }

        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
    }

    // NOUVEAU - PUT: /api/products/{id} (Pour la modification depuis l'espace Admin)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
    {
        if (updatedProduct == null)
        {
            return BadRequest("Données invalides.");
        }

        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound(new { message = "Ce vêtement n'existe pas." });
        }

        // Mise à jour des valeurs
        existingProduct.Name = updatedProduct.Name;
        existingProduct.Price = updatedProduct.Price;
        existingProduct.Category = updatedProduct.Category;
        existingProduct.Image = updatedProduct.Image;
        existingProduct.Tag = updatedProduct.Tag;
        existingProduct.Stock = updatedProduct.Stock; // On enregistre le nouveau stock

        await _context.SaveChangesAsync();

        return Ok(new { message = "Vêtement mis à jour avec succès !", product = existingProduct });
    }

    // NOUVEAU - DELETE: /api/products/{id} (Pour la suppression depuis l'espace Admin)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Ce vêtement n'existe déjà plus." });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Vêtement supprimé avec succès." });
    }
    // POST: /api/products/checkout
[HttpPost("checkout")]
public async Task<IActionResult> Checkout([FromBody] List<CheckoutItemDto> cartItems)
{
    if (cartItems == null || !cartItems.Any())
    {
        return BadRequest(new { message = "Le panier est vide." });
    }

    // On commence une transaction pour s'assurer que si un article pose problème, 
    // aucun stock n'est modifié (évite les stocks corrompus)
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        foreach (var item in cartItems)
        {
            var product = await _context.Products.FindAsync(item.Id);

            if (product == null)
            {
                return NotFound(new { message = $"Le vêtement avec l'ID {item.Id} n'existe pas." });
            }

            // Vérification si le stock est suffisant
            if (product.Stock < item.Quantity)
            {
                return BadRequest(new { 
                    message = $"Stock insuffisant pour l'article '{product.Name}'. Disponible : {product.Stock}, demandé : {item.Quantity}." 
                });
            }

            // Décrémentation du stock
            product.Stock -= item.Quantity;
        }

        // Sauvegarde des modifications dans shop.db
        await _context.SaveChangesAsync();
        
        // Validation définitive de la transaction
        await transaction.CommitAsync();

        return Ok(new { message = "Commande validée avec succès ! Les stocks ont été mis à jour." });
    }
    catch (Exception ex)
    {
        // En cas d'erreur imprévue, on annule tout
        await transaction.RollbackAsync();
        return StatusCode(500, new { message = "Une erreur est survenue lors de la validation.", error = ex.Message });
    }
}
}


// Modèle pour recevoir chaque ligne du panier
public class CheckoutItemDto
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public string Size { get; set; } = string.Empty;
}