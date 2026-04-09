package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartSummaryResponseDTO {
    private Long cartId;
    private Double totalAmount;
    private Double remainingBudget;
    private List<CartItemViewDTO> items;
    private String qrCodeBase64;     // QR code image in base64 format
    private String message;
}

