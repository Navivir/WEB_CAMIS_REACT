package com.example.Joyas.controller;

import com.example.Joyas.model.Cart;
import com.example.Joyas.model.CartItem;
import com.example.Joyas.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/{token}")
    public ResponseEntity<?> addToCart(@PathVariable String token, @RequestBody CartItem cartItem) {
        try {
            cartService.addToCart(token, cartItem);
            return ResponseEntity.ok().body(new ResponseMessage("Item añadido al carrito"));
        } catch (Exception e) {
            // Log the exception message and stack trace for debugging
            e.printStackTrace(); // Or use a logger to log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage("Error al añadir al carrito: " + e.getMessage()));
        }
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getCart(@PathVariable String token) {
        try {
            Cart cart = cartService.getCartByToken(token);
            if (cart != null) {
                return ResponseEntity.ok(cart.getItems());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Carrito no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseMessage("Error al recuperar el carrito"));
        }
    }
    @DeleteMapping("/{token}/items/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String token, @PathVariable Long itemId) {
        try {
            cartService.removeFromCart(token, itemId);
            return ResponseEntity.ok().body(new ResponseMessage("Item eliminado del carrito"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseMessage("Error al eliminar del carrito"));
        }
    }

    @PutMapping("/{token}/items/{itemId}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable String token,
                                                    @PathVariable Long itemId,
                                                    @RequestParam Integer quantity) {
        try {
            cartService.updateCartItemQuantity(token, itemId, quantity);
            return ResponseEntity.ok().body(new ResponseMessage("Cantidad del ítem actualizada"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseMessage("Error al actualizar la cantidad del ítem"));
        }
    }

    // Clase interna para manejar mensajes de respuesta
    static class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
