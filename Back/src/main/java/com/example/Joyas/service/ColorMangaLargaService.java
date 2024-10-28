package com.example.Joyas.service;

import com.example.Joyas.dao.ColorMangaLargaRepository;
import com.example.Joyas.model.ColorMangaLarga;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorMangaLargaService {

    private ColorMangaLargaRepository colorMangaLargaRepository;

    @Autowired
    public ColorMangaLargaService(ColorMangaLargaRepository colorMangaLargaRepository) {
        this.colorMangaLargaRepository = colorMangaLargaRepository;
    }

    public List<ColorMangaLarga> getAllColors() {
        return colorMangaLargaRepository.findAll();
    }

    public Optional<ColorMangaLarga> getColorByName(String name) {
        return colorMangaLargaRepository.findByName(name);
    }
    public ColorMangaLarga addColor(ColorMangaLarga colorMangaLarga) {
        return colorMangaLargaRepository.save(colorMangaLarga);
    }

}
