package com.example.Joyas.dao;

import com.example.Joyas.model.Color;
import com.example.Joyas.model.ColorCami;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorCamiRepository extends JpaRepository<ColorCami, Integer> {
    ColorCami findByColor(Color color);
}
