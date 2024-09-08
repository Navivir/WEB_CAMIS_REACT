package com.example.Joyas.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

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

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long expirationTime = 21600000;  // 6 horas

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

}