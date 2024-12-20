package com.example.Joyas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Camis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private float price;

    @Column
    private Integer discount;

    @Column
    private Integer published = 0;

    @OneToMany(mappedBy = "camis", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Review> reviews;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(name = "imagen1", columnDefinition="LONGBLOB")
    private byte[] imagen1;  // Imagen general de la camiseta (no relacionada con el color)

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
