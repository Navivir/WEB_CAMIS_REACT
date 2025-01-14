package com.example.Joyas.controller;

import com.example.Joyas.model.*;
import com.example.Joyas.service.CamisService;
import com.example.Joyas.service.ColorCamiService;
import com.example.Joyas.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CamisController {
    @Autowired
    private CamisService camisService;
    @Autowired
    private ColorCamiService colorCamiService;

    @Autowired
    private UserService userService;

    public CamisController(CamisService camisService, ColorCamiService colorCamiService, UserService userService) {

        this.camisService = camisService;
        this.colorCamiService = colorCamiService;
        this.userService = userService;
    }

    @GetMapping("/camis")
    public ResponseEntity<?> getCamis() {
        return this.camisService.getCamis();
    }

    @GetMapping("/getCamiByName")
    public ResponseEntity<?> getCamiByName(@PathVariable String name){
        if (name == null || name.trim().isEmpty()){
            return ResponseEntity.badRequest().body("The name is null or empty");
        }
        Camis cami = camisService.findByName(name);

        return ResponseEntity.ok().body(cami);
    }
    @GetMapping("/camis_page")
    public ResponseEntity<Page<Camis>> getCamisPagable(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> camisPage = this.camisService.getCamisPagable(pageable);
        return ResponseEntity.ok(camisPage);
    }

    @GetMapping("/get-camis-user-id/{user_id}")
    public ResponseEntity<PagedModel<?>> getCamisByUserId(
            @PathVariable Integer user_id,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit,
            PagedResourcesAssembler<Camis> pagedResourcesAssembler) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> camis = camisService.getCamisByUserId(pageable, user_id);
        PagedModel<?> pagedModel = pagedResourcesAssembler.toModel(camis);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/published")
    public ResponseEntity<PagedModel<EntityModel<Camis>>> getPublishedCamis(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            PagedResourcesAssembler<Camis> pagedResourcesAssembler) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Camis> featuredCamis = this.camisService.getPublishedCamis(pageable);
        PagedModel<EntityModel<Camis>> pagedModel = pagedResourcesAssembler.toModel(featuredCamis);
        return ResponseEntity.ok(pagedModel);
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
            @RequestParam(value = "discount", required = false) Integer discount,
            @RequestParam(value = "published", required = false) Integer published,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Float price,
            @RequestParam(value = "imagen1", required = false) MultipartFile imagen1) throws IOException {

        Camis cami = new Camis();

        if (name != null) {
            cami.setName(name);
        }

        if (discount != null) {
            cami.setDiscount(discount);
        }
        if (published != null) {
            cami.setPublished(published);
        }
        if (description != null) {
            cami.setDescription(description);
        }
        if (price != null) {
            cami.setPrice(price);
        }
        if (imagen1 != null && !imagen1.isEmpty()) {
            cami.setImagen1(camisService.resizeImage(imagen1, 500));
        }

        camisService.insertCami(cami);
        DesignResponse designResponse = new DesignResponse((long) cami.getId());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(designResponse);
    }

    @GetMapping("/cami/{id}")
    public ResponseEntity<?> getCamiById(@PathVariable int id) {
        return this.camisService.getCamiById(id);
    }

    @PutMapping(value = "/cami/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateCamis(
            @PathVariable int id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "discount", required = false) Integer discount,
            @RequestParam(value = "published", required = false) Integer published,
            @RequestParam(value = "imagen1", required = false) MultipartFile imagen1) throws IOException {

        ResponseEntity<Camis> responseEntity = camisService.getCamiById(id);
        Camis existingCamis = responseEntity.getBody();
        if (existingCamis == null) {
            return ResponseEntity.notFound().build();
        }

        // Actualizar solo los campos que no sean nulos o vacíos
        if (name != null) {
            existingCamis.setName(name);
        }
        if (description != null) {
            existingCamis.setDescription(description);
        }
        if (discount != null) {
            existingCamis.setDiscount(discount);
        }
        if (published != null) {
            existingCamis.setPublished(published);
        }
        if (imagen1 != null && !imagen1.isEmpty()) {
            existingCamis.setImagen1(camisService.resizeImage(imagen1, 500));
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

    @DeleteMapping("/cami/{id}")
    public ResponseEntity <?> removeCami(@PathVariable int id){
        try {
            camisService.removeCami(id);
            return ResponseEntity.ok().body(new CartController.ResponseMessage("Cami eliminada de DB"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CartController.ResponseMessage("Error al eliminar Cami"));
        }
    }

    @PostMapping("/add-new-cami/{userId}")
    public ResponseEntity<DesignResponse> addNewCamiToUser(
            @PathVariable Long userId,
            @RequestParam("name") String name,
            @RequestParam("imagen1") MultipartFile image) throws IOException {

        Camis cami = new Camis();
        cami.setName(name);

        cami.setImagen1(camisService.resizeImage(image, 500));

        userService.addNewCamiToUser(userId, cami);

        DesignResponse designResponse = new DesignResponse((long) cami.getId());

        // Devuelve la respuesta como JSON
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(designResponse);
    }

    @PostMapping("/publish/{id}")
    public ResponseEntity<?> publish(@PathVariable Long id){
        if (id<= 0 ||id == null){
            return ResponseEntity.badRequest().body("El ID debe ser un valor mayor que 0.");
        }
        return camisService.publish(id);

    }

    @PostMapping("/unpublish/{id}")
    public ResponseEntity<?> unpublish(@PathVariable Long id){
        if (id<= 0 ||id == null){
            return ResponseEntity.badRequest().body("El ID debe ser un valor mayor que 0.");
        }
        return camisService.unpublish(id);

    }

    @GetMapping("/is-published/{id}")
    public ResponseEntity<?> isPublished(@PathVariable Long id){
        if (id<= 0 ||id == null){
            return ResponseEntity.badRequest().body("El ID debe ser un valor mayor que 0.");
        }
        try {
            boolean isPublished = camisService.isPublished(id);
            if (isPublished) {
                return ResponseEntity.ok().body("Img publicada");
            }
            else{
                return ResponseEntity.ok().body("Img no publicada");
            }
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }


    }


}
