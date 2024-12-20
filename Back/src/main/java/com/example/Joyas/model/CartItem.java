package com.example.Joyas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;

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
    private Integer published = 0;

    @Column
    private Double price;

    @Column
    private Integer quantity;

    @Column
    private Integer id_cami;

    @Column
    private String type;

    @Column
    private Integer discount;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private String image; // imagen es en formato binario

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructor con parámetros
    public CartItem(String name, String size, String color, Double price, Integer quantity, String image, Integer id_cami,
                    String type, Integer discount, Cart cart) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.id_cami = id_cami;
        this.type = type;
        this.discount = discount;
        this.cart = cart;
    }

}
