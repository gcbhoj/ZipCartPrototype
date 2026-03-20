package ca.sheridancollege.capstoneprototype.bootstap;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ca.sheridancollege.bijumonk.beans.Product;
import ca.sheridancollege.bijumonk.beans.Retailer;
import ca.sheridancollege.bijumonk.beans.User;
import ca.sheridancollege.bijumonk.repositories.ProductRepository;
import ca.sheridancollege.bijumonk.repositories.RetailerRepository;
import ca.sheridancollege.bijumonk.repositories.UserRepository;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BootStrapData implements CommandLineRunner {

	private UserRepository userRepository;
    private ProductRepository productRepository;
    private RetailerRepository retailerRepository;
    
	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub

		List<User> users = List.of(
	            User.builder()
	                .userId(1L)
	                .userName("Alice Johnson")
	                .email("alice@example.com")
	                .phone(416-555-0101)
	                .build(),
	            User.builder()
	                .userId(2L)
	                .userName("Bob Smith")
	                .email("bob@example.com")
	                .phone(416-555-0202)
	                .build(),
	            User.builder()
	                .userId(3L)
	                .userName("Carol White")
	                .email("carol@example.com")
	                .phone(416-555-0303)
	                .build()
	        );

	        userRepository.saveAll(users);
	        
	        
	        
	        Calendar cal = Calendar.getInstance();

	        // Product 1
	        cal.set(2023, Calendar.JANUARY, 15);
	        Date mfgDate1 = cal.getTime();
	        cal.set(2025, Calendar.JANUARY, 15);
	        Date expDate1 = cal.getTime();

	        // Product 2
	        cal.set(2024, Calendar.MARCH, 10);
	        Date mfgDate2 = cal.getTime();
	        cal.set(2026, Calendar.MARCH, 10);
	        Date expDate2 = cal.getTime();
	        
	        
	        List<Product> products = List.of(
	                Product.builder()
	                    .barcode("0123456789012")
	                    .productName("Organic Oat Milk")
	                    .imageURL("https://digital.loblaws.ca/PCX/21416312_EA/en/1/6366720102_en_front_centre_marketing_1_GS1_Ecommerce_400.png")
	                    .price(4.99)
	                    .weight("946ml")
	                    .ingredients("Water,Oats,Sunflower Oil,Salt,Vitamins")
	                    .manufacturedDate(mfgDate1)
	                    .expiryDate(expDate1)
	                    .manufacturer("Nature's Best Co.")
	                    .manufacturedIn("Canada")
	                    .aboutProduct("Creamy organic oat milk, perfect for coffee and cereal.")
	                    .quantity(1)
	                    .build(),
	                    
	             Product.builder()
	                    .barcode("098765432109")
	                    .productName("Dark Chocolate Bar")
	                    .imageURL("https://www.lindt.ca/media/catalog/product/2/b/2bf31f40b3323697b2046e459b970356237005384af43ad67e90755169fd1c1b.png?quality=80&fit=bounds&height=310&width=310&canvas=310:310")
	                    .price(3.49)
	                    .weight("100g")
	                    .ingredients("Cocoa Mass,Sugar,Cocoa Butter,Vanilla Extract")
	                    .manufacturedDate(mfgDate2)
	                    .expiryDate(expDate2)
	                    .manufacturer("ChocoWorld Inc.")
	                    .manufacturedIn("Belgium")
	                    .aboutProduct("Rich 70% dark chocolate made from ethically sourced cocoa beans.")
	                    .quantity(2)
	                    .build()
	        		);
	              
	             productRepository.saveAll(products);

	             
	             List<Retailer> retailers = List.of(
	            		    Retailer.builder().retailerId(1L).retailerName("Loblaws").build(),
	            		    Retailer.builder().retailerId(2L).retailerName("Walmart").build()
	            		);
	            		retailerRepository.saveAll(retailers);
	}

}
