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
public class ColorCami {

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

    @ElementCollection(targetClass = Size.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "color_cami_sizes", joinColumns = @JoinColumn(name = "color_cami_id"))
    @Column(name = "size")
    private List<Size> sizes;






}
