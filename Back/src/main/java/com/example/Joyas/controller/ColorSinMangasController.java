package com.example.Joyas.controller;

import com.example.Joyas.model.ColorSinMangas;
import com.example.Joyas.model.Size;
import com.example.Joyas.service.ColorSinMangasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/colorSinMangas")
public class ColorSinMangasController {
    @Autowired
    private ColorSinMangasService colorSinMangasService;

    public ColorSinMangasController(ColorSinMangasService colorSinMangasService) {
        this.colorSinMangasService = colorSinMangasService;
    }


    @GetMapping("/getColors")
    public ResponseEntity<List<ColorSinMangas>> getColors() {
        List<ColorSinMangas> colors = colorSinMangasService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    @GetMapping("/getColor")
    public ResponseEntity<ColorSinMangas> getColor(@RequestParam String name) {
        Optional<ColorSinMangas> color = colorSinMangasService.getColorByName(name);
        return color.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/addColor")
    public ResponseEntity<?> addColor(
            @RequestParam(value = "name") String color,
            @RequestParam(value = "imagenDelantera") MultipartFile imagenDelantera,
            @RequestParam(value = "imagenTrasera") MultipartFile imagenTrasera,
            @RequestParam(value = "sizes") List<String> sizes) {

        // Verificación de que se han recibido las imágenes
        if (imagenDelantera.isEmpty() || imagenTrasera.isEmpty()) {
            return ResponseEntity.badRequest().body("Las imágenes delantera y trasera son obligatorias.");
        }

        // Crear el objeto ColorCami
        ColorSinMangas colorSinMangas = new ColorSinMangas();
        colorSinMangas.setName(color);

        try {
            colorSinMangas.setImagenDelantera(imagenDelantera.getBytes());
            colorSinMangas.setImagenTrasera(imagenTrasera.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar las imágenes.");
        }

        // Convertir la lista de Strings a lista de enums (Size)
        List<Size> sizeEnums;
        try {
            sizeEnums = sizes.stream()
                    .map(size -> Size.valueOf(size.toUpperCase()))  // Convierte las cadenas a enums
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Uno o más tamaños no son válidos.");
        }

        // Añadir los sizes a colorCami
        colorSinMangas.setSizes(sizeEnums);

        // Guardar el nuevo color en la base de datos
        ColorSinMangas savedColor = colorSinMangasService.addColor(colorSinMangas);
        return ResponseEntity.ok(savedColor);
    }

}
