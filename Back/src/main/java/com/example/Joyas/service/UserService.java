package com.example.Joyas.service;

import com.example.Joyas.config.JwtUtil;
import com.example.Joyas.model.User;
import com.example.Joyas.dao.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<String> loginUser(User loginUser) {
        User user = userRepository.findByUsername(loginUser.getUsername());
        if (user != null && checkPassword(loginUser.getPassword(), user.getPassword())) {
            // Genera un token JWT usando JwtUtil
            String token = jwtUtil.generateToken(user.getUsername());

            // Retorna el token en la respuesta
            return ResponseEntity.ok(token);
        } else {
            // Si las credenciales son incorrectas, retorna un estado 401
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }

    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }

    public ResponseEntity<User> createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().build(); // Usuario ya existe
        }
        // Encripta la contraseña
        String hashedPassword = hashPassword(user.getPassword());
        user.setPassword(hashedPassword);

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    public ResponseEntity<User> getUserById(int id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<User> getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    public ResponseEntity<User> updateUser(int id, User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    public ResponseEntity<Void> deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
