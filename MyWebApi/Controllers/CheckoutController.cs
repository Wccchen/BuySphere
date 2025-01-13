using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly IDatabase _redisDatabase;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(IConnectionMultiplexer redis, ILogger<CheckoutController> logger)
        {
            _redisDatabase = redis.GetDatabase();
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessCheckout([FromBody] CheckoutRequest request)
        {
            // Validate the request
            if (request == null || string.IsNullOrWhiteSpace(request.CartId))
            {
                _logger.LogWarning("Invalid checkout request received: CartId is missing.");
                return BadRequest(new { message = "CartId is required." });
            }

            if (request.Products == null || !request.Products.Any())
            {
                _logger.LogWarning("Invalid checkout request received: Products list is empty.");
                return BadRequest(new { message = "At least one product is required." });
            }

            string cartKey = $"cart:{request.CartId}";
            string? cartJson = await _redisDatabase.StringGetAsync(cartKey);

            if (string.IsNullOrEmpty(cartJson))
            {
                _logger.LogWarning("Cart not found in Redis for cartId: {CartId}", request.CartId);

                // Store cart data to Redis
                bool redisSaved = await SaveCartToRedis(request.CartId, request.Products);
                if (!redisSaved)
                {
                    // Fallback: Save cart data to database
                    bool dbSaved = await SaveCartToDatabase(request.CartId, request.Products, request.TotalPrice);
                    if (!dbSaved)
                    {
                        return StatusCode(500, new { message = "Failed to save cart data to database and Redis." });
                    }

                    return Ok(new { message = "Cart data saved to database.", cartId = request.CartId });
                }

                return Ok(new { message = "Cart data saved to Redis.", cartId = request.CartId });
            }

            // Deserialize Redis cart data
            List<Product>? redisCart;
            try
            {
                redisCart = JsonSerializer.Deserialize<List<Product>>(cartJson);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize cart data from Redis.");
                return BadRequest(new { message = "Invalid cart data in Redis." });
            }

            if (redisCart == null || !redisCart.Any())
            {
                _logger.LogWarning("Cart is empty or invalid in Redis for cartId: {CartId}", request.CartId);
                return BadRequest(new { message = "Cart is empty or invalid in Redis." });
            }

            // Calculate the total price
            decimal serverCalculatedTotal = redisCart.Sum(p => p.Price);
            if (Math.Abs(serverCalculatedTotal - request.TotalPrice) > 0.01m)
            {
                _logger.LogWarning("Total price mismatch: Calculated {CalculatedTotal}, Received {ReceivedTotal}",
                    serverCalculatedTotal, request.TotalPrice);
                return BadRequest(new { message = "Total price does not match the server-calculated price." });
            }

            // Save order to database (placeholder)
            Guid orderId = Guid.NewGuid();
            _logger.LogInformation("Order processed successfully. OrderId: {OrderId}", orderId);

            // Clear the cart from Redis
            await _redisDatabase.KeyDeleteAsync(cartKey);

            return Ok(new
            {
                message = "Order processed successfully.",
                orderId = orderId,
                cartId = request.CartId,
                totalAmount = serverCalculatedTotal
            });
        }

        // Save cart to Redis
        private async Task<bool> SaveCartToRedis(string cartId, List<Product> products)
        {
            try
            {
                string cartKey = $"cart:{cartId}";
                string cartJson = JsonSerializer.Serialize(products);

                // Store in Redis with a 1-hour expiration
                await _redisDatabase.StringSetAsync(cartKey, cartJson, TimeSpan.FromHours(1));

                _logger.LogInformation("Cart saved to Redis. CartId: {CartId}", cartId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save cart to Redis.");
                return false;
            }
        }

        // Save cart to database
        private async Task<bool> SaveCartToDatabase(string cartId, List<Product> products, decimal totalPrice)
        {
            try
            {
                _logger.LogInformation("Saving cart to database. CartId: {CartId}, TotalPrice: {TotalPrice}", cartId, totalPrice);
                await Task.Delay(100); // Simulate database operation
                return true; // Assume save is successful
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save cart data to the database.");
                return false;
            }
        }
    }

    // Models
    public class CheckoutRequest
    {
        public required string CartId { get; set; } // Unique cart identifier
        public decimal TotalPrice { get; set; }     // Total price of the cart
        public List<Product> Products { get; set; } = new List<Product>(); // List of products
    }

    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
