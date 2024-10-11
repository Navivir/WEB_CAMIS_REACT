package com.example.Joyas.controller;

import com.example.Joyas.model.Camis;
import com.example.Joyas.model.Color;
import com.example.Joyas.model.Size;
import com.example.Joyas.model.Type;
import com.example.Joyas.service.CamisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CamisController {
    @Autowired
    private CamisService camisService;

    public CamisController(CamisService camisService) {
        this.camisService = camisService;
    }

    @GetMapping("/camis")
    public ResponseEntity<?> getCamis() {
        return this.camisService.getCamis();
    }

    @GetMapping("/camis_page")
    public ResponseEntity<Page<Camis>> getCamisPagable(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> camisPage = this.camisService.getCamisPagable(pageable);
        return ResponseEntity.ok(camisPage);
    }
    @GetMapping("/featured")
    public ResponseEntity<Page<Camis>> getFeaturedCamis(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> featuredCamis = this.camisService.getFeaturedCamis(pageable);
        return ResponseEntity.ok(featuredCamis);
    }

    @GetMapping("/discounted")
    public ResponseEntity<Page<Camis>> getDiscountedCamis(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> discountedCamis = this.camisService.getDiscountedCamis(pageable);
        return ResponseEntity.ok(discountedCamis);
    }

    @PostMapping(value = "/cami", consumes = "multipart/form-data")
    public ResponseEntity<?> insertCami(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "sizes", required = false) List<String> sizes,
            @RequestParam(value = "colors", required = false) List<String> colors,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Float price,
            @RequestParam(value = "imagen1", required = false) MultipartFile imagen1,
            @RequestParam(value = "imagen2", required = false) MultipartFile imagen2) throws IOException {

        Camis cami = new Camis();

        if (name != null) {
            cami.setName(name);
        }
        if (material != null) {
            cami.setMaterial(material);
        }
        if (sizes != null && !sizes.isEmpty()) {
            List<Size> sizeList = new ArrayList<>();
            for (String size : sizes) {
                try {
                    sizeList.add(Size.valueOf(size.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Tamaño inválido: " + size);
                }
            }
            cami.setSizes(sizeList);
        }
        if (colors != null && !colors.isEmpty()) {
            List<Color> colorList = new ArrayList<>();
            for (String color : colors) {
                try {
                    colorList.add(Color.valueOf(color.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Color inválido: " + color);
                }
            }
            cami.setColors(colorList);
        }
        if (description != null) {
            cami.setDescription(description);
        }
        if (price != null) {
            cami.setPrice(price);
        }
        if (imagen1 != null && !imagen1.isEmpty()) {
            cami.setImagen1(imagen1.getBytes());
        }
        if (imagen2 != null && !imagen2.isEmpty()) {
            cami.setImagen2(imagen2.getBytes());
        }

        return this.camisService.insertCami(cami);
    }

    @GetMapping("/cami/{id}")
    public ResponseEntity<?> getCamiById(@PathVariable int id) {
        return this.camisService.getCamiById(id);
    }

    @PutMapping(value = "/cami/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateCamis(
            @PathVariable int id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "sizes", required = false) List<String> sizes,
            @RequestParam(value = "colors", required = false) List<String> colors,
            @RequestParam(value = "type", required = false) Type type,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Float price,
            @RequestParam(value = "discount", required = false) Integer discount,  // Añadir el parámetro discount
            @RequestParam(value = "featured", required = false) Integer featured,    // Añadir el parámetro featured
            @RequestParam(value = "imagen1", required = false) MultipartFile imagen1,
            @RequestParam(value = "imagen2", required = false) MultipartFile imagen2) throws IOException {

        ResponseEntity<Camis> responseEntity = camisService.getCamiById(id);
        Camis existingCamis = responseEntity.getBody();
        if (existingCamis == null) {
            return ResponseEntity.notFound().build();
        }

        // Actualizar solo los campos que no sean nulos o vacíos
        if (name != null) {
            existingCamis.setName(name);
        }
        if (material != null) {
            existingCamis.setMaterial(material);
        }
        if (sizes != null && !sizes.isEmpty()) {
            List<Size> sizeList = new ArrayList<>();
            for (String size : sizes) {
                try {
                    sizeList.add(Size.valueOf(size.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Tamaño inválido: " + size);
                }
            }
            existingCamis.setSizes(sizeList);
        }
        if (colors != null && !colors.isEmpty()) {
            List<Color> colorList = new ArrayList<>();
            for (String color : colors) {
                try {
                    colorList.add(Color.valueOf(color.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Color inválido: " + color);
                }
            }
            existingCamis.setColors(colorList);
        }
        if (type != null) {
            existingCamis.setType(type);
        }
        if (description != null) {
            existingCamis.setDescription(description);
        }
        if (price != null) {
            existingCamis.setPrice(price);
        }
        if (discount != null) {
            existingCamis.setDiscount(discount);
        }
        if (featured != null) {
            existingCamis.setFeatured(featured);
        }
        if (imagen1 != null && !imagen1.isEmpty()) {
            existingCamis.setImagen1(imagen1.getBytes());
        }
        if (imagen2 != null && !imagen2.isEmpty()) {
            existingCamis.setImagen2(imagen2.getBytes());
        }

        return this.camisService.updateCamis(id, existingCamis);
    }


    @GetMapping("/camis/search")
    public ResponseEntity<Page<Camis>> searchCamis(
            @RequestParam("q") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> camisPage = this.camisService.searchCamis(keyword, pageable);
        return ResponseEntity.ok(camisPage);
    }

}
