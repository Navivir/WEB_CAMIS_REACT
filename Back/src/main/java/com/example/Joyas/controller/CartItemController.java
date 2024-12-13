package com.example.Joyas.controller;

import com.example.Joyas.model.CartItem;
import com.example.Joyas.service.CartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartItem")
public class CartItemController {

    private CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService){
        this.cartItemService = cartItemService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartItemsByUser(@PathVariable Integer userId) {
        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().body("El ID del usuario no es válido.");
        }

        List<CartItem> cartItems = cartItemService.getCartItemsByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay artículos en el carrito para este usuario.");
        }

        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addCartItemToUser(@PathVariable Integer userId, @RequestBody CartItem cartItem) {
        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().body("El ID del usuario no es válido.");
        }

        try {
            CartItem savedCartItem = cartItemService.addCartItemToUser(userId, cartItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCartItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el cartItem.");
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Integer itemId) {
        try {
            cartItemService.removeFromCart(itemId);
            return ResponseEntity.ok().body(new CartController.ResponseMessage("Item eliminado de Mis Diseños"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CartController.ResponseMessage("Error al eliminar de Mis Diseños"));
        }
    }

}
