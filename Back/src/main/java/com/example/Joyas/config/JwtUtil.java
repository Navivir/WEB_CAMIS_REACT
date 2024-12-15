package com.example.Joyas.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtil {

    /** JWT TOKEN

    * Este token es compuesto por tres partes:

      el primero corresponde al encabezado o header el cual contiene metadatos sobre el tipo de token empleado
      y el algoritmo asociado a la firma o cifrado.

     *Posterior al encabezado, encontramos el payload, esta sección contiene la información
      que se desea trasmitir al utilizar el token.

     *Luego, se encuentra la firma, la cual valida el origen del token y permite verificar si ha sido modificado;
      los JWT son tokens autónomos, contando en sí con toda la información necesaria para verificar su validez.'
     */

    private static final String SECRET_KEY = Dotenv.load().get("JWT_SECRET_KEY");
    static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    private static final long expirationTime = 30L * 24 * 60 * 60 * 1000; // 30 días
    private static final long shortExpirationTime = 6L * 60 * 60 * 1000; // 6 horas
    // private static final long shortExpirationTime = 2L * 60 * 1000; // 2 minutos


    public static String generateToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public static String getSubjectFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String generateShortLivedToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + shortExpirationTime);
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }
    public static Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
    }

    public static Date getExpirationDate(String token) {
        Claims claims = getClaims(token);
        return claims.getExpiration();
    }

    public static Date getIssuedAtDate(String token) {
        Claims claims = getClaims(token);
        return claims.getIssuedAt();
    }

    public static boolean isTokenExpired(String token) {
        return getExpirationDate(token).before(new Date());
    }

}