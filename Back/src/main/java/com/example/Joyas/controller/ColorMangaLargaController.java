package com.example.Joyas.controller;

import com.example.Joyas.model.ColorMangaLarga;
import com.example.Joyas.model.Size;
import com.example.Joyas.service.ColorCamiService;
import com.example.Joyas.service.ColorMangaLargaService;
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
@RequestMapping("/colorMangaLarga")
public class ColorMangaLargaController {


    @Autowired
    private ColorMangaLargaService colorMangaLargaService;

    public ColorMangaLargaController(ColorCamiService colorCamiService) {
        this.colorMangaLargaService = colorMangaLargaService;
    }


    @GetMapping("/getColors")
    public ResponseEntity<List<ColorMangaLarga>> getColors() {
        List<ColorMangaLarga> colors = colorMangaLargaService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    @GetMapping("/getColor")
    public ResponseEntity<ColorMangaLarga> getColor(@RequestParam String name) {
        Optional<ColorMangaLarga> color = colorMangaLargaService.getColorByName(name);
        return color.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/addColor")
    public ResponseEntity<?> addColor(
            @RequestParam(value = "name") String color,
            @RequestParam(value = "imagenDelantera") MultipartFile imagenDelantera,
            @RequestParam(value = "imagenTrasera") MultipartFile imagenTrasera,
            @RequestParam(value = "imagenLateral") MultipartFile imagenLateral,
            @RequestParam(value = "sizes") List<String> sizes) {

        // Verificación de que se han recibido las imágenes
        if (imagenDelantera.isEmpty() || imagenTrasera.isEmpty()) {
            return ResponseEntity.badRequest().body("Las imágenes delantera y trasera son obligatorias.");
        }

        // Crear el objeto ColorCami
        ColorMangaLarga colorMangaLarga = new ColorMangaLarga();
        colorMangaLarga.setName(color);

        try {
            colorMangaLarga.setImagenDelantera(imagenDelantera.getBytes());
            colorMangaLarga.setImagenTrasera(imagenTrasera.getBytes());
            colorMangaLarga.setImagenLateral(imagenLateral.getBytes());
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
        colorMangaLarga.setSizes(sizeEnums);

        // Guardar el nuevo color en la base de datos
        ColorMangaLarga savedColor = colorMangaLargaService.addColor(colorMangaLarga);
        return ResponseEntity.ok(savedColor);
    }
}
