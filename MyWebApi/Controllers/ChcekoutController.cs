using Microsoft.AspNetCore.Mvc;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {   
        //Process orders
        [HttpPost]
        public IActionResult ProcessCheckout([FromBody] CheckoutRequest request)
        {
            if (request == null || request.Products == null || !request.Products.Any())
            {
                return BadRequest(new { message = "Invalid checkout request." });
            }

            // Check total price
            decimal totalAmount = request.Products.Sum(p => p.Price);
            if (totalAmount != request.TotalPrice)
            {
                return BadRequest(new { message = "Total price mismatch." });
            }

            // Save to database
            Console.WriteLine("Order processed successfully!");

            return Ok(new { message = "Order processed successfully.", orderId = Guid.NewGuid() });
        }
    }

    // Checkout Request model
    public class CheckoutRequest
    {
        public List<Product> Products { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
    }
}