package com.example.Joyas.controller;

import com.example.Joyas.model.Review;
import com.example.Joyas.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable int id) {
        return reviewService.getReviewById(id);
    }

    @GetMapping("/camis/{camisId}")
    public ResponseEntity<List<Review>> getAllReviewsByCamisId(@PathVariable int camisId) {
        return reviewService.getAllReviewsByCamisId(camisId);
    }

    @GetMapping
    public ResponseEntity<Page<Review>> getAllReviews(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "15") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return reviewService.getAllReviews(pageable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable int id,
            @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable int id) {
        return reviewService.deleteReview(id);
    }
}
