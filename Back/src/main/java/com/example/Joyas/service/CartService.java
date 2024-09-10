package com.example.Joyas.service;

import com.example.Joyas.dao.CartRepository;
import com.example.Joyas.dao.CartItemRepository;
import com.example.Joyas.model.Cart;
import com.example.Joyas.model.User;
import com.example.Joyas.model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    public void addToCart(String token, CartItem cartItem) {
        // Recuperar el carrito del usuario, o crear uno nuevo si no existe
        Cart cart = cartRepository.findByToken(token).orElseGet(() -> new Cart(token));

        if (cartItem == null) {
            throw new IllegalArgumentException("El artículo del carrito no puede ser nulo.");
        }

        // Verificar si el artículo ya existe en el carrito
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getName().equals(cartItem.getName()) &&
                        item.getSize().equals(cartItem.getSize()) &&
                        item.getColor().equals(cartItem.getColor()) &&
                        item.getId_cami() == cartItem.getId_cami())
                .findFirst().orElse(null);

        if (existingItem != null) {
            // Actualizar la cantidad del artículo existente y la imagen
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
            existingItem.setImage(cartItem.getImage()); // Actualizar la imagen también
            existingItem.setDiscount(cartItem.getDiscount()); // Actualizar el descuento también
        } else {
            // Si el artículo no existe, añadirlo al carrito
            cart.getItems().add(cartItem);
        }

        // Guardar los cambios en la base de datos
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

        // Recuperar el carrito por token o crear uno nuevo si no existe
        Cart cart = cartRepository.findByToken(token).orElseGet(() -> new Cart(token));

        // Asociar el usuario con el carrito si se proporciona
        if (user != null) {
            cart.setUser(user);
        }

        // Verificar si el artículo ya existe en el carrito
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getName().equals(cartItem.getName()) &&
                        item.getSize().equals(cartItem.getSize()) &&
                        item.getColor().equals(cartItem.getColor()) &&
                        item.getId_cami() == cartItem.getId_cami())
                .findFirst().orElse(null);

        if (existingItem != null) {
            // Actualizar la cantidad, imagen y descuento del artículo existente
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
            existingItem.setImage(cartItem.getImage());
            existingItem.setDiscount(cartItem.getDiscount());
        } else {
            // Añadir el nuevo artículo al carrito
            cart.getItems().add(cartItem);
        }

        // Guardar los cambios en la base de datos
        try {
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
        // Obtener el carrito más reciente asociado al usuario
        Cart cart = cartRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
        if (cart != null) {
            return cart.getToken();
        }
        return null;
    }
}
