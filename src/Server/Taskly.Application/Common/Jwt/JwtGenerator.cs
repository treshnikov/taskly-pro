using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Taskly.Domain;

namespace Taskly.Application.Jwt
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;

        public JwtGenerator(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtToken"]));
        }

        public string CreateToken(User user)
        {
            // todo - extract roles from DB
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            };

            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimsIdentity.DefaultRoleClaimType, role.Name));
            }

            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = credentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
