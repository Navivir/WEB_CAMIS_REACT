package com.example.Joyas.service;

import com.example.Joyas.dao.ColorCamiRepository;
import com.example.Joyas.model.Color;
import com.example.Joyas.model.ColorCami;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ColorCamiService {

    private ColorCamiRepository colorCamiRepository;

    @Autowired
    public ColorCamiService(ColorCamiRepository colorCamiRepository) {
        this.colorCamiRepository = colorCamiRepository;
    }
    public ColorCami findByColorName(String colorName) {
        return colorCamiRepository.findByColor(Color.valueOf(colorName.toUpperCase()));
    }
    public ColorCami addColor(ColorCami colorCami) {
        return colorCamiRepository.save(colorCami);
    }


}
