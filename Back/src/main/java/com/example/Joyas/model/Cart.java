package com.example.Joyas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token; // Token único para identificar el carrito

    @Column(nullable = false)
    private LocalDateTime createdAt; // Fecha de creación del carrito

    @Column(nullable = false)
    private LocalDateTime expiresAt; // Fecha de expiración del carrito

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user; // Relación con la entidad User

    @JsonIgnore  // evitas que se haga un bucle con la relación paralela (como en un espejo)
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id")
    private List<CartItem> items = new ArrayList<>();

    // Constructor que acepta token
    public Cart(String token) {
        this.token = token;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = this.createdAt.plusHours(6);
    }
}
