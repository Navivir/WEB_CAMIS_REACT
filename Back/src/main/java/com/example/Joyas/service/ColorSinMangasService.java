package com.example.Joyas.service;

import com.example.Joyas.dao.ColorCamiRepository;
import com.example.Joyas.dao.ColorSinMangasRepository;
import com.example.Joyas.model.ColorCami;
import com.example.Joyas.model.ColorSinMangas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorSinMangasService {

    private ColorSinMangasRepository colorSinMangasRepository;

    @Autowired
    public ColorSinMangasService(ColorSinMangasRepository colorSinMangasRepository) {
        this.colorSinMangasRepository = colorSinMangasRepository;
    }
    public List<ColorSinMangas> getAllColors() {
        return colorSinMangasRepository.findAll();
    }

    public Optional<ColorSinMangas> getColorByName(String name) {
        return colorSinMangasRepository.findByName(name);
    }
    public ColorSinMangas addColor(ColorSinMangas colorSinMangas) {
        return colorSinMangasRepository.save(colorSinMangas);
    }

}
