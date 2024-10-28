package com.example.Joyas.dao;

import com.example.Joyas.model.ColorSinMangas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ColorSinMangasRepository extends JpaRepository<ColorSinMangas, Integer> {
    Optional<ColorSinMangas> findByName(String name);
}
