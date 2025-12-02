import {
  Box,
  Container,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
  HStack,
  useDisclosure,
  useBreakpointValue, 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { Link, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react'; 

import SideBar from '../components/SideBar';
import ProductCard from '../components/ProductCard'; 

import { GiHamburgerMenu } from "react-icons/gi"; 
import { useSelector } from 'react-redux'; 
import Logo from '../assets/logo.png';

const categories = [
  { name: 'Category 1', count: 2 },
  { name: 'Category 2', count: 3 },
  { name: 'Category 3', count: 4 },
  { name: 'Category 4', count: 5 },
  { name: 'Category 5', count: 6 },
];


const products = [
  { id: 1, catId: 1, name: 'Dried Fish Flakes', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 2, catId: 1, name: 'Fish Rolls',  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 3, catId: 4, name: 'Dried Fish Packs',image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 4, catId: 1, name: 'Frozen Fish',  image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 5, catId: 5, name: 'Dried Crayfish',  image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 6, catId: 5, name: 'Dried Shrimp', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 7, catId: 1, name: 'Smoked Fish', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 8, catId: 3, name: 'Grilled Fish', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 9, catId: 2, name: 'Dried Cod', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 10, catId: 1, name: 'Dried Mackerel', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 11, catId: 3, name: 'Stock Fish', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
  { id: 12, catId: 5, name: 'Dried Fish Mix', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400', units: [{ name: "Bag", price: 4256 }, { name: "half Bag", price: 2128 }] },
];

export default function Home() { 
  const cart          = useSelector( (state)=> state.cart.cart);
  const wishList      = useSelector( (state)=> state.cart.wishList);

  const cartCount     = cart?.length;
  const wishlistCount = wishList?.length;


  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchParams]                            = useSearchParams();
  const [searchValue, setSearchValue]             = useState('');
  const { isOpen, onOpen, onClose }               = useDisclosure();
  const isMobile                                  = useBreakpointValue({ base: true, lg: false }); 
  
  console.log("Cart Store:::",cart);
  // console.log("WishList:::",wishlistCount);

  useEffect(() => {
    const catId = searchParams.get('catId'); 
    let filteredByCat;
     if (catId && searchValue.trim() =='') {
       filteredByCat = products.filter( (p) => p.catId.toString() === catId );
      setDisplayedProducts(filteredByCat);
    } else if(catId && searchValue.trim() ){
       filteredByCat = products.filter( (p) => p.catId.toString() === catId  &&  p.name.toLowerCase().includes(searchValue.trim()) ); 
      setDisplayedProducts(filteredByCat);
    } else if(!catId && searchValue.trim() ){
       filteredByCat = products.filter( (p) => p.name.toLowerCase().includes( searchValue.trim() ) ); 
      setDisplayedProducts(filteredByCat);
    }
    else {
      setDisplayedProducts(products);
    }
  }, [searchParams, searchValue]);


  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <Flex gap={6}>
          <SideBar />

          <Box flex="1">
           {/* NavBar Here */}
             <Box bg="red.50" borderBottom="2px solid" borderColor="gray.200" position="sticky" top={0} zIndex={100}>
                 <Container maxW="container.xl" py={4}>
                   <Flex align="center" justify="space-between" gap={4}>
                     {/* Mobile Sidebar Button */}
                     {isMobile && (
                       <IconButton
                         icon={<GiHamburgerMenu />}
                         onClick={onOpen}
                         variant="ghost"
                         display={{ base: 'flex', lg: 'none' }}
                         aria-label="Open menu"
                       />
                     )}
           
                     {/* Drawer for Sidebar on Mobile */}
                     <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                       <DrawerOverlay />
                       <DrawerContent>
                         <DrawerCloseButton />
                         <DrawerHeader borderBottomWidth="1px" borderColor="red.100" bg="red.50" textAlign="center">
                           <Image src={Logo} alt="Logo" boxSize="40px" mx="auto" />
                         </DrawerHeader>
                         <DrawerBody p={0}>
                           {categories.map((category, index) => (
                             <Box
                               key={index}
                               p={4}
                               borderBottom="1px"
                               borderColor="gray.200"
                               cursor="pointer"
                               _hover={{ bg: 'gray.50' }}
                             >
                               <Flex justify="space-between" align="center">
                                 <Text color="red.700" fontWeight="semibold">
                                   {category.name}
                                 </Text>
                                 <Badge colorScheme="gray" borderRadius="full">
                                   {category.count}
                                 </Badge>
                               </Flex>
                             </Box>
                           ))}
                         </DrawerBody>
                       </DrawerContent>
                     </Drawer>
           
                     {/* 🔍 Search Bar */}
                     <InputGroup maxW={{ base: '300px', md: '500px' }} flex="1">
                       <Input
                         placeholder="Search products..."
                         border="2px solid"
                         borderColor="yellow.700"
                         _hover={{ borderColor: 'yellow.800' }}
                         _focus={{ borderColor: 'yellow.700', boxShadow: 'none' }}
                         value={searchValue}
                         onChange={(e) => setSearchValue(e.target.value)}
                       />
                    
                     </InputGroup>
           
                     {/* 🛒 Icons */}
                     <HStack spacing={4} px={4}>
                       <Box position="relative" cursor="pointer">
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                         </svg>
                         <Badge position="absolute" top="-8px" right="-8px" bg="black" color="white" borderRadius="full" fontSize="xs">
                           {wishlistCount}
                         </Badge>
                       </Box>
           
                       <Box position="relative" cursor="pointer" as={Link} to={'/cart'}>
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <circle cx="9" cy="21" r="1" />
                           <circle cx="20" cy="21" r="1" />
                           <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                         </svg>
                         <Badge position="absolute" top="-8px" right="-8px" bg="red.500" color="white" borderRadius="full" fontSize="xs">
                           {cartCount}
                         </Badge>
                       </Box>
                     </HStack>
                   </Flex>
                 </Container>
              </Box> 
           {/* Products Here */}
            <Grid
              my={4}
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
