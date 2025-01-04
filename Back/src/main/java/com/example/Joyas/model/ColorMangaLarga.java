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
public class ColorMangaLarga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name;

    @Lob
    @Column(name = "imagen_color1", columnDefinition="LONGBLOB")
    private byte[] imagenDelantera;

    @Lob
    @Column(name = "imagen_color2", columnDefinition="LONGBLOB")
    private byte[] imagenTrasera;

    @Lob
    @Column(name = "imagen_color3", columnDefinition="LONGBLOB")
    private byte[] imagenLateral;

    @ElementCollection(targetClass = Size.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "color_manga_larga_sizes", joinColumns = @JoinColumn(name = "color_manga_larga_id"))
    @Column(name = "size")
    private List<Size> sizes;
}
