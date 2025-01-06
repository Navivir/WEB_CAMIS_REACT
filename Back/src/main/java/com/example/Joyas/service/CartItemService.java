package com.example.Joyas.service;

import com.example.Joyas.dao.CartItemRepository;
import com.example.Joyas.dao.UserRepository;
import com.example.Joyas.exceptions.EmptyListException;
import com.example.Joyas.model.Camis;
import com.example.Joyas.model.Cart;
import com.example.Joyas.model.CartItem;
import com.example.Joyas.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
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
        cartItem.setCreated(LocalDateTime.now());

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

    public List<CartItem> getPublished(Pageable pegeable) {
        List<CartItem> published = cartItemRepository.findPublished(pegeable);
        if (published.isEmpty()){
            throw new EmptyListException("La lista está vacia");
        }
        return published;
    }

    public void  publish(@PathVariable Long id){
        Optional<CartItem> item = cartItemRepository.findById(Math.toIntExact(id));
        if(item.isPresent()){
            item.get().setPublished(1);
            cartItemRepository.save(item.get());
        }
        else{
            throw new EntityNotFoundException("No existe el item a añadir");
        }
    }

    public void unpublish(Long id) {
        Optional<CartItem> item = cartItemRepository.findById(Math.toIntExact(id));
        if(item.isPresent()){
            item.get().setPublished(0);
            cartItemRepository.save(item.get());
        }
        else{
            throw new EntityNotFoundException("No existe el item a eliminar");
        }
    }

    public boolean isPublished(Long id) {
        Optional<CartItem> item = cartItemRepository.findById(Math.toIntExact(id));
            if(item.isPresent()){
                return item.get().getPublished() == 1;
            }
            throw new RuntimeException("No se ha podido ver si el item está publicado");
    }
}
