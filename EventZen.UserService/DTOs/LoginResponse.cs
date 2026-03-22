namespace EventZen.UserService.DTOs
{
    public class LoginResponse
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }
}