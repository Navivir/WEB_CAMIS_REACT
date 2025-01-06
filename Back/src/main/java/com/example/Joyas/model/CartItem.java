package com.example.Joyas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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

    @Column
    private LocalDateTime created;

    @ElementCollection
    @CollectionTable(name = "cart_item_images", joinColumns = @JoinColumn(name = "cart_item_id"))
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructor con parámetros
    public CartItem(String name, String size, String color, Double price, Integer quantity, String[] images, Integer id_cami,
                    String type, Integer discount, LocalDateTime created, Cart cart) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.price = price;
        this.quantity = quantity;
        this.images = new ArrayList<>(Arrays.asList(images));
        this.id_cami = id_cami;
        this.type = type;
        this.discount = discount;
        this.created = created;
        this.cart = cart;
    }

}
