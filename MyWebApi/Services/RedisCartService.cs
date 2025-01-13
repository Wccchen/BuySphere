using StackExchange.Redis;
using System.Text.Json;

namespace MyWebApi.Services
{
    public class RedisCartService
    {
        private readonly IDatabase _database;

        public RedisCartService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();

            if (!redis.IsConnected)
            {
                throw new Exception("Redis is not connected");
            }

            Console.WriteLine("Redis is connected");
        }

        // Add entire cart to Redis
        public async Task StoreCartAsync(string userId, List<Product> cartItems)
        {
            string cartKey = $"cart:{userId}";
            string cartJson = JsonSerializer.Serialize(cartItems);
            await _database.StringSetAsync(cartKey, cartJson, TimeSpan.FromMinutes(30));
            Console.WriteLine($"Stored cart in Redis for user: {userId}");
        }

        // Retrieve cart from Redis
        public async Task<List<Product>> GetCartAsync(string userId)
        {
            string cartKey = $"cart:{userId}";
            string? cartJson = await _database.StringGetAsync(cartKey);

            if (string.IsNullOrEmpty(cartJson))
            {
                Console.WriteLine($"Cart not found in Redis for user: {userId}");
                return new List<Product>();
            }

            return JsonSerializer.Deserialize<List<Product>>(cartJson) ?? new List<Product>();
        }

        // Clear the cart
        public async Task ClearCartAsync(string userId)
        {
            string cartKey = $"cart:{userId}";
            await _database.KeyDeleteAsync(cartKey);
            Console.WriteLine($"Cart cleared for user: {userId}");
        }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}