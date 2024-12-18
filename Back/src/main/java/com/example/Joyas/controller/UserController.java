package com.example.Joyas.controller;

import com.example.Joyas.config.JwtUtil;
import com.example.Joyas.model.Camis;
import com.example.Joyas.model.LoginResponse;
import com.example.Joyas.model.PasswordUpdateRequest;
import com.example.Joyas.model.User;
import com.example.Joyas.service.CamisService;
import com.example.Joyas.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private CamisService camisService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User loginUser) {
        return userService.loginUser(loginUser);
    }

    @PostMapping("/signup")
    public ResponseEntity<User> createUser(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "surname", required = false) String surname,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "birthDate", required = false) String birthDate,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "imagenPerfil", required = false) MultipartFile imagenPerfil
    ) throws IOException {
        User user = new User();

        if (name != null) {
            user.setName(name);
        }
        if (surname != null) {
            user.setSurname(surname);
        }
        if (username != null) {
            user.setUsername(username);
        }
        if (email != null) {
            user.setEmail(email);
        }
        if (password != null) {
            user.setPassword(password);
        }
        if (birthDate != null) {
            user.setBirthDate(LocalDate.parse(birthDate));
        }
        if (role != null) {
            user.setRole(role);
        }
        if (imagenPerfil != null && !imagenPerfil.isEmpty()) {
            user.setImagenPerfil(camisService.resizeImage(imagenPerfil, 500));
        }

        return userService.createUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable int id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "surname", required = false) String surname,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "birthDate", required = false) String birthDate,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "imagenPerfil", required = false) MultipartFile imagenPerfil
    ) throws IOException {
        User user = new User();

        if (name != null) {
            user.setName(name);
        }
        if (surname != null) {
            user.setSurname(surname);
        }
        if (username != null) {
            user.setUsername(username);
        }
        if (email != null) {
            user.setEmail(email);
        }
        if (birthDate != null) {
            user.setBirthDate(LocalDate.parse(birthDate));
        }
        if (role != null) {
            user.setRole(role);
        }
        if (imagenPerfil != null && !imagenPerfil.isEmpty()) {
            user.setImagenPerfil(camisService.resizeImage(imagenPerfil, 500));
        }

        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable int id,
            @RequestBody PasswordUpdateRequest passwordUpdateRequest) {
        return userService.updatePassword(id, passwordUpdateRequest);
    }
    @GetMapping("/{id}/username")
    public ResponseEntity<String> getUsernameById(@PathVariable int id) {

        String username = userService.getUsernameById(id);
        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/generate-token")
    public ResponseEntity<String> generateTokenIfNotAuthenticated(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token;
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // Si el usuario no tiene token, generamos uno nuevo con expiración corta
            token = JwtUtil.generateShortLivedToken("anonymousUser");
            return ResponseEntity.ok(token);
        } else {
            // Si ya tiene un token válido, no se genera uno nuevo
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User already authenticated");
        }
    }
    @GetMapping("/is-valid-token")
    public ResponseEntity<Map<String, Object>> isValidToken(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Content-Type", "application/json")
                    .body(Map.of("message", "Invalid token format or missing token"));
        }

        String token = authorizationHeader.substring(7);

        try {
            boolean isValid = JwtUtil.validateToken(token);
            Map<String, Object> response = new HashMap<>();

            if (isValid) {
                // Obtener la fecha de expiración
                Date expirationDate = JwtUtil.getExpirationDate(token);
                response.put("message", "Token is valid");
                response.put("expirationDate", expirationDate.toString());
                return ResponseEntity.ok()
                        .header("Content-Type", "application/json")
                        .body(response);
            } else {
                response.put("message", "Token is invalid or expired");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header("Content-Type", "application/json")
                        .body(response);
            }
        } catch (Exception e) {
            // Manejar cualquier excepción ocurrida durante la validación del token
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Token validation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("Content-Type", "application/json")
                    .body(response);
        }
    }



}