import { Badge, Box, HStack, VStack, Text, Image, Center } from '@chakra-ui/react';
import Logo from '../assets/logo.png'; 
import { useSearchParams } from 'react-router';
import { useState } from 'react';

const categories = [
  { catId:1,name: 'Category 1', count: 2 },
  { catId:2,name: 'Category 2', count: 3 },
  { catId:3,name: 'Category 3', count: 4 },
  { catId:4,name: 'Category 4', count: 5 },
  { catId:5,name: 'Category 5', count: 6 },
];
const SideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [catId, setCatId] = useState(searchParams.get('catId') || '');

  const handleCategoryClick = (catId) => {
    if (catId) {
      searchParams.set('catId', catId);
      setCatId(catId);
    }
    setSearchParams(searchParams);
  };
  
  return (
      <VStack 
            align="stretch" 
            spacing={0}
            position="sticky" 
            top={0} 
            zIndex={100}
            w="250px"
            display={{ base: 'none', lg: 'block' }}
            bg="white" 
            boxShadow="md"  
            h="fit-content"
        >
        <Box p={4} borderBottom="1px" borderColor="red.100" align={'center'} backgroundColor={'red.50'}>    
              <Image 
                  src={Logo} 
                  alt="Logo" 
                  boxSize="40px" 
                  objectFit="cover" />      
        </Box>
          {categories.map((category, index) => (
            <Box
              key={index}
              p={4}
              borderBottom="1px"
              borderColor="gray.200"
              cursor="pointer"
              transition="all 0.2s"
              bg={catId.toString() === category.catId.toString() ? 'yellow.500' : 'white'}
              _hover={{ bg: 'gray.50' }}
              // bg={category.icon ? 'blue.50' : 'white'}
              onClick={() => handleCategoryClick(category.catId)}
            >
              <HStack justify="space-between">
                <HStack>
                  {category.icon && (
                    <Box
                      bg="blue.500"
                      color="white"
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                    >
                      i
                    </Box>
                  )}
                  <Text
                    fontWeight={category.name.startsWith('Category') ? 'bold' : 'normal'}
                    color={category.name.startsWith('Category') ? 'red.700' : 'blue.600'}
                  >
                    {category.name}
                  </Text>
                </HStack>
                {category.count && (
                  <Badge colorScheme="gray" borderRadius="full">
                    {category.count}
                  </Badge>
                )}
              </HStack>
            </Box>
          ))}
    
          
        </VStack>
  )
}

export default SideBar