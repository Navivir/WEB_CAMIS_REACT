package com.example.Joyas.dao;

import com.example.Joyas.model.ColorMangaLarga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ColorMangaLargaRepository extends JpaRepository<ColorMangaLarga, Integer> {
    Optional<ColorMangaLarga> findByName(String name);
}
