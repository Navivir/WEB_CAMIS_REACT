package com.example.Joyas.service;

import com.example.Joyas.dao.CartItemRepository;
import com.example.Joyas.dao.UserRepository;
import com.example.Joyas.model.Camis;
import com.example.Joyas.model.CartItem;
import com.example.Joyas.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private CartItemRepository cartItemRepository;

    private UserRepository userRepository;

    public CartItemService (CartItemRepository cartItemRepository, UserRepository userRepository){
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }
    public Optional<CartItem> getCartItemById(Integer id) {return cartItemRepository.findById(id);}

    public List<CartItem> getCartItemsByUserId(Integer userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addCartItemToUser(Integer userId, CartItem cartItem) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con el ID: " + userId));

        cartItem.setUser(user);

        return cartItemRepository.save(cartItem);
    }

    public CartItem addCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Integer itemId) {
        Optional<CartItem> cartItem = cartItemRepository.findById(itemId);
        if (cartItem.isPresent()) {
            cartItemRepository.delete(cartItem.get());
        } else {
            // Maneja el caso donde la camiseta no fue encontrada
            throw new EntityNotFoundException("Camiseta no encontrada con ID: " + itemId);
        }


    }



}
