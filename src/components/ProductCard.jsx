import { Box, Button, Flex, HStack, IconButton, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductCard = ( { product } ) => {
   const [quantity, setQuantity] = useState(1);
   const [unit, setUnit]         = useState('Bag');

   const dispatch = useDispatch();
 
   const hnadleAddToCart = useCallback( ( product ) => () => {    
        dispatch( addToCart( { ...product, qty: quantity, selectedUnit: unit} ) );
   }  , [ dispatch, quantity, unit ] );

  
   const priceUpdateOnUnitChange = (selectedUnit) => {
       const selected = product?.units?.find((u) => u?.name === selectedUnit);
        if (selected) {
            return selected?.price;
        } else {
            return product?.price;
        } 
    };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
    >
      <Box position="relative" h={{ base: '200px', md: '240px' }}>
        <Image
          src={product.image}
          alt={product.name}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <VStack align="stretch" p={4} spacing={3}>
           <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color="gray.800">
            {product.name}
          </Text> 
        <Flex justify="space-between" align="center">
           <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color="gray.800">
            ₦{priceUpdateOnUnitChange(unit).toLocaleString()}
          </Text>  
          <HStack justify="center" spacing={2}>
          <IconButton
            size="sm"
            icon={<Text>−</Text>}
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            variant="outline"
            borderColor="gray.300"
          />
          <Input
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            textAlign="center"
            w="60px"
            size="sm"
          />
          <IconButton
            size="sm"
            icon={<Text>+</Text>}
            onClick={() => setQuantity(quantity + 1)}
            variant="outline"
            borderColor="gray.300"
          />
        </HStack>
        </Flex>

        <Box>
          <Text fontSize="xs" color="gray.600" mb={2}>
            Measuring Unit:
          </Text>
          <HStack spacing={2}>
              {product?.units?.map((u,id) => (
                   <Button
                      key={id.toString()}
                      size="sm"
                      bg={unit === u?.name ? 'yellow.500' : 'gray.200'}
                      color={unit === u?.name  ? 'white' : 'gray.700'}
                      onClick={() => setUnit(u?.name)}
                      fontSize="xs"
                      _hover={{ bg:'yellow.600'}}
                    >
                    {u?.name}
                  </Button> 
              ))}
          </HStack>
        </Box>

        <Button
          bg="yellow.500"
          color="white"
          size="md"
          w="100%"
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          }
          _hover={{ bg: 'green.600' }}
          _active={{ bg: 'green.700' }}
          onClick={hnadleAddToCart( product )}
        >
          Add to Cart
        </Button>
      </VStack>
    </Box>
  );
}

export default ProductCard