package com.example.Joyas.service;

import com.example.Joyas.dao.CamisRepository;
import com.example.Joyas.model.Camis;
import com.example.Joyas.model.Review;
import com.example.Joyas.dao.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CamisRepository camisRepository;


    public ResponseEntity<Review> createReview(Review review) {
        // Buscar el objeto Camis por el ID que viene en la reseña
        Optional<Camis> camis = camisRepository.findById(review.getCamis().getId());

        if (camis.isPresent()) {
            // Asigna la entidad Camis a la reseña
            review.setCamis(camis.get());

            // Guarda la reseña en la base de datos
            Review savedReview = reviewRepository.save(review);
            return ResponseEntity.ok(savedReview);
        } else {
            // Si no se encuentra la camiseta, devuelve un error
            return ResponseEntity.badRequest().body(null);
        }
    }


    public ResponseEntity<Review> getReviewById(int id) {
        Optional<Review> review = reviewRepository.findById(id);
        return review.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    public ResponseEntity<List<Review>> getAllReviewsByCamisId(int camisId) {
        List<Review> reviews = reviewRepository.findByCamisId(camisId);
        return ResponseEntity.ok(reviews);
    }


    public ResponseEntity<Page<Review>> getAllReviews(Pageable pageable) {
        Page<Review> reviews = reviewRepository.findAll(pageable);
        return ResponseEntity.ok(reviews);
    }


    public ResponseEntity<Review> updateReview(int id, Review review) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        review.setId(id);
        Review updatedReview = reviewRepository.save(review);
        return ResponseEntity.ok(updatedReview);
    }


    public ResponseEntity<Void> deleteReview(int id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
