package com.example.Joyas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String size;

    @Column
    private String color;

    @Column
    private Double price;

    @Column
    private Integer quantity;

    @Column
    private Integer id_cami;

    @Column
    private Integer discount;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private String image; // imagen es en formato binario

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart; // Relación con Cart

    // Constructor con parámetros
    public CartItem(String name, String size, String color, Double price, Integer quantity, String image, Integer id_cami, Integer discount, Cart cart) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.id_cami = id_cami;
        this.discount = discount;
        this.cart = cart;
    }

    // Otros métodos si es necesario
}
