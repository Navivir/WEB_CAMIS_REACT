package com.example.Joyas.service;

import com.example.Joyas.dao.CamisRepository;
import com.example.Joyas.exceptions.ItemNotFoundException;
import com.example.Joyas.model.Camis;
import jakarta.persistence.EntityNotFoundException;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CamisService {
    private CamisRepository camisRepository;
    @Autowired
    public CamisService(CamisRepository camisRepository) {this.camisRepository = camisRepository;}
    public ResponseEntity<?> getCamis() {
        List<Camis> camis = camisRepository.findAll();
        if (!camis.isEmpty()){
            return ResponseEntity.ok(camis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    public Camis findByName(String name) {
        return camisRepository.findByName(name)
                .orElseThrow(() -> new ItemNotFoundException("Cami Not Found"));
    }

    public ResponseEntity<?> insertCami(Camis cami) {
        if (cami == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Cami data provided");
        }
        try {
            camisRepository.save(cami);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create cami. Please try " +
                    "again later.\n" + e);
        }
        return ResponseEntity.ok("Cami inserted Succesfully");
    }

    public ResponseEntity<Camis> getCamiById(int id) {
        Optional<Camis> cami = camisRepository.findById(id);
        if (cami.isPresent()) {
            return ResponseEntity.ok(cami.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> updateCamis(int id, Camis camis) {
        if (camis == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid cami data provided");
        }
        if (id <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID provided: " + id);
        }
        camis.setId(id);
        try {
            camisRepository.save(camis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update cami. Please try " +
                    "again later.\n" + e);
        }
        return ResponseEntity.ok(camis);
    }

    public Page<Camis> searchCamis(String keyword, Pageable pageable) {
        return camisRepository.searchCamisByKeyword(keyword, pageable);
    }

    public Page<Camis> getCamisPagable(Pageable pageable) {
        return camisRepository.findAll(pageable);
    }



    public Page<Camis> getDiscountedCamis(Pageable pageable) {
        return camisRepository.findByDiscountGreaterThan(0, pageable);
    }

    public void removeCami(int camiId) {
        Optional<Camis> cami = camisRepository.findById(camiId);
        if (cami.isPresent()) {
            camisRepository.delete(cami.get()); // Elimina la camiseta si está presente
        } else {
            // Maneja el caso donde la camiseta no fue encontrada
            throw new EntityNotFoundException("Camiseta no encontrada con ID: " + camiId);
        }
    }
    public byte[] resizeImage(MultipartFile image, int targetWidth) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        // Redimensionar la imagen
        Thumbnails.of(image.getInputStream())
                .width(targetWidth) // Ancho deseado
                .keepAspectRatio(true)
                .toOutputStream(byteArrayOutputStream);

        return byteArrayOutputStream.toByteArray();
    }


    public Page<Camis> getCamisByUserId (Pageable pegeable,Integer userId) {
        if(userId == null && userId < 0){
            throw new IllegalArgumentException("User Id Invalid");

        }
        Page<Camis> camis = camisRepository.findByUserId(userId, pegeable);
        if (camis.isEmpty()){
            throw new EntityNotFoundException("No camis found for userId: " + userId);
        }
        return camis;
    }

    public ResponseEntity<?> publish(Long id) {
        Optional<Camis> cami = camisRepository.findById(Math.toIntExact((Long) id));
        if(cami.isPresent()){
            cami.get().setPublished(1);
            camisRepository.save(cami.get());
            return ResponseEntity.ok().body("Imagen de producto insertada a publicados");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se encontró la imagen");

    }

    public ResponseEntity<?> unpublish(Long id) {
        Optional<Camis> cami = camisRepository.findById(Math.toIntExact((Long) id));
        if(cami.isPresent()){
            cami.get().setPublished(0);
            camisRepository.save(cami.get());
            return ResponseEntity.ok().body("Imagen de producto retirada de publicados");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se encontró la imagen");
    }

    public Page<Camis> getPublishedCamis(Pageable pageable) {
        return camisRepository.findByPublished(1, pageable);
    }

    public boolean isPublished(Long id) {
        Optional<Camis> cami = camisRepository.findById(Math.toIntExact(id));
        if(cami.get().getPublished() == 1){
            return true;
        }
        else {
            return false;
        }
    }
}
