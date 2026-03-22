using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using EventZen.UserService.DTOs;
using EventZen.UserService.Data;
using EventZen.UserService.Models;
using EventZen.UserService.Services;

namespace EventZen.UserService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(ApplicationDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "CUSTOMER",
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            Status = 1
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(user);
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized("Invalid credentials");

        bool valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!valid)
            return Unauthorized("Invalid credentials");

        var token = _jwtService.GenerateToken(user);

        var response = new DTOs.LoginResponse
        {
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };

        return Ok(response);
    }
}