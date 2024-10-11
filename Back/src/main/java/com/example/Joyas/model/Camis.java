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
    private String material;
    @Column
    private float price;
    @Column
    private Integer discount;

    @Enumerated(EnumType.STRING)
    @Column
    private Type type;

    @Column
    private int featured = 0;

    @OneToMany(mappedBy = "camis", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // evitas que se haga un bucle con la relación paralela (como en un espejo)
    private List<Review> reviews;

    @ElementCollection(targetClass = Size.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "camis_sizes", joinColumns = @JoinColumn(name = "camis_id"))
    @Column(name = "size")
    private List<Size> sizes;  // Ahora puede almacenar múltiples tamaños

    @ElementCollection(targetClass = Color.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "camis_colors", joinColumns = @JoinColumn(name = "camis_id"))
    @Column(name = "color")
    private List<Color> colors;  // Ahora puede almacenar múltiples colores

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(name = "imagen1", columnDefinition="LONGBLOB")
    private byte[] imagen1;

    @Lob
    @Column(name = "imagen2", columnDefinition="LONGBLOB")
    private byte[] imagen2;
}
