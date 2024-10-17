package com.example.Joyas.model;

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
public class ColorCami {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING) // Si ColorEnum es un enum
    private Color color;

    @Lob
    @Column(name = "imagen_color1", columnDefinition="LONGBLOB")
    private byte[] imagenDelantera;

    @Lob
    @Column(name = "imagen_color2", columnDefinition="LONGBLOB")
    private byte[] imagenTrasera;

    @ManyToMany(mappedBy = "colorsCami")
    private List<Camis> camis; // Esta lista contendrá todas las camis que usan este color





}
