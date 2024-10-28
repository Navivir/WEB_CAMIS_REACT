package com.example.Joyas.service;

import com.example.Joyas.dao.ColorCamiRepository;
import com.example.Joyas.model.ColorCami;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorCamiService {

    private ColorCamiRepository colorCamiRepository;

    @Autowired
    public ColorCamiService(ColorCamiRepository colorCamiRepository) {
        this.colorCamiRepository = colorCamiRepository;
    }

    public List<ColorCami> getAllColors() {
        return colorCamiRepository.findAll();
    }

    public Optional<ColorCami> getColorByName(String name) {
        return colorCamiRepository.findByName(name);
    }
    public ColorCami addColor(ColorCami colorCami) {
        return colorCamiRepository.save(colorCami);
    }


}
