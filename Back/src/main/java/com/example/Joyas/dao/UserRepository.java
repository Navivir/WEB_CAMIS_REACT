package com.example.Joyas.dao;

import com.example.Joyas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUsername(String username);
    User findByEmail(String email);
    User findByUsernameOrEmail(String username, String email);

    // Método para verificar si un usuario con el nombre de usuario ya existe
    boolean existsByUsername(String username);


}
