package com.example.Joyas.dao;

import com.example.Joyas.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByCamisId(int camisId);
}
