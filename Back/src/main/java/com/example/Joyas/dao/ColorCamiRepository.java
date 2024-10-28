package com.example.Joyas.dao;

import com.example.Joyas.model.ColorCami;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorCamiRepository extends JpaRepository<ColorCami, Integer> {
    Optional<ColorCami> findByName(String name);
}
