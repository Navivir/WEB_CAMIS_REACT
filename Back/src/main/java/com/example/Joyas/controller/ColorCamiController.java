package com.example.Joyas.controller;

import com.example.Joyas.model.Color;
import com.example.Joyas.model.ColorCami;
import com.example.Joyas.service.CamisService;
import com.example.Joyas.service.ColorCamiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/color")
public class ColorCamiController {

    @Autowired
    private ColorCamiService colorCamiService;

    public ColorCamiController(ColorCamiService colorCamiService) {
        this.colorCamiService = colorCamiService;
    }

    @PostMapping("/addColor")
    public ResponseEntity<?> addColor(
            @RequestParam(value = "color") Color color,
            @RequestParam(value = "imagenDelantera") MultipartFile imagenDelantera,
            @RequestParam(value = "imagenTrasera") MultipartFile imagenTrasera) {

        // Verificación de que se han recibido las imágenes
        if (imagenDelantera.isEmpty() || imagenTrasera.isEmpty()) {
            return ResponseEntity.badRequest().body("Las imágenes delantera y trasera son obligatorias.");
        }

        // Crear el objeto ColorCami
        ColorCami colorCami = new ColorCami();
        colorCami.setColor(color);
        try {
            colorCami.setImagenDelantera(imagenDelantera.getBytes());
            colorCami.setImagenTrasera(imagenTrasera.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar las imágenes.");
        }

        // Guardar el nuevo color en la base de datos
        ColorCami savedColor = colorCamiService.addColor(colorCami);
        return ResponseEntity.ok(savedColor);
    }

}
