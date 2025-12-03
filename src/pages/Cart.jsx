import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Divider,
  IconButton,
  Badge,
  Grid,
  GridItem,
  useToast,
  Card,
  CardBody,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { FaTrash, FaShoppingCart, FaHome, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';
import { useSelector , useDispatch} from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { Link } from 'react-router';
import Paystack from '@paystack/inline-js';


const deliveryLocations = [
  { area: 'Central Area', price: 1500 },
  { area: 'Garki', price: 2000 },
  { area: 'Wuse', price: 2000 },
  { area: 'Maitama', price: 2500 },
  { area: 'Asokoro', price: 2500 },
  { area: 'Gwarinpa', price: 3000 },
  { area: 'Kubwa', price: 3500 },
  { area: 'Lugbe', price: 4000 },
  { area: 'Kuje', price: 4500 },
  { area: 'Nyanya', price: 3500 },
  { area: 'Mararaba', price: 4000 },
  { area: 'Dutse', price: 3000 },
];


export default function Cart() {
   const cart          = useSelector( (state)=> state.cart.cart);
  const [cartItems, setCartItems] = useState(cart);

    const dispatch = useDispatch();

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    deliveryArea: '',
    additionalNotes: ''
  });
  const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const getItemPrice = (item) => {
    const unit = item.units.find(u => u.name === item.selectedUnit);
    return unit ? unit.price : 0;
  };

  const getItemSubtotal = (item) => {
    return getItemPrice(item) * item.qty;
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + getItemSubtotal(item), 0);
  };

  const getTotal = () => {
    return getSubtotal() + selectedDeliveryPrice;
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeliveryAreaChange = (e) => {
    const selectedArea = e.target.value;
    const location = deliveryLocations.find(loc => loc.area === selectedArea);
    setDeliveryInfo({ ...deliveryInfo, deliveryArea: selectedArea });
    setSelectedDeliveryPrice(location ? location.price : 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  };

  const handleCheckoutSubmit = async () => {
    // Validation
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.deliveryArea) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = generateOrderId();

        const popup = new Paystack() ;

          popup.checkout({
            key: 'pk_test_2ab0e1002f31ac6968555ac9c682b88f0e04576b',
            email: deliveryInfo.email,
            amount: getTotal() * 100, // in kobo
            currency: 'NGN',
            ref: orderId,
            onSuccess: (transaction) => {
              console.log(transaction);
               // Show success message with order ID
              toast({
                title: "Order Placed Successfully! 🎉",
                description: (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Your Order ID: {orderId}</Text>
                    <Text fontSize="sm">Total Amount: {formatCurrency(getTotal())}</Text>
                    <Text fontSize="sm" mt={1}>Please save this ID to track your delivery</Text>
                  </Box>
                ),
                status: "success",
                duration: 10000,
                isClosable: true,
                position: "top",
              });

                    // Clear cart
                setCartItems([]);
                dispatch( clearCart() );
                
                // Reset form
                setDeliveryInfo({
                  fullName: '',
                  phone: '',
                  email: '',
                  address: '',
                  deliveryArea: '',
                  additionalNotes: ''
                });
                setSelectedDeliveryPrice(0);
                
                setIsProcessing(false);
                onClose();

            },
            onLoad: (response) => {
              console.log("onLoad: ", response);
            },
            onCancel: () => {
              console.log("onCancel");
            },
            onError: (error) => {
              console.log("Error: ", error.message); 
                toast({
                  title: "Order Placed Successfully! 🎉",
                  description: (
                    <Box> 
                      <Text fontSize="sm" mt={1}>{error.message}</Text>
                    </Box>
                  ),
                  status: "error",
                  duration: 10000,
                  isClosable: true,
                  position: "top",
                });
            }
          })
                

     
    }, 2000);
  };



  return ( 
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justifyContent={'space-between'} alignItems={'center'} mb={6} pb={4} borderBottom={'2px'} borderColor={'gray.200'}>
              <IconButton
                icon={<FaHome />}
                variant="ghost"
                size="lg"
                aria-label="Go home"
                as={Link}
                to={'/'}
              />
              
              <Flex align={'center'} gap={3}>
                <FaShoppingCart size={22} color="#2D3748" />
                <Badge colorScheme="blue" fontSize="lg" px={3} py={1} borderRadius="full">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </Badge>
              </Flex>
            </Flex>

            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              {/* Cart Items */}
              <GridItem>
                <VStack spacing={4} align="stretch">
                  {cartItems.length === 0 ? (
                    <Card>
                      <CardBody>
                        <VStack py={10} spacing={4}>
                          <FaShoppingCart size={60} color="#CBD5E0" />
                          <Text fontSize="xl" color="gray.500">Your cart is empty</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : (
                    cartItems.map((item) => (
                      <Card key={item.id} _hover={{ shadow: "lg" }} transition="all 0.2s">
                        <CardBody>
                          <Flex direction={{ base: "column", md: "row" }} gap={4}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              boxSize={{ base: "100%", md: "120px" }}
                              objectFit="cover"
                              borderRadius="md"
                            />
                            
                            <VStack align="start" flex={1} spacing={2}>
                              <Heading size="md" color="gray.700">{item.name}</Heading>
                              <HStack>
                                <Badge colorScheme="purple">{item.selectedUnit}</Badge>
                                <Text color="gray.600">Qty: {item.qty}</Text>
                              </HStack>
                              <HStack spacing={4} mt={2}>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="xs" color="gray.500">Unit Price</Text>
                                  <Text fontWeight="semibold" color="gray.700">
                                    {formatCurrency(getItemPrice(item))}
                                  </Text>
                                </VStack>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="xs" color="gray.500">Subtotal</Text>
                                  <Text fontWeight="bold" fontSize="lg" color="blue.600">
                                    {formatCurrency(getItemSubtotal(item))}
                                  </Text>
                                </VStack>
                              </HStack>
                            </VStack>

                            <Flex align="center">
                              <IconButton
                                icon={<FaTrash />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Remove item"
                                onClick={() => removeItem(item.id)}
                                size="lg"
                              />
                            </Flex>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))
                  )}
                </VStack>
              </GridItem>

              {/* Checkout Summary */}
              <GridItem>
                <Card position="sticky" top={4}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="gray.700">Order Summary</Heading>
                      <Divider />
                      
                      <VStack spacing={3} align="stretch">
                        {cartItems.map((item) => (
                          <HStack key={item.id} justify="space-between">
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {item.name} ({item.qty} {item.selectedUnit}{item.qty > 1 ? 's' : ''})
                            </Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {formatCurrency(getItemSubtotal(item))}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>

                      <Divider />

                      <HStack justify="space-between">
                        <Text color="gray.600">Subtotal</Text>
                        <Text fontWeight="semibold">{formatCurrency(getSubtotal())}</Text>
                      </HStack>

                      <HStack justify="space-between" py={2}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                          Total
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                          {formatCurrency(getSubtotal())}
                        </Text>
                      </HStack>

                      <Button
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        onClick={onOpen}
                        isDisabled={cartItems.length === 0}
                      >
                        Proceed to Checkout
                      </Button>

                      <VStack spacing={2} pt={4}>
                        <HStack fontSize="sm" color="gray.600">
                          <Text>🚚</Text>
                          <Text>Delivery fee calculated at checkout</Text>
                        </HStack>
                        <HStack fontSize="sm" color="gray.600">
                          <Text>🔒</Text>
                          <Text>Secure checkout guaranteed</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </VStack>
        </Container>

        {/* Checkout Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FaMapMarkerAlt color="#3182CE" />
                <Text>Delivery Information</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <FaUser />
                      <Text>Full Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <FaPhone />
                      <Text>Phone Number</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., 08012345678"
                    type="tel"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <Input
                    name="email"
                    value={deliveryInfo.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    type="email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Delivery Area in Abuja</FormLabel>
                  <Select
                    name="deliveryArea"
                    value={deliveryInfo.deliveryArea}
                    onChange={handleDeliveryAreaChange}
                    placeholder="Select your area"
                  >
                    {deliveryLocations.map((location) => (
                      <option key={location.area} value={location.area}>
                        {location.area} - {formatCurrency(location.price)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Delivery Address</FormLabel>
                  <Textarea
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address including house number and landmarks"
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <Textarea
                    name="additionalNotes"
                    value={deliveryInfo.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions?"
                    rows={2}
                  />
                </FormControl>

                <Divider />

                {/* Order Summary in Modal */}
                <Box w="full" bg="gray.50" p={4} borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <Heading size="sm" color="gray.700">Order Summary</Heading>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Items Subtotal</Text>
                      <Text fontSize="sm" fontWeight="medium">{formatCurrency(getSubtotal())}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Delivery Fee</Text>
                      <Text fontSize="sm" fontWeight="medium" color={selectedDeliveryPrice > 0 ? "green.600" : "gray.400"}>
                        {selectedDeliveryPrice > 0 ? formatCurrency(selectedDeliveryPrice) : "Select area"}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontWeight="bold" color="gray.800">Total Amount</Text>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {formatCurrency(getTotal())}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Stack direction={{ base: "column", sm: "row" }} w="full" spacing={3}>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    w="full"
                    isDisabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleCheckoutSubmit}
                    w="full"
                    isLoading={isProcessing}
                    loadingText="Processing..."
                  >
                    Place Order & Pay
                  </Button>
                </Stack>

                <Text fontSize="xs" color="gray.500" textAlign="center">
                  By placing this order, you agree to our terms and conditions
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box> 
  );
}