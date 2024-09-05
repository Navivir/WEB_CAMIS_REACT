package com.example.Joyas.dao;

import com.example.Joyas.model.Camis;
import com.example.Joyas.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}
