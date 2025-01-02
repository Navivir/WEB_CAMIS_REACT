package com.example.Joyas.dao;

import com.example.Joyas.model.CartItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserId(Integer userId);
    @Query("SELECT c FROM CartItem c WHERE c.published = 1")
    List<CartItem> findPublished(Pageable pegeable);
    @Modifying
    @Transactional
    @Query("UPDATE CartItem c SET c.published = 1 WHERE c.id = :id AND c.published = 0")
    void addToPublished(Long id);

}
