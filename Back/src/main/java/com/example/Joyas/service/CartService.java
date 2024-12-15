package com.example.Joyas.service;

import com.example.Joyas.dao.CartRepository;
import com.example.Joyas.dao.CartItemRepository;
import com.example.Joyas.model.Cart;
import com.example.Joyas.model.User;
import com.example.Joyas.model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import com.example.Joyas.config.JwtUtil;
import java.util.Objects;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    public void addToCart(String token, CartItem cartItem) {

        Cart cart = cartRepository.findByToken(token)
                .filter(c -> c.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseGet(() -> new Cart());

        if (cartItem == null) {
            throw new IllegalArgumentException("El artículo del carrito no puede ser nulo.");
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item ->
                        Objects.equals(cartItem.getName(), item.getName()) &&
                                Objects.equals(cartItem.getSize(), item.getSize()) &&
                                Objects.equals(cartItem.getColor(), item.getColor()) &&
                                cartItem.getId_cami() == item.getId_cami() &&
                                cartItem.getType() == item.getType()
                )
                .findFirst().orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
            existingItem.setImage(cartItem.getImage()); // Actualizar la imagen también
            existingItem.setDiscount(cartItem.getDiscount()); // Actualizar el descuento también
        } else {
            cart.getItems().add(cartItem);
            cart.setCreatedAt(LocalDateTime.now());
            cart.setExpiresAt(LocalDateTime.now().plusHours(6));
            boolean expired = JwtUtil.isTokenExpired(token);
            if (expired){
                String newToken = JwtUtil.generateShortLivedToken("anonymousUser");
                cart.setToken(newToken);
            }
            else{
                cart.setToken(token);
            }

        }

        try {
            cartRepository.save(cart);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el carrito en la base de datos.", e);
        }
    }
    public void addToCartUser(String token, User user, CartItem cartItem) {
        if (cartItem == null) {
            throw new IllegalArgumentException("El artículo del carrito no puede ser nulo.");
        }

        Cart cart = cartRepository.findByToken(token)
                .filter(c -> c.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseGet(() -> new Cart());

        if (user != null) {
            cart.setUser(user);
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getName().equals(cartItem.getName()) &&
                        item.getSize().equals(cartItem.getSize()) &&
                        item.getColor().equals(cartItem.getColor()) &&
                        item.getId_cami() == cartItem.getId_cami())
                .findFirst().orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
            existingItem.setImage(cartItem.getImage());
            existingItem.setDiscount(cartItem.getDiscount());
        } else {
            cart.getItems().add(cartItem);
            cart.setCreatedAt(LocalDateTime.now());
            cart.setExpiresAt(LocalDateTime.now().plusHours(6));
            boolean expired = JwtUtil.isTokenExpired(token);
            if (expired){
                String newToken = JwtUtil.generateShortLivedToken("anonymousUser");
                cart.setToken(newToken);
            }
            else{
                cart.setToken(token);
            }
        }

        try {
            LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);
            cart.setExpiresAt(expiresAt);

            cartRepository.save(cart);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el carrito en la base de datos.", e);
        }
    }

    public Cart getCartByToken(String token) {
        return cartRepository.findByToken(token).orElse(null);
    }


    public void removeFromCart(String token, Long itemId) {
        Cart cart = cartRepository.findByToken(token).orElse(null);
        if (cart != null) {
            cart.getItems().removeIf(item -> item.getId().equals(itemId));
            cartRepository.save(cart);
        }
    }

    public void updateCartItemQuantity(String token, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findByToken(token).orElse(null);
        if (cart != null) {
            CartItem item = cart.getItems().stream()
                    .filter(cartItem -> cartItem.getId().equals(itemId))
                    .findFirst()
                    .orElse(null);

            if (item != null) {
                item.setQuantity(quantity);
                cartRepository.save(cart);
            } else {
                throw new IllegalArgumentException("Item no encontrado en el carrito");
            }
        } else {
            throw new IllegalArgumentException("Carrito no encontrado");
        }
    }
    public String getTokenByUserId(int userId) {
        Cart cart = cartRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
        if (cart != null) {
            return cart.getToken();
        }
        return null;
    }
}
