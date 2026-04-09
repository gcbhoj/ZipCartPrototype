package ca.sheridancollege.capstoneprototype.bootstrap;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ca.sheridancollege.capstoneprototype.domain.Product;
import ca.sheridancollege.capstoneprototype.domain.Retailer;
import ca.sheridancollege.capstoneprototype.domain.UnpackagedProduct;
import ca.sheridancollege.capstoneprototype.domain.User;
import ca.sheridancollege.capstoneprototype.repositories.ProductRepository;
import ca.sheridancollege.capstoneprototype.repositories.RetailerRepository;
import ca.sheridancollege.capstoneprototype.repositories.UnpackagedProductRepository;
import ca.sheridancollege.capstoneprototype.repositories.UserRepository;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BootstrapData implements CommandLineRunner {

	private UserRepository userRepository;
    private ProductRepository productRepository;
    private RetailerRepository retailerRepository;
    private UnpackagedProductRepository unpackagedProductRepository;
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
	                    .prodId(1L)
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
	                    .prodId(2L)
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
	            		   // Retailer.builder().retailerId(1L).retailerName("Loblaws").build(),
	            		    Retailer.builder()
	            		        .retailerId(1L)
	            		        .retailerName("Walmart")
	            		        .retailerUrl("https://www.walmart.ca/en")
	            		        .retailerLogoUrl("https://imgs.search.brave.com/VyNoN5FrTe5-oGUUzjHq2nQ16JJ7yjT2d2WL93vHuhg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L3dhbG1hcnQtbG9n/by0yNC5qcGc33")
	            		        .build()
	            		);
	            		retailerRepository.saveAll(retailers);
	            
	            		
        		List<UnpackagedProduct> unpackagedProducts = Arrays.asList(

        	            // ================================
        	            // LB/KG ITEMS
        	            // ================================
        	            UnpackagedProduct.builder().name("Zucchini").pricingType("lb_kg").pricePerLb(2.44).pricePerKg(5.38).imageUrl("https://img.freepik.com/premium-photo/fresh-zucchini-with-basil-wooden-table-close-up_392895-40808.jpg?semt=ais_hybrid&w=740&q=80").build(),
        	            UnpackagedProduct.builder().name("Ginger").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/042/706/760/small/ginger-root-and-ginger-slice-fresh-ginger-root-and-ground-ginger-spice-photo.jpeg").build(),
        	            UnpackagedProduct.builder().name("SweetPotato").pricingType("lb_kg").pricePerLb(1.44).pricePerKg(3.17).imageUrl("https://thumbs.dreamstime.com/b/roasted-sweet-potatoes-27173175.jpg").build(),
        	            UnpackagedProduct.builder().name("Carrot").pricingType("lb_kg").pricePerLb(1.84).pricePerKg(4.06).imageUrl("https://cdn.pixabay.com/photo/2016/07/11/00/18/carrots-1508847_640.jpg").build(),
        	            UnpackagedProduct.builder().name("Tomato").pricingType("lb_kg").pricePerLb(1.92).pricePerKg(4.23).imageUrl("https://www.sciencealert.com/images/2018-05/processed/GettyImages-653271350_600.jpg").build(),
        	           // UnpackagedProduct.builder().name("Plantain").pricingType("lb_kg").pricePerLb(1.22).pricePerKg(2.68).build(),
        	            UnpackagedProduct.builder().name("Grapes").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.55).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/027/810/839/small/realistic-of-different-kind-of-grapes-top-view-fruit-scenery-ai-generated-photo.jpg").build(),
        	            //UnpackagedProduct.builder().name("Papaya").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	           // UnpackagedProduct.builder().name("Yfm Tomato Clst").pricingType("lb_kg").pricePerLb(2.94).pricePerKg(null).build(),
        	            UnpackagedProduct.builder().name("Garlic").pricingType("lb_kg").pricePerLb(0.87).pricePerKg(null).imageUrl("https://t3.ftcdn.net/jpg/01/78/30/22/360_F_178302258_znPBxI9TQNYtIIF4fAx9qAPyuFXY4zDu.jpg").build(),
        	           // UnpackagedProduct.builder().name("Squash Spaghetti").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	            //UnpackagedProduct.builder().name("Squash Acorn").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	            //UnpackagedProduct.builder().name("Squash Butternut").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	            UnpackagedProduct.builder().name("Eggplant").pricingType("lb_kg").pricePerLb(2.47).pricePerKg(5.44).imageUrl("https://st.depositphotos.com/1002351/1351/i/450/depositphotos_13513689-stock-photo-eggplant-or-aubergine-and-parsley.jpg").build(),
        	           // UnpackagedProduct.builder().name("Yucca Root").pricingType("lb_kg").pricePerLb(1.47).pricePerKg(3.24).build(),
        	          //  UnpackagedProduct.builder().name("Karela").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.54).build(),
        	           // UnpackagedProduct.builder().name("Lobokdaikon").pricingType("lb_kg").pricePerLb(1.47).pricePerKg(3.24).build(),
        	           // UnpackagedProduct.builder().name("Rutabagas").pricingType("lb_kg").pricePerLb(0.97).pricePerKg(2.14).build(),
        	           // UnpackagedProduct.builder().name("White Onion").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	           // UnpackagedProduct.builder().name("Yellow Onion").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	            UnpackagedProduct.builder().name("Onion").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://cdn.pixabay.com/photo/2014/10/22/21/53/red-onions-vegetables-499066_640.jpg").build(),
        	           // UnpackagedProduct.builder().name("Sweet Onion").pricingType("lb_kg").pricePerLb(2.47).pricePerKg(5.45).build(),
        	            UnpackagedProduct.builder().name("Potato").pricingType("lb_kg").pricePerLb(1.47).pricePerKg(3.24).imageUrl("https://media.istockphoto.com/id/911576592/photo/potato.jpg?s=612x612&w=0&k=20&c=XundLPXFeGOvgle8_j1rqyg4ebawkId67dEE4E_rMx4=").build(),
        	            //UnpackagedProduct.builder().name("Beefsteak Tomato").pricingType("lb_kg").pricePerLb(2.64).pricePerKg(5.82).build(),
        	            UnpackagedProduct.builder().name("soy beans").pricingType("lb_kg").pricePerLb(3.47).pricePerKg(7.65).imageUrl("https://t3.ftcdn.net/jpg/05/75/86/54/360_F_575865452_ZjmR5yEv2cgo5xL4aUF3T8iZy05wtDlv.jpg").build(),
        	            //UnpackagedProduct.builder().name("Green Beans").pricingType("lb_kg").pricePerLb(3.47).pricePerKg(7.65).build(),
        	           // UnpackagedProduct.builder().name("Okra").pricingType("lb_kg").pricePerLb(5.97).pricePerKg(null).build(),
        	            UnpackagedProduct.builder().name("Cabbage").pricingType("lb_kg").pricePerLb(1.77).pricePerKg(3.90).imageUrl("https://media.gettyimages.com/id/1629366167/photo/cabbage-vegetable-cabbage-savoy-cabbage-vegetables-schleswig-holstein-germany.jpg?s=612x612&w=0&k=20&c=yqllbxJ5wFW7EEnyu6h2izVt7Ts219_p4aDNlsFJf1M=").build(),
        	           // UnpackagedProduct.builder().name("Flat Cabbage").pricingType("lb_kg").pricePerLb(1.77).pricePerKg(3.90).build(),
        	            UnpackagedProduct.builder().name("Turnip").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://images.unsplash.com/photo-1741518009697-9ab172fbe15c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHVybmlwfGVufDB8fDB8fHww").build(),
        	            UnpackagedProduct.builder().name("Banana").pricingType("lb_kg").pricePerLb(0.68).pricePerKg(1.50).imageUrl("https://images.unsplash.com/photo-1668762924684-a9753a0a887c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eWVsbG93JTIwYmFuYW5hfGVufDB8fDB8fHww").build(),
        	            //UnpackagedProduct.builder().name("Asparagus").pricingType("lb_kg").pricePerLb(4.44).pricePerKg(9.79).build(),
        	           // UnpackagedProduct.builder().name("Eggplant Large").pricingType("lb_kg").pricePerLb(2.44).pricePerKg(5.38).build(),
        	            UnpackagedProduct.builder().name("Bell Pepper").pricingType("lb_kg").pricePerLb(2.44).pricePerKg(5.38).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/027/571/266/small/pile-of-bell-peppers-photo.jpg").build(),
        	            //UnpackagedProduct.builder().name("Red Bell Pepper").pricingType("lb_kg").pricePerLb(2.94).pricePerKg(6.48).build(),
        	            //UnpackagedProduct.builder().name("Orange Bell Pepper").pricingType("lb_kg").pricePerLb(2.94).pricePerKg(6.48).build(),
        	            //UnpackagedProduct.builder().name("Yellow Bell Pepper").pricingType("lb_kg").pricePerLb(2.94).pricePerKg(6.48).build(),
        	            //UnpackagedProduct.builder().name("Green Cabbage").pricingType("lb_kg").pricePerLb(0.97).pricePerKg(2.14).build(),
        	            //UnpackagedProduct.builder().name("Red Cabbage").pricingType("lb_kg").pricePerLb(1.62).pricePerKg(3.57).build(),
        	            //UnpackagedProduct.builder().name("Tinda").pricingType("lb_kg").pricePerLb(5.43).pricePerKg(11.98).build(),
        	            UnpackagedProduct.builder().name("Orange").pricingType("lb_kg").pricePerLb(1.77).pricePerKg(3.90).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/048/241/790/small/close-up-a-pile-orange-citrus-fruit-fresh-organic-photo.JPG").build(),
        	            UnpackagedProduct.builder().name("Apple").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.istockphoto.com/id/1000593278/photo/red-apples-background-pile-of-fresh-apple-fruits-natural-texture.jpg?s=612x612&w=0&k=20&c=QOoWx63rfhtl9wN9S362RcnEpzn-Z_BRY3eZyQvXz84=").build(),
        	           // UnpackagedProduct.builder().name("Granny Smith Apple").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.55).build(),
        	            UnpackagedProduct.builder().name("Pear").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.55).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/026/947/625/small/fresh-pear-fruits-ai-generative-photo.jpeg").build(),
        	            //UnpackagedProduct.builder().name("Pear Anjou").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.55).build(),
        	            //UnpackagedProduct.builder().name("Pear Bosc Bulk").pricingType("lb_kg").pricePerLb(2.97).pricePerKg(6.55).build(),
        	            //UnpackagedProduct.builder().name("Pear Bartlett Bulk").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),

        	            
        	            UnpackagedProduct.builder().name("beetroot").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://thumbs.dreamstime.com/b/fresh-raw-beetroots-white-plate-close-up-image-showing-bunch-earthy-skins-displayed-393256664.jpg").build(),
        	            UnpackagedProduct.builder().name("capsicum").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://www.organicfacts.net/wp-content/uploads/capsicum.jpg").build(),
        	            //UnpackagedProduct.builder().name("carrot").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).build(),
        	            UnpackagedProduct.builder().name("chilli pepper").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.istockphoto.com/id/2195781853/photo/cayenne-pepper.jpg?s=612x612&w=0&k=20&c=POUGAbbrRzMd4IWZjdsoWB0MbOfWqm46gmfl64SYGQw=").build(),
        	            UnpackagedProduct.builder().name("corn").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://www.tastingtable.com/img/gallery/can-eating-raw-corn-make-you-sick/intro-1677081861.jpg").build(),
        	            UnpackagedProduct.builder().name("jalepeno").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://thumbs.dreamstime.com/b/raw-green-organic-jalapeno-peppers-raw-green-organic-jalapeno-peppers-ready-to-cook-116412041.jpg").build(),
        	            UnpackagedProduct.builder().name("paprika").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://t3.ftcdn.net/jpg/12/24/35/60/360_F_1224356055_22H4hueRtQ0TwwjWZQMXMoLqjKBwLe5r.jpg").build(),
        	            UnpackagedProduct.builder().name("raddish").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.gettyimages.com/id/2178156704/photo/fresh-daikon-radishes-at-supermarket.jpg?s=612x612&w=0&k=20&c=9gVlgYpYkvKjJWK-rHshZRTSe_b6DxpQWZ8i2PPKZZc=").build(),
        	            UnpackagedProduct.builder().name("watermelon").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.gettyimages.com/id/182197827/photo/melon-wallpaper.jpg?s=612x612&w=0&k=20&c=-ZMpwnU09zpwdWF_zrzpq4SiKK5SR1J4ViDLDr2EF6s=").build(),
        	            UnpackagedProduct.builder().name("cauliflower").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.istockphoto.com/id/90634594/photo/close-up-of-several-heads-of-cauliflower.webp?a=1&b=1&s=612x612&w=0&k=20&c=zs2R3cD61P0qQ9ln9SY7-m62ybgqEuVB_3AMVrWtelA=").build(),
        	            UnpackagedProduct.builder().name("sweetcorn").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://thumbs.dreamstime.com/b/sweetcorn-cobs-6473697.jpg").build(),
        	            UnpackagedProduct.builder().name("peas").pricingType("lb_kg").pricePerLb(1.97).pricePerKg(4.34).imageUrl("https://media.istockphoto.com/id/1293289275/photo/fresh-frozen-green-peas-background-top-view.jpg?s=612x612&w=0&k=20&c=inXDqDVjkeMR7kLvDQvoJZY6vrfeyW1kQu4hXBuUryc=").build(),


        	            
        	            
        	            // ================================
        	            // COUNT ITEMS
        	            // ================================
        	            UnpackagedProduct.builder().name("Cucumber").pricingType("count").pricePerCount(0.94).imageUrl("https://media.istockphoto.com/id/478377196/photo/cucumber-background.jpg?s=612x612&w=0&k=20&c=0NqGsgxFI231tSmPZb4lmAFdLCFnLlc1TiA-3ZvgoMc=").build(),
        	            UnpackagedProduct.builder().name("Mango").pricingType("count").pricePerCount(0.84).imageUrl("https://media.istockphoto.com/id/153505133/photo/fresh-mangoes.jpg?s=612x612&w=0&k=20&c=EOKtFpIaCOiSmir1CCX5aJbysJONMurt9KITMITWIIo=").build(),
        	            UnpackagedProduct.builder().name("Pineapple").pricingType("count").pricePerCount(2.86).imageUrl("https://media.istockphoto.com/id/1364575163/photo/tasted-and-fresh-pineapple-as-a-background.jpg?s=612x612&w=0&k=20&c=mCU2xZZVn_QRdfdD4zr43-8kQynx-1q0TjvY6P42rPU=").build(),
        	           //UnpackagedProduct.builder().name("Cantaloupe").pricingType("count").pricePerCount(2.86).build(),
        	            UnpackagedProduct.builder().name("Coconut").pricingType("count").pricePerCount(1.87).imageUrl("https://t4.ftcdn.net/jpg/19/26/44/47/360_F_1926444777_9vv19eSaNLq5mDZ2P6XrRFNkrKbUGw5x.jpg").build(),
        	           // UnpackagedProduct.builder().name("Squash Chayote").pricingType("count").pricePerCount(1.47).build(),
        	            UnpackagedProduct.builder().name("Kiwi").pricingType("count").pricePerCount(0.97).imageUrl("https://t4.ftcdn.net/jpg/02/83/83/09/360_F_283830912_tFZpG0l6BzL45zCgGBkvtvZi0jp9GzDz.jpg").build(),
        	           // UnpackagedProduct.builder().name("Purple Passion Fruit").pricingType("count").pricePerCount(1.28).build(),
        	           // UnpackagedProduct.builder().name("Yellow Dragon Fruit").pricingType("count").pricePerCount(3.67).build(),
        	           // UnpackagedProduct.builder().name("Melon Honeydew").pricingType("count").pricePerCount(6.97).build(),
        	           // UnpackagedProduct.builder().name("Broccoli").pricingType("count").pricePerCount(2.94).build(),
        	           // UnpackagedProduct.builder().name("Herbs Mint").pricingType("count").pricePerCount(1.97).build(),
        	            UnpackagedProduct.builder().name("Spinach").pricingType("count").pricePerCount(1.97).imageUrl("https://media.gettyimages.com/id/914104238/photo/full-frame-shot-of-leaf-spinach.jpg?s=612x612&w=0&k=20&c=28qjmNwwsyErsLIaP8ToNj7jLusv97-mu83p94XU4wI=").build(),
        	            //UnpackagedProduct.builder().name("Celery Stalks").pricingType("count").pricePerCount(2.74).build(),
        	            UnpackagedProduct.builder().name("Lettuce").pricingType("count").pricePerCount(3.47).imageUrl("https://www.shutterstock.com/image-photo/iceberg-green-lettuce-farm-fresh-600nw-2462176013.jpg").build(),

        	            //UnpackagedProduct.builder().name("Romaine Lettuce").pricingType("count").pricePerCount(3.47).build(),
        	           // UnpackagedProduct.builder().name("Kale Green").pricingType("count").pricePerCount(1.97).build(),
        	            //UnpackagedProduct.builder().name("Green Leaf Lettuce").pricingType("count").pricePerCount(3.27).build(),
        	           // UnpackagedProduct.builder().name("Herbs Dill").pricingType("count").pricePerCount(2.77).build(),
        	           // UnpackagedProduct.builder().name("Curly Parsley").pricingType("count").pricePerCount(1.97).build(),
        	            //UnpackagedProduct.builder().name("Flat Parsley").pricingType("count").pricePerCount(1.97).build(),
        	           // UnpackagedProduct.builder().name("Green Onion").pricingType("count").pricePerCount(1.97).build(),
        	            UnpackagedProduct.builder().name("Pomegranate").pricingType("count").pricePerCount(2.97).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/008/584/677/small/ripe-tasty-pomegranate-photo.jpg").build(),
        	           // UnpackagedProduct.builder().name("Avacado").pricingType("count").pricePerCount(1.44).build(),
        	            //UnpackagedProduct.builder().name("Red Mango").pricingType("count").pricePerCount(1.97).build(),
        	         //  UnpackagedProduct.builder().name("Lime").pricingType("count").pricePerCount(0.67).build(),
        	            UnpackagedProduct.builder().name("Lemon").pricingType("count").pricePerCount(0.76).imageUrl("https://static.vecteezy.com/system/resources/thumbnails/024/859/507/small/a-background-of-lemons-lemons-pattern-background-generative-ai-free-photo.jpg").build()
        	          //UnpackagedProduct.builder().name("Grapefruit Red").pricingType("count").pricePerCount(2.47).build()
        	        );

        	        unpackagedProductRepository.saveAll(unpackagedProducts);
	            	    

	}

}
