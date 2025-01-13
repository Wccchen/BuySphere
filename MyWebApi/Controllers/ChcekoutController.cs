using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IDatabase _redisDatabase;

        public CheckoutController(IConnectionMultiplexer redis)
        {
            _redisDatabase = redis.GetDatabase();
        }

        // Process orders
        [HttpPost]
        public async Task<IActionResult> ProcessCheckout([FromBody] CheckoutRequest request)
        {
            if (request == null || request.Products == null || !request.Products.Any())
            {
                return BadRequest(new { message = "Invalid checkout request." });
            }

            // Retrieve the cart from Redis
            string cartKey = $"cart:{request.CartId}"; // Unique key for each cart
            string? cartJson = await _redisDatabase.StringGetAsync(cartKey);

            if (string.IsNullOrEmpty(cartJson))
            {
                return NotFound(new { message = "Cart not found in Redis." });
            }

            // Deserialize the cart data
            var redisCart = JsonSerializer.Deserialize<List<Product>>(cartJson);

            if (redisCart == null || !redisCart.Any())
            {
                return BadRequest(new { message = "Cart is empty or invalid in Redis." });
            }

            // Check total price
            decimal totalAmount = redisCart.Sum(p => p.Price);
            if (totalAmount != request.TotalPrice)
            {
                return BadRequest(new { message = "Total price mismatch." });
            }

            // Save order to database (placeholder)
            Console.WriteLine("Order processed successfully!");

            // Clear the cart from Redis
            await _redisDatabase.KeyDeleteAsync(cartKey);

            return Ok(new { message = "Order processed successfully.", orderId = Guid.NewGuid() });
        }
    }

    // Checkout Request model
    public class CheckoutRequest
    {
        public string CartId { get; set; }  = string.Empty; // Unique cart identifier
        public decimal TotalPrice { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();
    }

    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}