package com.example.Joyas.service;

import com.example.Joyas.dao.CamisRepository;
import com.example.Joyas.model.Camis;
import com.example.Joyas.model.Cart;
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
    public Page<Camis> getFeaturedCamis(Pageable pageable) {
        return camisRepository.findByFeatured(1, pageable);  // Busca donde featured es 1
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


}
