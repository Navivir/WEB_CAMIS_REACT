package com.example.Joyas.service;

import com.example.Joyas.config.JwtUtil;
import com.example.Joyas.dao.CartRepository;
import com.example.Joyas.model.Cart;
import com.example.Joyas.model.LoginResponse;
import com.example.Joyas.model.PasswordUpdateRequest;
import com.example.Joyas.model.User;
import com.example.Joyas.dao.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private CartRepository cartRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, CartRepository cartRepository){
        this.userRepository = userRepository;
        this. cartRepository = cartRepository;
    }
    public ResponseEntity<LoginResponse> loginUser(User loginUser) {
        // Busca al usuario por nombre de usuario o correo electrónico
        User user = userRepository.findByEmail(loginUser.getEmail());

        if (user != null && checkPassword(loginUser.getPassword(), user.getPassword())) {

            Optional<Cart> userCart = cartRepository.findByUserId((long) user.getId());

            String token;
            if (userCart.isPresent()) {
                System.out.println("El usuario ya tiene un carrito asociado con el ID: " + userCart.get().getId());
                token = userCart.get().getToken();
                LocalDateTime expiresTime = userCart.get().getExpiresAt();

                if(expiresTime.isBefore(LocalDateTime.now())){
                    token = jwtUtil.generateToken(user.getUsername());
                }
            } else {
                System.out.println("El usuario no tiene un carrito asociado. Generando uno nuevo.");
                token = jwtUtil.generateToken(user.getUsername());
            }

            // Crea la respuesta con el token y los datos del usuario
            LoginResponse loginResponse = new LoginResponse("logged", token, user.getId(), user.getUsername());

            // Retorna el token y el ID en la respuesta
            return ResponseEntity.ok(loginResponse);
        } else {
            // Si las credenciales son incorrectas, retorna un estado 401
            return ResponseEntity.status(401).body(null);
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
            return ResponseEntity.badRequest().build();
        }

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

    public ResponseEntity<User> updateUser(int id, User userUpdates) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = optionalUser.get();

        // Actualizar campos solo si se proporcionan
        if (userUpdates.getName() != null) existingUser.setName(userUpdates.getName());
        if (userUpdates.getSurname() != null) existingUser.setSurname(userUpdates.getSurname());
        if (userUpdates.getUsername() != null) existingUser.setUsername(userUpdates.getUsername());
        if (userUpdates.getEmail() != null) existingUser.setEmail(userUpdates.getEmail());
        if (userUpdates.getBirthDate() != null) existingUser.setBirthDate(userUpdates.getBirthDate());
        if (userUpdates.getImagenPerfil() != null) existingUser.setImagenPerfil(userUpdates.getImagenPerfil());

        User updatedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    public ResponseEntity<Void> deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> updatePassword(int id, PasswordUpdateRequest passwordUpdateRequest) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();

        // Verificar la contraseña actual
        if (!checkPassword(passwordUpdateRequest.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body(null); // Contraseña actual incorrecta
        }

        // Actualizar la contraseña
        String newHashedPassword = hashPassword(passwordUpdateRequest.getNewPassword());
        user.setPassword(newHashedPassword);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public String getUsernameById(int id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(User::getUsername).orElse(null);
    }
}
