"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box, Flex, Text, Heading, Grid, Button, VStack, HStack, Icon, Divider, Center,
  FormControl, FormLabel, Input, InputGroup, InputLeftElement, useToast, Spinner
} from "@chakra-ui/react";
import { FiCheck, FiUser, FiCreditCard, FiCalendar, FiLock, FiMapPin } from "react-icons/fi";

const planDetails = {
  "1": { title: "1-Month Plan", price: 99, monthly: 99, features: ["24/7 Facility Access", "Standard Equipment"] },
  "3": { title: "3-Month Plan", price: 267, monthly: 89, features: ["24/7 Facility Access", "Elite Equipment", "IRON_CORE_CMS App"] },
  "6": { title: "6-Month Plan", price: 474, monthly: 79, features: ["24/7 Facility Access", "Elite Equipment", "IRON_CORE_CMS App"] },
  "12": { title: "Pro Elite Plan (12-Month)", price: 828, monthly: 69, features: ["24/7 Facility Access", "Elite Equipment Priority", "IRON_CORE_CMS Premium", "1x Monthly Coaching"] }
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const planParam = searchParams.get("plan") || "1"; 
  const selectedPlan = planDetails[planParam] || planDetails["1"];

  useEffect(() => {
    setIsMounted(true);
  }, []);

 const handlePurchase = () => {
  setLoading(true);
  
  setTimeout(() => {
    document.cookie = `pendingPlan=${planParam}; path=/; max-age=3600; SameSite=Strict`;
    
    setLoading(false);
    toast({ title: "Payment Successful!", status: "success" });
    router.push("/register"); 
  }, 2000);
};

  if (!isMounted) return null;

  return (
    <Box bg="#111" minH="100vh" color="white" py={20} px={6}>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1.2fr" }} gap={12} maxW="6xl" mx="auto">
        
        {/* Left Column: Summary */}
        <Box>
          <Heading fontSize="2xl" mb={8} letterSpacing="widest" textTransform="uppercase">Summary</Heading>
          
          <Box bg="#1a1a1a" borderRadius="xl" border="1px solid #2a2a2a" overflow="hidden">
            {/* Header / Banner Area */}
            <Box h="100px" bgGradient="linear(to-b, #222, #1a1a1a)" position="relative" p={6}>
              <Badge bg="rgba(204, 255, 0, 0.2)" color="#ccff00" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                SELECTED PLAN
              </Badge>
            </Box>
            
            <Box p={6}>
              <Flex justify="space-between" align="center" mb={2}>
                <Heading fontSize="xl">{selectedPlan.title}</Heading>
                <Flex align="baseline">
                  <Text fontSize="2xl" fontWeight="black" color="#ccff00">${selectedPlan.monthly}</Text>
                  <Text fontSize="xs" color="gray.500">/mo</Text>
                </Flex>
              </Flex>
              <Text fontSize="sm" color="gray.500" mb={8}>Billed totally ${selectedPlan.price}. Cancel anytime.</Text>

              <VStack align="stretch" spacing={3} mb={8}>
                {selectedPlan.features.map((feature, idx) => (
                  <HStack key={idx} spacing={3}>
                    <Icon as={FiCheck} color="#ccff00" />
                    <Text fontSize="sm" color="gray.300">{feature}</Text>
                  </HStack>
                ))}
              </VStack>

              <VStack align="stretch" spacing={2} mb={6} fontSize="sm">
                <Flex justify="space-between">
                  <Text color="gray.500">Subtotal</Text>
                  <Text>${selectedPlan.price}.00</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500">Initiation Fee</Text>
                  <Text color="#ccff00">$0.00</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500">Taxes</Text>
                  <Text>Calculated next</Text>
                </Flex>
              </VStack>

              <Divider borderColor="#333" mb={6} />

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">DUE TODAY</Text>
                <Text fontSize="3xl" fontWeight="black" color="#ccff00">${selectedPlan.price}.00</Text>
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box>
          <Heading fontSize="2xl" mb={8} letterSpacing="widest" textTransform="uppercase">Payment Details</Heading>
          
          <Box bg="#1a1a1a" p={8} borderRadius="xl" border="1px solid #2a2a2a">
            <VStack spacing={6} align="stretch">
              
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500" letterSpacing="widest">NAME ON CARD</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiUser} color="gray.500" /></InputLeftElement>
                  <Input bg="#111" border="1px solid #333" _focus={{ borderColor: "#ccff00" }} placeholder="JOHN DOE" />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" color="gray.500" letterSpacing="widest">CARD NUMBER</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiCreditCard} color="gray.500" /></InputLeftElement>
                  <Input bg="#111" border="1px solid #333" _focus={{ borderColor: "#ccff00" }} placeholder="0000 0000 0000 0000" />
                </InputGroup>
              </FormControl>

              <Grid templateColumns="1fr 1fr" gap={6}>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500" letterSpacing="widest">EXPIRY</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none"><Icon as={FiCalendar} color="gray.500" /></InputLeftElement>
                    <Input bg="#111" border="1px solid #333" _focus={{ borderColor: "#ccff00" }} placeholder="MM/YY" />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500" letterSpacing="widest">CVV</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none"><Icon as={FiLock} color="gray.500" /></InputLeftElement>
                    <Input type="password" bg="#111" border="1px solid #333" _focus={{ borderColor: "#ccff00" }} placeholder="•••" />
                  </InputGroup>
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel fontSize="xs" color="gray.500" letterSpacing="widest">BILLING ZIP</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiMapPin} color="gray.500" /></InputLeftElement>
                  <Input bg="#111" border="1px solid #333" _focus={{ borderColor: "#ccff00" }} placeholder="00000" />
                </InputGroup>
              </FormControl>

              <Divider borderColor="#333" my={2} />

              <Button 
                w="full" h="50px" bg="#ccff00" color="black" _hover={{ bg: "#b3e600" }} 
                leftIcon={<FiLock />} isLoading={loading} onClick={handlePurchase} fontWeight="bold" letterSpacing="widest"
              >
                COMPLETE PURCHASE
              </Button>
              
              <Text fontSize="xs" color="gray.500" textAlign="center">
                By completing your purchase, you agree to the <Text as="span" color="#ccff00" cursor="pointer">Terms of Service</Text>.
              </Text>
            </VStack>
          </Box>
        </Box>

      </Grid>
    </Box>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<Center h="100vh"><Spinner size="xl" color="#ccff00" thickness="4px" /></Center>}>
      <PaymentForm />
    </Suspense>
  );
}

const Badge = ({ children, ...props }) => <Box display="inline-block" {...props}>{children}</Box>;